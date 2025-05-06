import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  publishedDate: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a text index for search functionality
BlogSchema.index(
  { title: 'text', description: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 3, content: 1 } }
);

// Pre-save hook to generate slug from title if not provided
BlogSchema.pre('save', function (this: any, next) {
  if (!this.isModified('title') && this.slug) {
    return next();
  }

  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  next();
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
