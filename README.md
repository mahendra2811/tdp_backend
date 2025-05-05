# Thar Desert Photography Backend

This is the backend server for Thar Desert Photography website. It provides APIs for bookings, leads, team applications, redirects, and user authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/tdp_database

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration (Mailtrap live service)
EMAIL_HOST=live.smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USER=api
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@thardesertphotography.com
```

### 3. Set Up Mailtrap for Email Sending

The project is already configured to use Mailtrap's live email sending service:

1. The configuration is already set in your `.env` file:

   - `EMAIL_HOST=live.smtp.mailtrap.io`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=api`
   - `EMAIL_PASS=your_mailtrap_password`
   - `EMAIL_FROM=noreply@thardesertphotography.com`

2. **Important: Domain Verification Requirement**

   When using Mailtrap's live SMTP service:

   - You must verify ownership of any domain you want to send from
   - The `EMAIL_FROM` address must use a domain you've verified with Mailtrap
   - You cannot send from domains you don't own or haven't verified

   To verify your domain with Mailtrap:

   - Log in to your Mailtrap account
   - Navigate to the domain verification section
   - Add your domain (e.g., thardesertphotography.com)
   - Follow their instructions to add DNS records to prove ownership
   - Once verified, you can send from any email address at that domain

3. **Alternative for Testing**

   If you're just testing and don't need real email delivery:

   - Consider using Mailtrap's sandbox/testing environment instead
   - This doesn't have domain verification requirements
   - Update your `.env` file with the sandbox credentials from your Mailtrap account

4. You can test the email configuration by running:
   ```bash
   node testEmail.js
   ```

### 4. Start the Server

You can start the server using either of these methods:

#### Standard Method

```bash
npm start
```

#### With Logging (Recommended)

```bash
node startServer.js
```

This will:

- Create a logs directory if it doesn't exist
- Log all server output to date-stamped log files
- Display server output in the console
- Gracefully handle server shutdown

The server will start on the port specified in your `.env` file (default: 5001).

## Database Setup

### Connect to MongoDB Compass

1. Install [MongoDB Compass](https://www.mongodb.com/products/compass) if you haven't already
2. Open MongoDB Compass
3. Connect to: `mongodb://localhost:27017/tdp_database`

### Seed Sample Data

To populate your database with sample data:

```bash
node seedData.js
```

This will create sample data for:

- Bookings
- Leads
- Redirects
- Team Applications
- Users

## Development Tools

### Monitor Database in Real-time

To monitor your MongoDB database in real-time:

```bash
node monitorDb.js
```

This tool provides:

- Real-time monitoring of all collections
- Notifications when documents are inserted, updated, or deleted
- Collection statistics (document count and size)
- Colorized console output for better readability

### Backup Database

To create a backup of your MongoDB database:

```bash
node backupDb.js
```

This tool:

- Creates a timestamped backup of your database
- Works with both local MongoDB and MongoDB Atlas
- Automatically generates a restore script for each backup
- Stores backups in a `backups` directory
- Calculates and displays the backup size

To restore a backup, navigate to the backup directory and run:

```bash
node restore.js
```

### Switch Database Connection

To easily switch between local MongoDB and MongoDB Atlas:

```bash
node switchDb.js
```

This interactive tool allows you to:

- View your current MongoDB connection
- Switch to local MongoDB
- Switch to MongoDB Atlas
- Enter a custom MongoDB URI
- Automatically backs up your previous configuration

### Test Database Connection

To verify your MongoDB connection is working properly:

```bash
node testConnection.js
```

This diagnostic tool:

- Tests connection using both Mongoose and MongoDB native driver
- Retrieves and displays database information
- Shows collection statistics
- Provides troubleshooting tips if connection fails
- Works with both local MongoDB and MongoDB Atlas

### Generate JWT Token

To generate a JWT token for API testing:

```bash
node generateToken.js
```

This will output a token that you can use in the Authorization header for authenticated API requests.

### Test Email Configuration

To verify your email configuration:

```bash
node testEmail.js
```

If using Mailtrap, you'll see the test email in your Mailtrap inbox.

### Test API Endpoints

To test the API endpoints with the sample data:

```bash
node testApi.js
```

This will test the following endpoints:

- Health check: `/health`
- Bookings: `/api/bookings`
- Leads: `/api/leads`
- Redirects: `/api/redirects`
- Team Applications: `/api/team-applications`

## Sample User Credentials

The seed data includes two user accounts:

1. **Admin User**

   - Email: admin@thardesertphotography.com
   - Password: Admin@123

2. **Editor User**
   - Email: editor@thardesertphotography.com
   - Password: Editor@123

## API Documentation

### Authentication

All API endpoints (except `/health` and public redirects) require authentication using JWT.

Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

### Available Endpoints

- `GET /health` - Health check endpoint
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `GET /api/redirects` - Get all redirects
- `POST /api/redirects` - Create a new redirect
- `GET /api/team-applications` - Get all team applications
- `POST /api/team-applications` - Create a new team application
- `POST /api/auth/login` - User login
