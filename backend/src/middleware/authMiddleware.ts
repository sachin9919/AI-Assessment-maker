import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

/**
 * Middleware to verify JWT token
 * Extracts user ID from token and attaches to request
 */
export const verifyAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        if (!config.jwtSecret) {
            res.status(500).json({
                success: false,
                message: 'Server auth is not configured',
            });
            return;
        }

        // Get token from cookie or Authorization header
        const token =
            req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided',
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            config.jwtSecret
        ) as { id: string; email: string };

        // Attach user data to request
        req.userId = decoded.id;
        req.userEmail = decoded.email;

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expired',
            });
            return;
        }

        res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export const verifyAuthOptional = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        if (!config.jwtSecret) {
            next();
            return;
        }

        const token =
            req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(
                token,
                config.jwtSecret
            ) as { id: string; email: string };

            req.userId = decoded.id;
            req.userEmail = decoded.email;
        }
    } catch {
        // Silently fail - token is optional
    }

    next();
};
