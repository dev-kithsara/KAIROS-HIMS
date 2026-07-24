import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// In a real enterprise app, this secret must come from the .env file
// e.g., const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// For now, we use a hardcoded string for learning purposes.
const JWT_SECRET = 'kairos_hims_super_secret_key_2026';
const JWT_EXPIRES_IN = '24h'; // Token is valid for 24 hours

/**
 * Hash a plain text password using bcrypt
 * @param password - The plain text password
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // 10 is the industry standard for security vs performance
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hashed password
 * @param password - The plain text password entered by the user
 * @param hash - The hashed password from the database
 * @returns boolean indicating if they match
 */
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user
 * @param payload - The data to store in the token (e.g., userId, role)
 * @returns The signed JWT string
 */
export const generateToken = (payload: { id: number; role: string; departmentId: number }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 * @param token - The JWT string
 * @returns The decoded payload if valid
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // If token is expired or invalid, jwt.verify throws an error
    throw new Error('Invalid or expired token');
  }
};