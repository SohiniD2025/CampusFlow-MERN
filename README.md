# CampusFlow — MERN End-Term Project

A student task and assignment manager built with MongoDB, Express, React, and Node.js.

## Important MERN topics demonstrated
- React components, props, `useState`, `useEffect`, Context API, React Router
- Axios API calls, loading/error/empty states, search and status filters
- REST API design and CRUD operations
- Express middleware, routes, controllers, validation, centralized error handling
- MongoDB + Mongoose schemas, references, queries, timestamps
- Password hashing with bcrypt
- JWT authentication stored in an HttpOnly cookie
- Protected frontend routes and protected backend endpoints
- CORS with credentials, environment variables, reusable Axios instance

## Requirements
- Node.js 20+
- MongoDB Atlas URI or a local MongoDB instance

## 1. Configure backend
Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env` and set your MongoDB URI and a long random JWT secret.

```env
PORT=8080
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/...
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Expected: `Server running on port 8080` and a successful database connection message.

## 2. Configure frontend
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Demo flow
1. Register an account.
2. Log in.
3. Add tasks with a title, subject, due date, priority, and description.
4. Search tasks, filter by status, mark tasks complete, edit, and delete.
5. Refresh the page: the session is checked using the HttpOnly cookie.

## API routes
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Sign in | No |
| GET | `/api/auth/me` | Current user | Yes |
| POST | `/api/auth/logout` | Clear session cookie | No |
| GET | `/api/tasks` | List current user's tasks | Yes |
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/:id` | Read one task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

## Viva explanation: request flow
React page → Axios (`withCredentials`) → Express route → auth middleware (where required) → controller → Mongoose model → MongoDB → JSON response → React state update.

## Notes
- Do not commit `.env` to GitHub.
- For deployment, set the same environment variables in your hosting provider. Cookie settings may need `secure: true` and `sameSite: "none"` when frontend and backend are on different HTTPS domains.
- This is an educational starter project. Before production use, add rate limiting, email verification, password reset, stronger deployment-specific cookie configuration, and tests.
