import mongoose, { Document, Schema } from 'mongoose';

// Interface for Booking document
export interface IBooking extends Document {
  name: string;
  phone: string;
  email?: string;
  country: string;
  otherCountry?: string;
  state?: string;
  district?: string;
  pincode?: string;
  checkInDate: Date;
  checkOutDate: Date;
  tourists: number;
  queries?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Booking
const BookingSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    otherCountry: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    tourists: {
      type: Number,
      required: [true, 'Number of tourists is required'],
      min: [1, 'At least one tourist is required'],
    },
    queries: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Booking model
export default mongoose.model<IBooking>('Booking', BookingSchema);
