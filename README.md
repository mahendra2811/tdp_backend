# Thar Desert Photography Backend

This is the backend API for the Thar Desert Photography website. It provides endpoints for handling bookings, leads, team applications, and dynamic redirects.

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email notifications

## Features

- Form handling for:
  - Booking requests
  - Lead generation
  - Team applications
- Dynamic redirects for social media and community links
- Admin dashboard API for managing:
  - Bookings
  - Leads
  - Team applications
  - Redirects
  - Users
- Email notifications for form submissions
- JWT-based authentication and authorization

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend_tdp
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/tdp_database
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ADMIN_PASSWORD=your_admin_password
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=your_email@example.com
   ADMIN_EMAIL=admin@example.com
   ```
5. Build the project:
   ```
   npm run build
   ```
6. Seed the database with an admin user:
   ```
   npm run seed
   ```

### Running the Server

#### Development Mode
```
npm run dev
```

#### Production Mode
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update current user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:id` - Update user (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings (admin only)
- `GET /api/bookings/:id` - Get a booking by ID (admin only)
- `PATCH /api/bookings/:id` - Update booking status (admin only)
- `DELETE /api/bookings/:id` - Delete a booking (admin only)

### Leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads (admin only)
- `GET /api/leads/:id` - Get a lead by ID (admin only)
- `PATCH /api/leads/:id` - Update lead status (admin only)
- `DELETE /api/leads/:id` - Delete a lead (admin only)

### Team Applications
- `POST /api/team-applications` - Create a new team application
- `GET /api/team-applications` - Get all team applications (admin only)
- `GET /api/team-applications/:id` - Get a team application by ID (admin only)
- `PATCH /api/team-applications/:id` - Update team application status (admin only)
- `DELETE /api/team-applications/:id` - Delete a team application (admin only)

### Redirects
- `GET /r/:slug` - Handle redirect by slug (public)
- `POST /api/redirects` - Create a new redirect (admin only)
- `GET /api/redirects` - Get all redirects (admin only)
- `GET /api/redirects/:id` - Get a redirect by ID (admin only)
- `PUT /api/redirects/:id` - Update a redirect (admin only)
- `DELETE /api/redirects/:id` - Delete a redirect (admin only)

## License

This project is proprietary and confidential.