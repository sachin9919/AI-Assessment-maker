import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  cookieDomain: process.env.COOKIE_DOMAIN || '',
};

export default config;
