# Mbale Innovators Hub

A web-based repository application designed to serve as a centralized platform to document, showcase, and manage local projects and innovations created by students across participating institutions.

## Features

- **Role-Based User Management:** Secure registration and login for Students, Supervisors, and Administrators.
- **Project Submission Workflow:** Students can submit projects with titles, descriptions, technologies, documents (PDF), and GitHub links.
- **Supervisor Approval System:** Supervisors can review, comment on, approve, or reject project submissions.
- **Interactive Public Gallery:** A publicly viewable gallery of all approved projects, searchable and filterable by category, faculty, and year.
- **Admin Dashboard:** Administrators can manage user roles (student, supervisor, admin) and view key platform analytics, including project counts and charts.
- **Collaboration & Feedback:** Logged-in users can post comments and feedback on project detail pages.

## Tech Stack

**Frontend:**
- React
- Vite (Build Tool)
- Axios (for API requests)
- Chart.js (for analytics)
- React Router (for navigation)

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- Multer (for file uploads)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Backend Setup

1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
4. Run `npm run dev` to start the server.

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add `VITE_REACT_APP_API_URL=http://localhost:5000` (or your backend URL).
4. Run `npm run dev` to start the frontend application.

## API Endpoints

*(See API_Documentation.md for full details)*

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login a user.
- `GET /api/projects` - Get all approved projects (with filters).
- `POST /api/projects` - Submit a new project.
- `GET /api/users` - Get all users (Admin only).
- ...and more.