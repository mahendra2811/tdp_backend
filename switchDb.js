const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Path to .env file
const envPath = path.join(__dirname, '.env');

// Read current .env file
function readEnvFile() {
  try {
    return fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.error(`${colors.red}Error reading .env file:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Write to .env file
function writeEnvFile(content) {
  try {
    fs.writeFileSync(envPath, content);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error writing to .env file:${colors.reset}`, error.message);
    return false;
  }
}

// Extract MongoDB URI from .env content
function extractMongoDbUri(envContent) {
  const regex = /^MONGODB_URI=(.*)$/m;
  const match = envContent.match(regex);
  return match ? match[1] : null;
}

// Check if a string is a valid MongoDB URI
function isValidMongoDbUri(uri) {
  return uri && (
    uri.startsWith('mongodb://') || 
    uri.startsWith('mongodb+srv://')
  );
}

// Update MongoDB URI in .env content
function updateMongoDbUri(envContent, newUri) {
  return envContent.replace(
    /^MONGODB_URI=.*$/m,
    `MONGODB_URI=${newUri}`
  );
}

// Main function
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}MongoDB Connection Switcher${colors.reset}`);
  console.log(`${colors.yellow}This tool helps you switch between local MongoDB and MongoDB Atlas${colors.reset}`);
  console.log('---------------------------------------------------\n');
  
  // Read current .env file
  const envContent = readEnvFile();
  
  // Extract current MongoDB URI
  const currentUri = extractMongoDbUri(envContent);
  
  if (!currentUri) {
    console.error(`${colors.red}Could not find MONGODB_URI in .env file${colors.reset}`);
    rl.close();
    return;
  }
  
  // Determine current connection type
  const isAtlas = currentUri.includes('mongodb+srv://');
  
  console.log(`${colors.bright}Current connection:${colors.reset} ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}`);
  console.log(`${colors.bright}URI:${colors.reset} ${currentUri}\n`);
  
  // Find commented MongoDB URIs in .env file
  const localUriMatch = envContent.match(/^#\s*MONGODB_URI=(mongodb:\/\/[^+].*$)/m);
  const atlasUriMatch = envContent.match(/^#\s*MONGODB_URI=(mongodb\+srv:\/\/.*$)/m);
  
  const localUri = localUriMatch ? localUriMatch[1] : 'mongodb://localhost:27017/tdp_database';
  const atlasUri = atlasUriMatch ? atlasUriMatch[1] : null;
  
  // Display options
  console.log(`${colors.bright}Available connections:${colors.reset}`);
  console.log(`${colors.green}1. Local MongoDB:${colors.reset} ${localUri}`);
  
  if (atlasUri) {
    console.log(`${colors.green}2. MongoDB Atlas:${colors.reset} ${atlasUri}`);
  } else {
    console.log(`${colors.yellow}2. MongoDB Atlas:${colors.reset} Not configured`);
  }
  
  console.log(`${colors.green}3. Custom URI${colors.reset}`);
  console.log(`${colors.green}4. Exit${colors.reset}\n`);
  
  // Ask user for choice
  rl.question(`${colors.bright}Select an option (1-4):${colors.reset} `, async (choice) => {
    let newUri = null;
    
    switch (choice) {
      case '1':
        newUri = localUri;
        break;
      case '2':
        if (atlasUri) {
          newUri = atlasUri;
        } else {
          console.log(`\n${colors.yellow}MongoDB Atlas URI not found in .env file.${colors.reset}`);
          rl.question(`${colors.bright}Enter MongoDB Atlas URI:${colors.reset} `, (uri) => {
            if (isValidMongoDbUri(uri)) {
              handleUriUpdate(uri);
            } else {
              console.error(`\n${colors.red}Invalid MongoDB URI${colors.reset}`);
              rl.close();
            }
          });
          return;
        }
        break;
      case '3':
        rl.question(`${colors.bright}Enter custom MongoDB URI:${colors.reset} `, (uri) => {
          if (isValidMongoDbUri(uri)) {
            handleUriUpdate(uri);
          } else {
            console.error(`\n${colors.red}Invalid MongoDB URI${colors.reset}`);
            rl.close();
          }
        });
        return;
      case '4':
        console.log(`\n${colors.bright}Exiting without changes${colors.reset}`);
        rl.close();
        return;
      default:
        console.error(`\n${colors.red}Invalid option${colors.reset}`);
        rl.close();
        return;
    }
    
    if (newUri) {
      handleUriUpdate(newUri);
    }
  });
}

// Handle URI update
function handleUriUpdate(newUri) {
  // Read current .env file again to ensure we have the latest version
  const envContent = readEnvFile();
  
  // Update MongoDB URI in .env content
  const updatedEnvContent = updateMongoDbUri(envContent, newUri);
  
  // Write updated content to .env file
  if (writeEnvFile(updatedEnvContent)) {
    const isAtlas = newUri.includes('mongodb+srv://');
    console.log(`\n${colors.green}Successfully switched to ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}${colors.reset}`);
    console.log(`${colors.bright}New URI:${colors.reset} ${newUri}`);
    
    // Backup the current .env file
    const backupPath = path.join(__dirname, '.env.backup');
    fs.writeFileSync(backupPath, envContent);
    console.log(`${colors.yellow}Backup of previous configuration saved to:${colors.reset} ${backupPath}`);
  } else {
    console.error(`\n${colors.red}Failed to update .env file${colors.reset}`);
  }
  
  rl.close();
}

// Run the main function
main().catch(console.error);