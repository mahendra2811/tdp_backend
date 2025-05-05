import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Redirect from '../models/Redirect';

/**
 * Create a new redirect
 * @route POST /api/redirects
 * @access Private (Admin)
 */
export const createRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Check if slug already exists
    const existingRedirect = await Redirect.findOne({ slug: req.body.slug });
    if (existingRedirect) {
      res.status(400).json({
        success: false,
        message: 'A redirect with this slug already exists',
      });
      return;
    }

    // Create new redirect
    const redirect = new Redirect(req.body);
    await redirect.save();

    res.status(201).json({
      success: true,
      message: 'Redirect created successfully',
      data: redirect,
    });
  } catch (error: any) {
    console.error('Error creating redirect:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get all redirects
 * @route GET /api/redirects
 * @access Private (Admin)
 */
export const getRedirects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get query parameters for filtering
    const { category } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    
    const redirects = await Redirect.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: redirects.length,
      data: redirects,
    });
  } catch (error: any) {
    console.error('Error fetching redirects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get a single redirect by ID
 * @route GET /api/redirects/:id
 * @access Private (Admin)
 */
export const getRedirectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const redirect = await Redirect.findById(req.params.id);
    
    if (!redirect) {
      res.status(404).json({
        success: false,
        message: 'Redirect not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: redirect,
    });
  } catch (error: any) {
    console.error('Error fetching redirect:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update a redirect
 * @route PUT /api/redirects/:id
 * @access Private (Admin)
 */
export const updateRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    
    // If slug is being updated, check if it already exists
    if (req.body.slug) {
      const existingRedirect = await Redirect.findOne({ 
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });
      
      if (existingRedirect) {
        res.status(400).json({
          success: false,
          message: 'A redirect with this slug already exists',
        });
        return;
      }
    }
    
    const redirect = await Redirect.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!redirect) {
      res.status(404).json({
        success: false,
        message: 'Redirect not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Redirect updated successfully',
      data: redirect,
    });
  } catch (error: any) {
    console.error('Error updating redirect:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete a redirect
 * @route DELETE /api/redirects/:id
 * @access Private (Admin)
 */
export const deleteRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const redirect = await Redirect.findByIdAndDelete(req.params.id);
    
    if (!redirect) {
      res.status(404).json({
        success: false,
        message: 'Redirect not found',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Redirect deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting redirect:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Handle redirect by slug
 * @route GET /r/:slug
 * @access Public
 */
export const handleRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    // Find the redirect by slug
    const redirect = await Redirect.findOne({ slug, active: true });
    
    if (!redirect) {
      res.status(404).json({
        success: false,
        message: 'Redirect not found or inactive',
      });
      return;
    }
    
    // Increment click count
    redirect.clickCount += 1;
    await redirect.save();
    
    // Redirect to target URL
    res.redirect(redirect.targetUrl);
  } catch (error: any) {
    console.error('Error handling redirect:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};