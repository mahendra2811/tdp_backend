import { body, param } from 'express-validator';

/**
 * Booking validation rules
 */
export const bookingValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('otherCountry')
    .if(body('country').equals('Other'))
    .trim()
    .notEmpty()
    .withMessage('Country name is required when "Other" is selected'),
  body('checkInDate')
    .notEmpty()
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Check-in date must be a valid date'),
  body('checkOutDate')
    .notEmpty()
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Check-out date must be a valid date'),
  body('tourists')
    .isInt({ min: 1 })
    .withMessage('Number of tourists must be at least 1'),
];

/**
 * Lead validation rules
 */
export const leadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
];

/**
 * Team application validation rules
 */
export const teamApplicationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason for joining is required'),
];

/**
 * Redirect validation rules
 */
export const redirectValidation = [
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('targetUrl')
    .trim()
    .notEmpty()
    .withMessage('Target URL is required')
    .isURL()
    .withMessage('Target URL must be a valid URL'),
  body('category')
    .optional()
    .isIn(['social', 'community', 'partner', 'other'])
    .withMessage('Category must be one of: social, community, partner, other'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value'),
];

/**
 * User registration validation rules
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  body('role')
    .optional()
    .isIn(['admin', 'editor'])
    .withMessage('Role must be either admin or editor'),
];

/**
 * Login validation rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Update profile validation rules
 */
export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
];

/**
 * Change password validation rules
 */
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('New password must contain at least one letter'),
];

/**
 * Update user validation rules (admin)
 */
export const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('role')
    .optional()
    .isIn(['admin', 'editor'])
    .withMessage('Role must be either admin or editor'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value'),
];

/**
 * ID parameter validation
 */
export const idParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];