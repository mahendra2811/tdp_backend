import mongoose, { Document, Schema } from 'mongoose';

// Interface for Lead document
export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Lead
const LeadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Lead model
export default mongoose.model<ILead>('Lead', LeadSchema);