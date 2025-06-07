import jwt from 'jsonwebtoken';
import { getUser } from '../data/userAccess.js';
import permissions from './rolePermissions.js';

/**
 * Middleware to authenticate a user via JWT.
 */
export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    const parts = authHeader.split(' ');
    console.log("Auth Header:");
    console.log(authHeader);
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(400).json({ message: 'Malformed Authorization header' });
    }

    const token = authHeader?.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        try {
            user = await getUser(decoded.user_id);
        } catch (dbErr) {
            console.error("Database error fetching user:", dbErr);
            return res.status(500).json({ message: 'Server error retrieving user' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach full user and token payload to request
        req.user = user;
        req.auth = decoded;
        console.log("decoded in the backend",decoded);
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Authenticated user ${user.username} with role ${user.role}`);
        }

        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

/**
 * Middleware to enforce required permission based on user's role.
 */
export function requirePermission(requiredPermission) {
    return (req, res, next) => {
        const userRole = req.auth?.role;
        console.log("user role: ",userRole)
        console.log(!permissions[userRole])
        console.log(!permissions[userRole].includes(requiredPermission))
        if (!permissions[userRole] || !permissions[userRole].includes(requiredPermission)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
}

export default {
    authenticateToken,
    requirePermission
}