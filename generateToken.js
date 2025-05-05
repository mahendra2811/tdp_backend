const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read JWT secret from .env file
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

if (!JWT_SECRET) {
  console.error('JWT_SECRET not found in .env file');
  process.exit(1);
}

// Create a payload for the token (using admin user from our sample data)
const payload = {
  id: '65a1b2c3d4e5f6a7b8c9d0e1', // This is a placeholder ID
  email: 'admin@thardesertphotography.com',
  role: 'admin'
};

// Generate the token
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

console.log('\nJWT Token for API Testing:');
console.log('==========================');
console.log(token);
console.log('\nUse this token in the Authorization header:');
console.log('Authorization: Bearer ' + token);
console.log('\nThis token will expire in', JWT_EXPIRE);