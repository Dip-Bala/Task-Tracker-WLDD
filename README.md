# Flowboard – Task Management Application

Flowboard is a full-stack task management application built as part of a frontend internship assignment.
The goal of this project was to demonstrate clean UI design, proper frontend–backend integration, secure authentication, and scalable project structure.

Rather than focusing on feature quantity, the emphasis was on **code quality, maintainability, and real-world practices**.

---

##  Live Demo

**Frontend:**
[https://flow-board-w3kw.vercel.app](https://flow-board-w3kw.vercel.app)

**GitHub Repository:**
[https://github.com/Dip-Bala/flow_board](https://github.com/Dip-Bala/flow_board)

---

##  Project Overview

Flowboard allows users to:

* Register and log in securely
* Access a protected dashboard
* Create, view, update, and delete tasks
* Log out securely
* Maintain session using HTTP-only cookies

The application uses a role-based system (`USER`, `ADMIN`) and enforces access control on both frontend and backend.

---

##  Authentication & Security

* JWT-based authentication
* Tokens stored as **HTTP-only cookies**
* Protected routes using middleware
* Passwords hashed using **bcrypt**
* Backend validation using **Zod**
* Secure CORS configuration

---

##  Tech Stack

### Frontend

* **Next.js (App Router)**
* **React Query** – server state management
* **React Hook Form** + **Zod** – form handling & validation
* **Tailwind CSS** – styling
* **Axios** – API communication

### Backend

* **Node.js**
* **Express**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Cookie-based auth**

---

##  Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   └── settings/
│   ├── lib/
│   │   └── api.ts
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── AddTaskModal.tsx
│   └── ErrorAlert.tsx
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.ts
│
└── README.md
```

---

## Key Features

### Authentication

* Register & Login with validation
* Secure token-based session
* Auto logout on token expiry

### Dashboard

* User overview
* Task summary
* Protected routes

### Tasks

* Create new tasks
* View all tasks
* Update task status
* Delete tasks
* Role-based access handling

### UI/UX

* Responsive layout
* Clean and minimal design
* Error feedback and loading states
* Modal-based interactions

---

## API Overview

### Auth Routes

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| POST   | `/auth/register` | Register user    |
| POST   | `/auth/login`    | Login user       |
| GET    | `/auth/me`       | Get current user |
| POST   | `/auth/logout`   | Logout           |

### Task Routes

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| GET    | `/tasks`     | Get all tasks |
| POST   | `/tasks`     | Create task   |
| PUT    | `/tasks/:id` | Update task   |
| DELETE | `/tasks/:id` | Delete task   |

---

##  Demo Credentials for ADMIN

```
Email: admin@gmail.com 
Password: pass@admin
```

*(You can also register a new account as USER.)*

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Dip-Bala/flow_board
cd flow_board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

#### Backend `.env`

```
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run the project

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

Here’s a **cleanly written additional section** you can paste into your README, placed **after the “Demo Credentials” section**.
It matches the tone and quality of the rest of your document and doesn’t feel AI-generated.

---

##  Creating Your Own Admin Account

By default, a demo admin account is provided.
If you want to create your own **admin user**, you can do so using the built-in seed script.

### Steps to Add Admin Credentials

1. Open the backend `.env` file and add the following:

```
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password
```

2. From the backend directory, run:

```bash
npm run seed
```

This will:

* Create an admin user in the database
* Hash the password securely
* Prevent duplicate admin creation on re-runs

3. You can now log in using the admin credentials you provided.

---

### ℹ️ Notes

* The seed script is idempotent — it won’t create duplicate admins.
* Admins have access to all tasks and additional privileges.
* This setup is useful for local development and testing environments.

---


##  Design & Scalability Notes

* Clean separation between frontend and backend
* Reusable components and hooks
* Easily extendable for:

  * Pagination
  * Search & filtering
  * Admin dashboards
  * Role-based permissions
* Ready for deployment on Vercel + Render/Railway

---

##  Final Notes

This project focuses on:

* Clean architecture
* Real-world authentication flow
* Maintainability over shortcuts
* Production-ready patterns

If given more time, I would add:

* Unit tests
* Better error logging
* Role-based UI permissions
* Analytics & performance monitoring

---

## Contact

**Dipanwita Bala**
📧 [dipanwitabala02@gmail.com](mailto:dipanwitabala02@gmail.com)
🔗 GitHub: [https://github.com/Dip-Bala](https://github.com/Dip-Bala)


