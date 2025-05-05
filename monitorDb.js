const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tdp_database';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

// Collection names to monitor
const COLLECTIONS = ['bookings', 'leads', 'redirects', 'teamapplications', 'users'];

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log(`${colors.green}✓ Connected to MongoDB${colors.reset}`);
    return client;
  } catch (error) {
    console.error(`${colors.red}✗ MongoDB connection error:${colors.reset}`, error);
    process.exit(1);
  }
}

// Monitor collections for changes
async function monitorCollections(client) {
  const db = client.db();
  
  console.log(`\n${colors.bright}${colors.cyan}MongoDB Database Monitor${colors.reset}`);
  console.log(`${colors.dim}Monitoring database: ${colors.yellow}${DB_NAME}${colors.reset}`);
  console.log(`${colors.dim}Connection: ${colors.yellow}${MONGODB_URI}${colors.reset}`);
  console.log(`${colors.dim}Press Ctrl+C to exit${colors.reset}`);
  console.log('\n' + '-'.repeat(80) + '\n');
  
  // Get initial collection stats
  await displayCollectionStats(db);
  
  // Set up change streams for each collection
  for (const collectionName of COLLECTIONS) {
    try {
      const collection = db.collection(collectionName);
      const changeStream = collection.watch();
      
      changeStream.on('change', async (change) => {
        const timestamp = new Date().toISOString();
        console.log(`\n${colors.dim}[${timestamp}] ${colors.yellow}Change detected in ${colors.bright}${collectionName}${colors.reset}`);
        
        if (change.operationType === 'insert') {
          console.log(`${colors.green}✓ Document inserted:${colors.reset}`);
          console.log(JSON.stringify(change.fullDocument, null, 2));
        } else if (change.operationType === 'update') {
          console.log(`${colors.blue}✓ Document updated:${colors.reset}`);
          console.log(`Updated fields: ${JSON.stringify(change.updateDescription.updatedFields, null, 2)}`);
          if (change.updateDescription.removedFields.length > 0) {
            console.log(`Removed fields: ${JSON.stringify(change.updateDescription.removedFields, null, 2)}`);
          }
        } else if (change.operationType === 'delete') {
          console.log(`${colors.red}✓ Document deleted:${colors.reset}`);
          console.log(`Document ID: ${change.documentKey._id}`);
        } else if (change.operationType === 'replace') {
          console.log(`${colors.magenta}✓ Document replaced:${colors.reset}`);
          console.log(JSON.stringify(change.fullDocument, null, 2));
        }
        
        // Update collection stats after change
        await displayCollectionStats(db);
      });
      
      console.log(`${colors.green}✓ Monitoring collection: ${colors.bright}${collectionName}${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}✗ Error setting up change stream for ${collectionName}:${colors.reset}`, error);
    }
  }
}

// Display collection statistics
async function displayCollectionStats(db) {
  console.log(`\n${colors.cyan}Collection Statistics:${colors.reset}`);
  console.log('-'.repeat(80));
  console.log(`${colors.bright}Collection${' '.repeat(20 - 'Collection'.length)}| Documents${' '.repeat(15 - 'Documents'.length)}| Size${colors.reset}`);
  console.log('-'.repeat(80));
  
  for (const collectionName of COLLECTIONS) {
    try {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      const stats = await db.command({ collStats: collectionName });
      const size = formatBytes(stats.size);
      
      const paddedName = collectionName + ' '.repeat(Math.max(0, 20 - collectionName.length));
      const paddedCount = count.toString() + ' '.repeat(Math.max(0, 15 - count.toString().length));
      
      console.log(`${paddedName}| ${paddedCount}| ${size}`);
    } catch (error) {
      console.error(`${colors.red}✗ Error getting stats for ${collectionName}:${colors.reset}`, error);
    }
  }
  console.log('-'.repeat(80));
}

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Main function
async function main() {
  const client = await connectToMongoDB();
  await monitorCollections(client);
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log(`\n${colors.yellow}Closing MongoDB connection...${colors.reset}`);
    await client.close();
    console.log(`${colors.green}MongoDB connection closed${colors.reset}`);
    process.exit(0);
  });
}

// Run the main function
main().catch(console.error);