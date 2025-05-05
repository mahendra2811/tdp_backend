const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tdp_database';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

// Test connection using Mongoose
async function testMongooseConnection() {
  console.log(`\n${colors.bright}Testing connection with Mongoose...${colors.reset}`);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}✓ Mongoose connection successful${colors.reset}`);
    
    // Get connection status
    const status = mongoose.connection.readyState;
    const statusText = status === 1 ? 'connected' : 
                      status === 2 ? 'connecting' : 
                      status === 3 ? 'disconnecting' : 'disconnected';
    
    console.log(`${colors.bright}Connection status:${colors.reset} ${statusText}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log(`${colors.blue}Mongoose connection closed${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Mongoose connection error:${colors.reset}`, error.message);
    return false;
  }
}

// Test connection using MongoDB native driver
async function testMongoClientConnection() {
  console.log(`\n${colors.bright}Testing connection with MongoDB native driver...${colors.reset}`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log(`${colors.green}✓ MongoDB client connection successful${colors.reset}`);
    
    // Ping the database
    await client.db().command({ ping: 1 });
    console.log(`${colors.green}✓ Database ping successful${colors.reset}`);
    
    // Close connection
    await client.close();
    console.log(`${colors.blue}MongoDB client connection closed${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ MongoDB client connection error:${colors.reset}`, error.message);
    
    if (client) {
      await client.close();
    }
    
    return false;
  }
}

// Get database information
async function getDatabaseInfo() {
  console.log(`\n${colors.bright}Retrieving database information...${colors.reset}`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Get collections
    const collections = await db.listCollections().toArray();
    console.log(`${colors.green}✓ Found ${collections.length} collections${colors.reset}`);
    
    // Get collection stats
    console.log(`\n${colors.cyan}Collection Statistics:${colors.reset}`);
    console.log('-'.repeat(60));
    console.log(`${colors.bright}Collection${' '.repeat(20 - 'Collection'.length)}| Documents${colors.reset}`);
    console.log('-'.repeat(60));
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      const paddedName = collection.name + ' '.repeat(Math.max(0, 20 - collection.name.length));
      console.log(`${paddedName}| ${count}`);
    }
    console.log('-'.repeat(60));
    
    // Close connection
    await client.close();
    
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Error retrieving database information:${colors.reset}`, error.message);
    
    if (client) {
      await client.close();
    }
    
    return false;
  }
}

// Main function
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}MongoDB Connection Test${colors.reset}`);
  console.log('-'.repeat(60));
  console.log(`${colors.bright}Connection URI:${colors.reset} ${MONGODB_URI}`);
  console.log(`${colors.bright}Database name:${colors.reset} ${DB_NAME}`);
  console.log(`${colors.bright}Connection type:${colors.reset} ${MONGODB_URI.includes('mongodb+srv://') ? 'MongoDB Atlas' : 'Local MongoDB'}`);
  console.log('-'.repeat(60));
  
  // Test connections
  const mongooseSuccess = await testMongooseConnection();
  const mongoClientSuccess = await testMongoClientConnection();
  
  // Get database info if connections were successful
  if (mongooseSuccess && mongoClientSuccess) {
    await getDatabaseInfo();
  }
  
  // Print summary
  console.log(`\n${colors.bright}${colors.cyan}Connection Test Summary${colors.reset}`);
  console.log('-'.repeat(60));
  console.log(`${colors.bright}Mongoose connection:${colors.reset} ${mongooseSuccess ? colors.green + 'Success' : colors.red + 'Failed'}`);
  console.log(`${colors.bright}MongoDB client connection:${colors.reset} ${mongoClientSuccess ? colors.green + 'Success' : colors.red + 'Failed'}`);
  console.log('-'.repeat(60));
  
  if (mongooseSuccess && mongoClientSuccess) {
    console.log(`\n${colors.green}${colors.bright}All connection tests passed successfully!${colors.reset}`);
    console.log(`Your application should be able to connect to the database without issues.`);
  } else {
    console.log(`\n${colors.red}${colors.bright}Some connection tests failed.${colors.reset}`);
    console.log(`Please check your connection string and make sure MongoDB is running.`);
    
    // Troubleshooting tips
    console.log(`\n${colors.yellow}${colors.bright}Troubleshooting tips:${colors.reset}`);
    console.log(`1. Make sure MongoDB is running on your machine`);
    console.log(`2. Check if the connection string in .env is correct`);
    console.log(`3. If using MongoDB Atlas, check if your IP is whitelisted`);
    console.log(`4. Try using the switchDb.js script to switch to a different connection`);
  }
}

// Run the main function
main()
  .catch(console.error)
  .finally(() => {
    // Ensure mongoose connection is closed
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }
  });