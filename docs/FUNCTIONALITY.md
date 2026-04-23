# Functionality Documentation

This document explains each major feature in the Trainer Portfolio MERN Website and where the related code lives.

## 1. Trainer Profile Homepage

Purpose:

- Shows your trainer identity and professional positioning.
- Displays your summary, training stats, skills, contact information, and call-to-action buttons.

Frontend files:

```text
client/src/pages/Home.jsx
client/src/styles.css
```

Backend file:

```text
server/src/routes/profileRoutes.js
```

API:

```http
GET /api/profile
```

To customize:

- Edit `server/src/routes/profileRoutes.js`
- Replace name, role, summary, location, email, phone, skills, and stats.
- Replace the homepage image URL in `client/src/pages/Home.jsx`.

## 2. Training Photo Gallery

Purpose:

- Shows photos from training sessions, workshops, bootcamps, seminars, or mentoring events.
- Each gallery item can include title, description, training date, location, audience, and tags.

Frontend files:

```text
client/src/pages/Gallery.jsx
client/src/pages/Admin.jsx
```

Backend files:

```text
server/src/routes/galleryRoutes.js
server/src/models/GalleryItem.js
server/src/lib/upload.js
```

APIs:

```http
GET    /api/gallery
POST   /api/gallery
PUT    /api/gallery/:id
DELETE /api/gallery/:id
```

Admin required:

- `POST /api/gallery`
- `PUT /api/gallery/:id`
- `DELETE /api/gallery/:id`

Upload field name:

```text
image
```

Image storage:

```text
server/uploads/
```

## 3. Blog List

Purpose:

- Lists all published blogs.
- Visitors can open a blog to read the full content.
- Blog cards show category, title, excerpt, likes, and comment count.

Frontend file:

```text
client/src/pages/Blogs.jsx
```

Backend files:

```text
server/src/routes/blogRoutes.js
server/src/models/Blog.js
```

API:

```http
GET /api/blogs
```

Admin list API:

```http
GET /api/blogs?admin=true
```

## 4. Blog Detail

Purpose:

- Shows one complete blog article.
- Displays cover image, category, title, excerpt, content, likes, and comments.

Frontend file:

```text
client/src/pages/BlogDetail.jsx
```

Backend files:

```text
server/src/routes/blogRoutes.js
server/src/models/Blog.js
```

API:

```http
GET /api/blogs/:slug
```

Slug behavior:

- Blog slugs are generated automatically from the title.
- If the same title exists, the backend creates a unique slug by adding a number.

## 5. Blog Likes

Purpose:

- Allows visitors to like blog posts.
- Like count is stored in MongoDB.

Frontend file:

```text
client/src/pages/BlogDetail.jsx
```

Backend file:

```text
server/src/routes/blogRoutes.js
```

API:

```http
POST /api/blogs/:slug/like
```

Current behavior:

- Each click increases the like count.
- There is no per-user like restriction yet.

Possible future improvement:

- Store liked blog IDs in browser localStorage.
- Add user accounts.
- Track likes by IP or authenticated user.

## 6. Blog Comments

Purpose:

- Allows visitors to comment on a blog.
- Comments include visitor name and message.

Frontend file:

```text
client/src/pages/BlogDetail.jsx
```

Backend/model files:

```text
server/src/routes/blogRoutes.js
server/src/models/Blog.js
```

API:

```http
POST /api/blogs/:slug/comments
```

Request body:

```json
{
  "name": "Visitor Name",
  "message": "Comment text"
}
```

Current behavior:

- Comments are public immediately.
- Comments are stored inside the blog document.

Possible future improvement:

- Add comment moderation.
- Add spam protection or CAPTCHA.
- Add admin comment deletion.

## 7. Admin Login

Purpose:

- Protects content management features.
- Admin can create and delete blogs and gallery photos.

Frontend file:

```text
client/src/pages/Admin.jsx
```

Backend files:

```text
server/src/routes/authRoutes.js
server/src/middleware/auth.js
```

API:

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "trainer@example.com",
  "password": "ChangeMe123!"
}
```

Response:

```json
{
  "token": "jwt-token",
  "admin": {
    "email": "trainer@example.com"
  }
}
```

Token storage:

```text
localStorage key: trainer_admin_token
```

Admin credentials:

```text
server/.env
```

## 8. Blog Management

Purpose:

- Admin can create and delete blogs from the admin panel.

Frontend file:

```text
client/src/pages/Admin.jsx
```

Backend file:

```text
server/src/routes/blogRoutes.js
```

APIs:

```http
POST   /api/blogs
PUT    /api/blogs/:id
DELETE /api/blogs/:id
```

Admin required:

- Yes

Blog fields:

```text
title
category
excerpt
content
tags
isPublished
coverImage
```

Cover image upload field name:

```text
coverImage
```

Current admin UI:

- Create blog
- Delete blog

Backend also supports:

- Update blog

Possible future improvement:

- Add edit form in admin UI.
- Add draft/publish toggle in admin UI.

## 9. Gallery Management

Purpose:

- Admin can upload and delete training photos.

Frontend file:

```text
client/src/pages/Admin.jsx
```

Backend file:

```text
server/src/routes/galleryRoutes.js
```

APIs:

```http
POST   /api/gallery
PUT    /api/gallery/:id
DELETE /api/gallery/:id
```

Admin required:

- Yes

Gallery fields:

```text
title
description
image
trainingDate
location
audience
tags
```

Current admin UI:

- Add gallery item
- Delete gallery item

Backend also supports:

- Update gallery item

Possible future improvement:

- Add edit form in admin UI.
- Add image replacement controls.

## 10. Image Uploads

Purpose:

- Allows admin to upload cover images and training photos.

Backend file:

```text
server/src/lib/upload.js
```

Accepted files:

- Images only

File size limit:

```text
5 MB
```

Upload folder:

```text
server/uploads/
```

Public image URL format:

```text
/uploads/file-name.jpg
```

Static serving:

```http
GET /uploads/:filename
```

Production recommendation:

- Replace local storage with Cloudinary, S3, or another file storage service.

## 11. Database Models

Blog model:

```text
server/src/models/Blog.js
```

Fields:

- title
- slug
- category
- excerpt
- content
- coverImage
- tags
- likes
- comments
- isPublished
- createdAt
- updatedAt

Gallery model:

```text
server/src/models/GalleryItem.js
```

Fields:

- title
- description
- imageUrl
- trainingDate
- location
- audience
- tags
- createdAt
- updatedAt

## 12. Seed Data

Purpose:

- Inserts sample blogs and sample gallery records.
- Useful for checking the app after installation.

File:

```text
server/src/seed.js
```

Command:

```bash
npm run seed --prefix server
```

Warning:

- The seed script clears existing blogs and gallery items before inserting sample data.

## 13. API Health Check

Purpose:

- Confirms backend server is running.

API:

```http
GET /api/health
```

Expected response:

```json
{
  "ok": true,
  "message": "Trainer portfolio API is running"
}
```

## 14. Start Commands

Install all dependencies:

```bash
npm run install:all
```

Start both frontend and backend:

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

Seed database:

```bash
npm run seed --prefix server
```

Build frontend:

```bash
npm run build
```

Start backend production server:

```bash
npm start
```

## 15. Missing Or Optional Setup

Required:

- Install Node.js and npm.
- Install and run MongoDB, or use MongoDB Atlas.
- Configure `server/.env`.
- Install dependencies.

Recommended before deployment:

- Use a strong `JWT_SECRET`.
- Change admin email and password.
- Use MongoDB Atlas instead of local MongoDB.
- Use cloud image storage instead of local `uploads`.
- Add comment moderation if the site is public.
- Add rate limiting or CAPTCHA for public comments if spam becomes a concern.
- Add HTTPS through your hosting provider.
