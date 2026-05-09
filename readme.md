# 🔗 URL Shortener

A URL shortening service built with Node.js, Express, and PostgreSQL. Users can register, log in, and shorten long URLs into compact, shareable links.

---

## 🚀 Features

- User registration and login with JWT authentication
- Shorten any long URL into a unique short code
- Custom short codes (or auto-generated via nanoid)
- Redirect short URLs to original destinations
- Protected routes — only logged-in users can shorten URLs
- Input validation using Zod
- PostgreSQL database with Drizzle ORM

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | JWT (JSON Web Tokens) |
| Validation | Zod |
| Password Hashing | bcrypt |
| ID Generation | nanoid |
| Dev Environment | Docker + docker-compose |

---

##  Project Structure

```
URL-SHORTNER/
├── db/
├── middlewares/
│   └── auth.middleware.js       # JWT auth middleware
├── models/
│   ├── index.js
│   └── user.model.js            # Users + URLs table schemas
├── routes/
│   ├── users.routes.js          # Register / Login
│   └── url.routes.js            # Shorten URL / Redirect
├── services/
│   ├── user.service.js          # User DB operations
│   └── url.service.js           # URL DB operations
├── src/
│   └── index.js                 # DB connection (Drizzle)
├── utils/
│   ├── token.js                 # JWT create & verify
│   └── hash.js                  # bcrypt helpers
├── validation/
│   ├── request.validation.js    # Zod schemas
│   └── token.validation.js
├── .env
├── docker-compose.yml
├── drizzle.config.js
└── index.js                     # Express app entry point
```

---

##  Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/your-username/url-shortner.git
cd url-shortner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=8000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://postgres:secret@localhost:5432/urlshortner
```

### 4. Start the database

```bash
docker-compose up -d
```

### 5. Run database migrations

```bash
npx drizzle-kit push
```

### 6. Start the server

```bash
npm start
```

Server runs at `http://localhost:8000` (you can change the port in the `.env` file).

---

##  API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/register` | Register a new user | No |
| POST | `/user/login` | Login and get JWT token | No |

### URLs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/urls/shorten` | Shorten a URL | Yes |
| GET | `/:shortCode` | Redirect to original URL | No |

---

##  Request & Response Examples

### Register
```http
POST /user/register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```
Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Shorten URL
```http
POST /api/urls/shorten
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "url": "https://www.google.com",
  "code": "mygoogle"    // optional custom short code
}
```
Response:
```json
{
  "id": "uuid-here",
  "shortCode": "mygoogle",
  "url": "https://www.google.com"
}
```

### Redirect
```http
GET /mygoogle
→ 302 Redirect to https://www.google.com
```

---

##  How Authentication Works

1. User logs in → server returns a JWT token
2. Token is sent in the `Authorization` header as `Bearer <token>`
3. `authMiddleware` runs on every request and decodes the token onto `req.user`
4. `ensureAuthentication` middleware blocks requests without a valid token

---

##  Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto-generated |
| firstname | varchar(55) | Not null |
| lastname | varchar(55) | |
| email | text | Not null |
| password | text | Hashed with bcrypt |
| salt | text | bcrypt salt |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

### urls
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto-generated |
| target_url | text | Original long URL |
| short_code | text | Unique short code |
| user_id | uuid | Foreign key → users.id |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |


