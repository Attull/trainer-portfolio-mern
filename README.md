# Trainer Portfolio MERN Website

This is a complete personal portfolio website for a trainer profile. It includes a public trainer profile, training photo gallery, learning blog, likes, comments, and an admin panel for managing content.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Lucide icons
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT admin login
- Uploads: Multer image upload storage
- Database: MongoDB

## Main Features

- Public trainer profile homepage
- Training photo gallery with title, description, date, location, audience, and tags
- Blog list and blog detail pages
- Blog likes
- Blog comments from visitors
- Admin login
- Admin blog creation and deletion
- Admin training photo upload and deletion
- Sample seed data for first-time testing

Detailed functionality documentation is available here:

[docs/FUNCTIONALITY.md](docs/FUNCTIONALITY.md)

## Folder Structure

```text
portfolio/
  client/                 React frontend
    src/
      pages/              Home, gallery, blog, admin pages
      App.jsx             Routes and layout
      api.js              API helper
      styles.css          Main styling
  server/                 Express backend
    src/
      routes/             API route files
      models/             MongoDB models
      middleware/         JWT auth middleware
      lib/                Database and upload helpers
      seed.js             Sample data script
  docs/
    FUNCTIONALITY.md      Feature-by-feature documentation
```

## Required Setup

Install these before starting:

1. Node.js 20 or newer
2. npm
3. MongoDB Community Server, or a MongoDB Atlas connection string

MongoDB is required because blogs, comments, likes, and gallery data are stored in the database.

## Environment Setup

Create this file if it does not exist:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trainer_portfolio
JWT_SECRET=replace-this-with-a-long-secret
ADMIN_EMAIL=trainer@example.com
ADMIN_PASSWORD=ChangeMe123!
CLIENT_URL=http://localhost:5173
```

Optional frontend env file:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

If `client/.env` is missing, the frontend already defaults to `http://localhost:5000/api`.

## Install Dependencies

From the project root:

```bash
npm run install:all
```

This installs dependencies for:

- root project
- `server`
- `client`

## Add Sample Data

Make sure MongoDB is running, then run:

```bash
npm run seed --prefix server
```

This adds sample blogs and sample gallery records.

## Commands To Start Application

Start frontend and backend together:

```bash
npm run dev
```

Start backend only:

```bash
npm run dev --prefix server
```

Start frontend only:

```bash
npm run dev --prefix client
```

Build frontend for production:

```bash
npm run build
```

Start backend in production mode:

```bash
npm start
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health check: `http://localhost:5000/api/health`
- Admin panel: `http://localhost:5173/admin`

## Admin Login

The admin credentials come from `server/.env`:

```env
ADMIN_EMAIL=trainer@example.com
ADMIN_PASSWORD=ChangeMe123!
```

Change these before deployment.

## What You Need To Customize

Update your personal trainer details in:

```text
server/src/routes/profileRoutes.js
```

Change:

- name
- role
- summary
- location
- email
- phone
- skills
- stats

Replace the homepage trainer image in:

```text
client/src/pages/Home.jsx
```

Update colors and layout in:

```text
client/src/styles.css
```

## Image Upload Notes

Uploaded images are stored locally in:

```text
server/uploads/
```

For deployment, local upload storage is simple but not ideal. For production, consider using:

- Cloudinary
- AWS S3
- Firebase Storage

## Deployment Notes

For deployment, update these values:

- `MONGO_URI`: use MongoDB Atlas or production MongoDB
- `JWT_SECRET`: use a long secure random string
- `ADMIN_PASSWORD`: use a strong password
- `CLIENT_URL`: use your deployed frontend URL
- `VITE_API_URL`: use your deployed backend API URL

Common deployment options:

- Frontend: Vercel, Netlify
- Backend: Render, Railway, Fly.io
- Database: MongoDB Atlas

## Current Status

The app has been generated with working code, dependencies, seed data support, and documentation. Run MongoDB, install dependencies, configure `.env`, and start with `npm run dev`.
