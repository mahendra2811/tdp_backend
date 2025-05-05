import jwt from 'jsonwebtoken';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token
 * @param payload The data to be encoded in the JWT
 * @returns The JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  // Using any type to bypass TypeScript issues with jsonwebtoken
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  } as any);
};

/**
 * Verify a JWT token
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};