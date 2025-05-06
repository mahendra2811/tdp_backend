import express from 'express';
import { body } from 'express-validator';
import {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  searchBlogs,
} from '../controllers/BlogController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Validation middleware for creating/updating blogs
const blogValidation = [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters')
    .trim()
    .escape(),
  body('content').notEmpty().withMessage('Content is required'),
  body('coverImage').notEmpty().withMessage('Cover image is required'),
  body('author').notEmpty().withMessage('Author name is required').trim().escape(),
  body('tags').isArray().withMessage('Tags must be an array'),
  body('isPublished').isBoolean().optional(),
];

// Public routes
router.get('/', getAllBlogs);
router.get('/search', searchBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/related/:slug', getRelatedBlogs);

// Admin routes - protected with authentication
router.get('/admin', protect, getAllBlogs);
router.get('/admin/:id', protect, getBlogById);
router.post('/', protect, blogValidation, createBlog);
router.put('/:id', protect, blogValidation, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
