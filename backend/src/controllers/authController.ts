import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import config from '../config';

const getJwtSecret = (): string => {
    if (!config.jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return config.jwtSecret;
};

const getJwtExpiry = (): jwt.SignOptions['expiresIn'] =>
    config.jwtExpiry as jwt.SignOptions['expiresIn'];

const getCookieOptions = () => ({
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
});

/**
 * POST /api/auth/signup
 * Registers a new teacher account
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, school, subject } = req.body;

        // Validation
        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                message: 'Email, password, and name are required',
            });
            return;
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
            return;
        }

        // Create new user
        const newUser = await UserModel.create({
            email: email.toLowerCase(),
            password,
            name,
            school,
            subject,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            getJwtSecret(),
            { expiresIn: getJwtExpiry() }
        );

        // Set cookie
        res.cookie('token', token, getCookieOptions());

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (err) {
        console.error('[authController] signup error:', (err as Error).message);
        res.status(500).json({
            success: false,
            message: 'Failed to create account',
        });
    }
};

/**
 * POST /api/auth/login
 * Authenticates a teacher and returns JWT token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
            return;
        }

        // Find user and select password field
        const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
            '+password'
        );

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        // Compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            getJwtSecret(),
            { expiresIn: getJwtExpiry() }
        );

        // Set cookie
        res.cookie('token', token, getCookieOptions());

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.error('[authController] login error:', (err as Error).message);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
        });
    }
};

/**
 * POST /api/auth/logout
 * Logs out the user by clearing the token cookie
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('token', {
            ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
            path: '/',
        });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (err) {
        console.error('[authController] logout error:', (err as Error).message);
        res.status(500).json({
            success: false,
            message: 'Failed to logout',
        });
    }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId; // Set by auth middleware

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                school: user.school,
                subject: user.subject,
            },
        });
    } catch (err) {
        console.error('[authController] getCurrentUser error:', (err as Error).message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
        });
    }
};
