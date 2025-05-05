const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tdp_database';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

// Create backups directory if it doesn't exist
const backupsDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const backupPath = path.join(backupsDir, `${DB_NAME}-${timestamp}`);

// Create backup directory for this backup
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath);
}

console.log('Starting MongoDB backup...');
console.log(`Database: ${DB_NAME}`);
console.log(`Backup location: ${backupPath}`);
console.log('---------------------------------------------------');

// Determine if we're using MongoDB Atlas or local MongoDB
const isAtlas = MONGODB_URI.includes('mongodb+srv');

if (isAtlas) {
  // For MongoDB Atlas
  const atlasCommand = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;
  
  exec(atlasCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during backup: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.log(`Backup process output: ${stderr}`);
    }
    
    console.log(`Backup completed successfully to: ${backupPath}`);
    console.log(`Backup size: ${getFolderSize(backupPath)}`);
  });
} else {
  // For local MongoDB
  const localCommand = `mongodump --host="localhost" --port="27017" --db="${DB_NAME}" --out="${backupPath}"`;
  
  exec(localCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during backup: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.log(`Backup process output: ${stderr}`);
    }
    
    console.log(`Backup completed successfully to: ${backupPath}`);
    console.log(`Backup size: ${getFolderSize(backupPath)}`);
    
    // Create a restore script for this backup
    createRestoreScript(backupPath, DB_NAME);
  });
}

// Function to calculate folder size
function getFolderSize(folderPath) {
  let totalSize = 0;
  
  function getAllFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        getAllFiles(filePath);
      }
    }
  }
  
  getAllFiles(folderPath);
  
  // Convert bytes to human-readable format
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = totalSize;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Function to create a restore script
function createRestoreScript(backupPath, dbName) {
  const restoreScriptPath = path.join(backupPath, 'restore.js');
  const restoreScriptContent = `
const { exec } = require('child_process');
const path = require('path');

// Path to the backup directory
const backupPath = __dirname;
const dbName = '${dbName}';

console.log('Starting MongoDB restore...');
console.log(\`Database: \${dbName}\`);
console.log(\`Backup source: \${backupPath}\`);
console.log('---------------------------------------------------');

// Restore command
const restoreCommand = \`mongorestore --db="\${dbName}" "\${path.join(backupPath, dbName)}"\`;

exec(restoreCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(\`Error during restore: \${error.message}\`);
    return;
  }
  
  if (stderr) {
    console.log(\`Restore process output: \${stderr}\`);
  }
  
  console.log(\`Restore completed successfully from: \${backupPath}\`);
});
`;

  fs.writeFileSync(restoreScriptPath, restoreScriptContent);
  console.log(`Restore script created: ${restoreScriptPath}`);
}