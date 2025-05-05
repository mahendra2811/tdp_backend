import mongoose, { Document, Schema } from 'mongoose';

// Interface for TeamApplication document
export interface ITeamApplication extends Document {
  name: string;
  mobile: string;
  email?: string;
  address: string;
  reason: string;
  extra?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for TeamApplication
const TeamApplicationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for joining is required'],
      trim: true,
    },
    extra: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the TeamApplication model
export default mongoose.model<ITeamApplication>('TeamApplication', TeamApplicationSchema);