import jwt from 'jsonwebtoken';
import db from '../../../../../lib/db';  // Adjust this path to your actual database setup

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '0ddc73107be361d2e50343de3b53a4b54d8d5721ccac5514eb0b3da879c3abe1'; // Your secret key for JWT verification

// Helper function to verify the JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    return null;  // If token is invalid, return null
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Extract token from Authorization header (e.g., "Bearer <token>")
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ authenticated: false, message: 'No token provided' });
    }

    // Verify and decode the token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ authenticated: false, message: 'Invalid token' });
    }

    try {
      // Query the database to get user details using the decoded ID from the token
      const [rows] = await db.query('SELECT * FROM `admin` WHERE `id` = ?', [decoded.id]);
      const admin = rows[0];

      if (!admin) {
        return res.status(401).json({ authenticated: false, message: 'Admin not found' });
      }

      // Return the admin role and authenticated status
      return res.status(200).json({
        authenticated: true,
        admin: {
          id: admin.id,
          role: admin.role, // Ensure the role is returned here
        },
      });
    } catch (error) {
      console.error('[CheckAuth] DB error:', error);
      return res.status(500).json({ authenticated: false, message: 'Server error' });
    }
  } else {
    // If method is not GET, return Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
