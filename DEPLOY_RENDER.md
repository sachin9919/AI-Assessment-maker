# Render Deployment Guide

This project is deployed as two Render web services:

- `vedaai-backend` (Express API + worker in same process)
- `vedaai-frontend` (Next.js app)

`render.yaml` is included for Blueprint setup.

## 1) Create Backend Service

Use `backend` directory with:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Health check: `/api/health`

Set backend environment variables:

- `PORT` (Render injects this automatically)
- `NODE_ENV=production`
- `FRONTEND_URL=https://<your-frontend-domain>`
- `COOKIE_DOMAIN=` (leave empty unless using custom domain cookie sharing)
- `MONGO_URI=...`
- `UPSTASH_REDIS_URL=...`
- `GEMINI_API_KEY=...`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `JWT_SECRET=...`
- `JWT_EXPIRY=7d`

## 2) Create Frontend Service

Use `frontend` directory with:

- Build command: `npm install && npm run build`
- Start command: `npm run start`

Set frontend environment variables:

- `NEXT_PUBLIC_API_URL=https://<your-backend-domain>`
- `NEXT_PUBLIC_BACKEND_URL=https://<your-backend-domain>`
- `BACKEND_URL=https://<your-backend-domain>`

## 3) Verify After Deploy

1. Open frontend URL
2. Sign up a new user
3. Create assignment
4. Watch generation progress
5. Open result and test regenerate + PDF

## Important Note

Socket.IO in production must use the same backend domain set in frontend env vars.
