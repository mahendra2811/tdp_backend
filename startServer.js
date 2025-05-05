const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create log file streams
const date = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const outLog = fs.createWriteStream(path.join(logsDir, `server-${date}.log`));
const errLog = fs.createWriteStream(path.join(logsDir, `server-error-${date}.log`));

console.log('Starting Thar Desert Photography Backend Server...');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Port: ${process.env.PORT || 5001}`);
console.log(`MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/tdp_database'}`);
console.log(`Log files: ${logsDir}`);
console.log('---------------------------------------------------');

// Start the server
const server = spawn('node', ['dist/index.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env
});

// Pipe output to console and log files
server.stdout.pipe(process.stdout);
server.stderr.pipe(process.stderr);
server.stdout.pipe(outLog);
server.stderr.pipe(errLog);

// Handle server exit
server.on('exit', (code, signal) => {
  const exitMessage = `Server exited with code ${code} and signal ${signal}`;
  console.log(exitMessage);
  fs.appendFileSync(path.join(logsDir, `server-${date}.log`), `\n${exitMessage}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});