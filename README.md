# Flowboard - Mini Task Tracker [github]([text](https://github.com/Dip-Bala/Task-Tracker-WLDD))

A full-stack Task Tracker app built with Next.js + Node.js + MongoDB + Redis.

## Overview

Flowboard lets users:
- Sign up and log in
- Create, list, update, and delete personal tasks
- Stay authenticated via HTTP-only JWT cookie
- Benefit from Redis-cached task list responses

This project follows the assignment requirements for REST API design, Mongoose schema modeling, Redis caching, Next.js rendering, and backend testing.

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- Redis
- JWT + bcrypt
- Jest + Supertest + mongodb-memory-server + redis-mock

### Frontend
- Next.js (App Router)
- React
- TypeScript
- React Query
- Axios
- Tailwind CSS

## Key Design Decisions

### Authentication
- JWT is issued on login and stored in `access_token` HTTP-only cookie.
- Protected backend routes use auth middleware (`verifyToken`).

### Task ownership
- Each task stores `owner` as `ObjectId` reference to `user`.
- All task CRUD routes are scoped to the logged-in user.

### Caching strategy
- `GET /api/tasks` response is cached per user using key pattern: `tasks:<userId>`.
- Cache is invalidated on create/update/delete.

### Rendering strategy
- `frontend/app/dashboard/page.tsx` uses server-side fetching for initial dashboard task summary.
- `frontend/app/dashboard/tasks/page.tsx` is client-rendered for interactive CRUD and dynamic updates through React Query invalidation.

## Project Structure

```text
flow_board/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   │   ├── integration/
│   │   ├── mocks/
│   │   ├── unit/
│   │   └── setup.ts
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── dashboard/
│   │   └── lib/
│   ├── components/
│   └── .env.example
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - register new user
- `POST /api/auth/login` - authenticate and set cookie
- `GET /api/auth/me` - get current authenticated user
- `POST /api/auth/logout` - clear auth cookie

### Tasks
- `GET /api/tasks` - list current user's tasks (cached)
- `POST /api/tasks` - create task
- `PUT /api/tasks/:id` - update task
- `DELETE /api/tasks/:id` - delete task

## Database Models

### User
- `name`
- `email` (unique)
- `password` (hashed)
- `createdAt` (via timestamps)

### Task
- `title`
- `description`
- `status` (`pending | completed`)
- `dueDate`
- `owner` (User ref)
- `createdAt` (via timestamps)

Indexes:
- `owner`
- compound index on `{ owner: 1, status: 1 }`

## Testing

Backend tests use:
- Jest
- Supertest
- mongodb-memory-server
- redis-mock

Run from `backend/`:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

Coverage output is generated in `backend/coverage/`.

## Local Setup

### Prerequisites
- Node.js 20+ recommended
- MongoDB instance
- Redis instance

### 1. Clone

```bash
git clone https://github.com/Dip-Bala/flow_board.git
cd flow_board
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment files

Copy examples and fill values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 4. Run app

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

## Environment Variables

### `backend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | Backend port |
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `FRONTEND_URL` | Yes | Frontend origin for CORS |
| `REDIS_USERNAME` | Yes | Redis username |
| `REDIS_PASSWORD` | Yes | Redis password |
| `REDIS_HOST` | Yes | Redis host |
| `REDIS_PORT` | Yes | Redis port |

### `frontend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Backend base URL used by Next rewrite and SSR fetch |


