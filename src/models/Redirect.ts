import mongoose, { Document, Schema } from 'mongoose';

// Interface for Redirect document
export interface IRedirect extends Document {
  slug: string;
  targetUrl: string;
  description?: string;
  category: 'social' | 'community' | 'partner' | 'other';
  active: boolean;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Redirect
const RedirectSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    targetUrl: {
      type: String,
      required: [true, 'Target URL is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['social', 'community', 'partner', 'other'],
      default: 'other',
    },
    active: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Redirect model
export default mongoose.model<IRedirect>('Redirect', RedirectSchema);