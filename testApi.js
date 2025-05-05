const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// API base URL
const API_BASE_URL = `http://localhost:${process.env.PORT || 5001}`;

// Generate a JWT token for authentication
const generateToken = () => {
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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${generateToken()}`
  }
});

// Test API endpoints
async function testApiEndpoints() {
  console.log('Testing API Endpoints');
  console.log('====================\n');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  try {
    // Test health endpoint (no auth required)
    console.log('1. Testing Health Endpoint');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data);
    console.log('-------------------\n');

    // Test bookings endpoint (auth required)
    console.log('2. Testing Bookings Endpoint');
    const bookingsResponse = await api.get('/api/bookings');
    console.log(`✅ Found ${bookingsResponse.data.length} bookings`);
    console.log('Sample booking:', bookingsResponse.data[0]);
    console.log('-------------------\n');

    // Test leads endpoint (auth required)
    console.log('3. Testing Leads Endpoint');
    const leadsResponse = await api.get('/api/leads');
    console.log(`✅ Found ${leadsResponse.data.length} leads`);
    console.log('Sample lead:', leadsResponse.data[0]);
    console.log('-------------------\n');

    // Test redirects endpoint (auth required)
    console.log('4. Testing Redirects Endpoint');
    const redirectsResponse = await api.get('/api/redirects');
    console.log(`✅ Found ${redirectsResponse.data.length} redirects`);
    console.log('Sample redirect:', redirectsResponse.data[0]);
    console.log('-------------------\n');

    // Test team applications endpoint (auth required)
    console.log('5. Testing Team Applications Endpoint');
    const teamAppsResponse = await api.get('/api/team-applications');
    console.log(`✅ Found ${teamAppsResponse.data.length} team applications`);
    console.log('Sample team application:', teamAppsResponse.data[0]);
    console.log('-------------------\n');

    console.log('All API tests completed successfully! ✅');

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure your backend server is running');
    console.log('2. Check if the PORT in .env matches the running server');
    console.log('3. Verify that JWT_SECRET is correctly set');
    console.log('4. Check if the API endpoints are correctly implemented');
  }
}

// Check if server is running before testing
axios.get(`${API_BASE_URL}/health`)
  .then(() => {
    console.log('Backend server is running. Starting API tests...\n');
    testApiEndpoints();
  })
  .catch(error => {
    console.error('❌ Backend server is not running or not accessible.');
    console.error('Please start the server with: cd backend_tdp && npm start');
    console.error('Error details:', error.message);
  });