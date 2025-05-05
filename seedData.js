const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to the local MongoDB
mongoose.connect('mongodb://localhost:27017/tdp_database')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schemas based on your models
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  country: String,
  otherCountry: String,
  state: String,
  district: String,
  pincode: String,
  checkInDate: Date,
  checkOutDate: Date,
  tourists: Number,
  queries: String,
  status: String,
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  status: String,
}, { timestamps: true });

const redirectSchema = new mongoose.Schema({
  slug: String,
  targetUrl: String,
  description: String,
  category: String,
  active: Boolean,
  clickCount: Number,
}, { timestamps: true });

const teamApplicationSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  address: String,
  reason: String,
  extra: String,
  status: String,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  active: Boolean,
  lastLogin: Date,
}, { timestamps: true });

// Create models
const Booking = mongoose.model('Booking', bookingSchema);
const Lead = mongoose.model('Lead', leadSchema);
const Redirect = mongoose.model('Redirect', redirectSchema);
const TeamApplication = mongoose.model('TeamApplication', teamApplicationSchema);
const User = mongoose.model('User', userSchema);

// Sample data for Bookings
const bookings = [
  {
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.sharma@example.com',
    country: 'India',
    state: 'Rajasthan',
    district: 'Jaipur',
    pincode: '302001',
    checkInDate: new Date('2025-06-15'),
    checkOutDate: new Date('2025-06-18'),
    tourists: 2,
    queries: 'Do you provide photography equipment?',
    status: 'confirmed'
  },
  {
    name: 'Priya Patel',
    phone: '+91 8765432109',
    email: 'priya.patel@example.com',
    country: 'India',
    state: 'Gujarat',
    district: 'Ahmedabad',
    pincode: '380001',
    checkInDate: new Date('2025-07-10'),
    checkOutDate: new Date('2025-07-13'),
    tourists: 4,
    queries: 'Is there a discount for a group of 4?',
    status: 'pending'
  },
  {
    name: 'John Smith',
    phone: '+1 2345678901',
    email: 'john.smith@example.com',
    country: 'United States',
    otherCountry: 'USA',
    state: 'California',
    checkInDate: new Date('2025-08-05'),
    checkOutDate: new Date('2025-08-10'),
    tourists: 2,
    queries: 'What camera equipment do you recommend bringing?',
    status: 'confirmed'
  },
  {
    name: 'Amit Kumar',
    phone: '+91 7654321098',
    email: 'amit.kumar@example.com',
    country: 'India',
    state: 'Delhi',
    district: 'New Delhi',
    pincode: '110001',
    checkInDate: new Date('2025-09-20'),
    checkOutDate: new Date('2025-09-22'),
    tourists: 1,
    status: 'pending'
  },
  {
    name: 'Emma Wilson',
    phone: '+44 7890123456',
    email: 'emma.wilson@example.com',
    country: 'United Kingdom',
    otherCountry: 'UK',
    checkInDate: new Date('2025-10-15'),
    checkOutDate: new Date('2025-10-20'),
    tourists: 3,
    queries: 'Are there any special photography spots you recommend?',
    status: 'confirmed'
  }
];

// Sample data for Leads
const leads = [
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 9876543211',
    message: 'Interested in bird photography tours',
    status: 'new'
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    phone: '+91 8765432108',
    message: 'Looking for wildlife photography workshops',
    status: 'contacted'
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 3456789012',
    message: 'Interested in desert landscape photography',
    status: 'converted'
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.reddy@example.com',
    phone: '+91 7654321097',
    message: 'Want to know more about your photography packages',
    status: 'new'
  },
  {
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+33 6789012345',
    message: 'Interested in reptile photography in Rajasthan',
    status: 'contacted'
  }
];

// Sample data for Redirects
const redirects = [
  {
    slug: 'instagram',
    targetUrl: 'https://www.instagram.com/thar_desert_photography/',
    description: 'Our Instagram page',
    category: 'social',
    active: true,
    clickCount: 145
  },
  {
    slug: 'facebook',
    targetUrl: 'https://www.facebook.com/thardesertphotography',
    description: 'Our Facebook page',
    category: 'social',
    active: true,
    clickCount: 87
  },
  {
    slug: 'bird-tour',
    targetUrl: 'https://thardesertphotography.com/birds',
    description: 'Bird photography tour page',
    category: 'partner',
    active: true,
    clickCount: 56
  },
  {
    slug: 'wildlife-workshop',
    targetUrl: 'https://thardesertphotography.com/workshops/wildlife',
    description: 'Wildlife photography workshop',
    category: 'community',
    active: true,
    clickCount: 32
  },
  {
    slug: 'contact',
    targetUrl: 'https://thardesertphotography.com/contact',
    description: 'Contact page shortlink',
    category: 'other',
    active: true,
    clickCount: 98
  }
];

// Sample data for Team Applications
const teamApplications = [
  {
    name: 'Arjun Mehta',
    mobile: '+91 9876543212',
    email: 'arjun.mehta@example.com',
    address: '123 Park Street, Jaipur, Rajasthan',
    reason: 'Passionate wildlife photographer with 5 years of experience',
    extra: 'Have published in National Geographic',
    status: 'pending'
  },
  {
    name: 'Divya Sharma',
    mobile: '+91 8765432107',
    email: 'divya.sharma@example.com',
    address: '456 Lake Road, Jodhpur, Rajasthan',
    reason: 'Local guide with knowledge of desert wildlife',
    status: 'reviewed'
  },
  {
    name: 'Raj Kapoor',
    mobile: '+91 7654321096',
    email: 'raj.kapoor@example.com',
    address: '789 Desert View, Jaisalmer, Rajasthan',
    reason: 'Bird photography specialist with 8 years of experience',
    extra: 'Can speak multiple languages to help with international tourists',
    status: 'accepted'
  },
  {
    name: 'Meera Patel',
    mobile: '+91 6543210987',
    email: 'meera.patel@example.com',
    address: '234 Green Avenue, Bikaner, Rajasthan',
    reason: 'Photography instructor with focus on desert landscapes',
    status: 'pending'
  },
  {
    name: 'Sanjay Kumar',
    mobile: '+91 5432109876',
    email: 'sanjay.kumar@example.com',
    address: '567 Mountain View, Udaipur, Rajasthan',
    reason: 'Experienced tour guide with knowledge of reptiles',
    extra: 'Have worked with Discovery Channel',
    status: 'rejected'
  }
];

// Sample data for Users (with hashed passwords)
async function createUsers() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword1 = await bcrypt.hash('Admin@123', salt);
  const hashedPassword2 = await bcrypt.hash('Editor@123', salt);
  
  return [
    {
      name: 'Admin User',
      email: 'admin@thardesertphotography.com',
      password: hashedPassword1,
      role: 'admin',
      active: true,
      lastLogin: new Date()
    },
    {
      name: 'Editor User',
      email: 'editor@thardesertphotography.com',
      password: hashedPassword2,
      role: 'editor',
      active: true,
      lastLogin: new Date('2025-05-01')
    }
  ];
}

// Function to insert sample data
async function seedDatabase() {
  try {
    // Clear existing data
    await Booking.deleteMany({});
    await Lead.deleteMany({});
    await Redirect.deleteMany({});
    await TeamApplication.deleteMany({});
    await User.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert new data
    await Booking.insertMany(bookings);
    await Lead.insertMany(leads);
    await Redirect.insertMany(redirects);
    await TeamApplication.insertMany(teamApplications);
    
    const users = await createUsers();
    await User.insertMany(users);
    
    console.log('Sample data inserted successfully');
    console.log(`Added ${bookings.length} bookings`);
    console.log(`Added ${leads.length} leads`);
    console.log(`Added ${redirects.length} redirects`);
    console.log(`Added ${teamApplications.length} team applications`);
    console.log(`Added ${users.length} users`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();