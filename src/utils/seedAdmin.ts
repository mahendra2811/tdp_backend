import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { connectDB } from '../config/database';

// Load environment variables
dotenv.config();

/**
 * Seed the database with an initial admin user
 */
const seedAdmin = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@thardesertphotography.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@thardesertphotography.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      active: true,
    });

    await admin.save();
    console.log('Admin user created successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');

    process.exit(0);
  } catch (error: any) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
