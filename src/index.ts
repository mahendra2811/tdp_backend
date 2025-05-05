import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { verifyEmailConfig } from './config/email';
import bookingRoutes from './routes/bookingRoutes';
import leadRoutes from './routes/leadRoutes';
import teamApplicationRoutes from './routes/teamApplicationRoutes';
import redirectRoutes from './routes/redirectRoutes';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Verify email configuration
verifyEmailConfig();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Specific origin instead of wildcard
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/team-applications', teamApplicationRoutes);
app.use('/api/redirects', redirectRoutes);
app.use('/api/auth', authRoutes);

// Public redirect route
app.use('/r/:slug', (req: Request, res: Response) => {
  res.redirect(`/api/redirects/r/${req.params.slug}`);
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
  });
});

// Test login route (for debugging)
app.post('/api/test-login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Test login attempt:', { email, password });

  // Always return success for testing
  res.status(200).json({
    success: true,
    message: 'Test login successful',
    token: 'test-token-123',
    user: {
      _id: '123',
      name: 'Test Admin',
      email: email,
      role: 'admin',
      active: true
    }
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Thar Desert Photography API',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION:', err);
  // Close server & exit process
  process.exit(1);
});
