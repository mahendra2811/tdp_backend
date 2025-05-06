import { Request, Response } from 'express';
import Blog, { IBlog } from '../models/Blog';
import { validationResult } from 'express-validator';

// Get all blogs with pagination
export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Only return published blogs for public API
    let filter: { isPublished?: boolean } = { isPublished: true };
    
    // Allow admin to see all blogs including unpublished
    if (req.query.admin === 'true') {
      filter = {};
    }
    
    const blogs = await Blog.find(filter)
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: blogs,
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get a single blog by slug
export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get a single blog by ID (for admin)
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Create a new blog
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    
    res.status(201).json({
      success: true,
      data: savedBlog,
    });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists',
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists',
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get related blogs
export const getRelatedBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }
    
    // Find blogs with similar tags, excluding the current blog
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
      tags: { $in: blog.tags }
    })
    .sort({ publishedDate: -1 })
    .limit(3);
    
    res.status(200).json({
      success: true,
      data: relatedBlogs,
    });
  } catch (error: any) {
    console.error('Error fetching related blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Search blogs
export const searchBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchTerm = req.query.q as string;
    
    if (!searchTerm) {
      res.status(400).json({
        success: false,
        message: 'Search term is required',
      });
      return;
    }
    
    const blogs = await Blog.find(
      { 
        $text: { $search: searchTerm },
        isPublished: true
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    console.error('Error searching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
