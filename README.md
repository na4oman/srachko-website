# Srachko Service — Full Stack Web Application

A modern, full-stack service request management platform for **Srachko Service** — an authorized repair center for home appliances and electronics in Bulgaria. Customers can submit service requests online, track their status, and the admin team can manage all requests through a dedicated dashboard.

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool & dev server |
| React Router v6 | 6.28 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui | — | UI component library |
| Framer Motion | 12 | Animations |
| React Hook Form | 7.7 | Form management |
| Zod | 3.24 | Schema validation |
| Zustand | 5.0 | State management |
| Axios | 1.13 | HTTP client |
| Clerk | 5.6 | Authentication |
| Lucide React | — | Icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | 5.2 | Web framework |
| TypeScript | 5.9 | Type safety |
| Drizzle ORM | 0.45 | Database ORM |
| PostgreSQL (Neon) | — | Database |
| Clerk SDK | 4.13 | Auth verification |
| Cloudinary | 2.9 | Image uploads |
| SendGrid | 8.1 | Email notifications |
| Zod | 4.3 | Request validation |
| Vitest | 4.0 | Testing |

---

## 📁 Project Structure

```
srachko-website/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   └── request-form/  # Service request form
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Route pages
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── Home.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── SignIn.tsx
│   │   │   └── SignUp.tsx
│   │   ├── lib/               # Utilities & helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/                   # Express + Node.js API
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── db/                # Drizzle schema & migrations
│   │   ├── lib/               # Shared utilities
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   └── index.ts           # App entry point
│   ├── drizzle/               # Migration files
│   ├── .env.example
│   └── package.json
│
├── package.json               # Root workspace config
└── README.md
```

---

## ✨ Features

### Customer-Facing
- **Service Request Forms** — Submit requests for repair, installation, maintenance, parts inquiry, and more
- **Photo Upload** — Attach images of the device via Cloudinary
- **Request Tracking** — Track the status of submitted requests
- **Bilingual Support** — Bulgarian and English language toggle
- **Authorized Brands** — Apple, Samsung, LG, AEG, Electrolux, Hisense, TCL, Beko, Honor, Nokia, ZTE, Gorenje, and more
- **Confirmation Email** — Automatic email confirmation via SendGrid after submission

### Admin Dashboard
- **Request Management** — View, filter, and update all service requests
- **Status Updates** — New, Confirmed, In Progress, Awaiting Parts, Completed, Cancelled
- **Search & Filter** — Filter by brand, date, status, request type
- **Statistics** — Dashboard with charts: requests by status, type, brand, and date
- **Secure Access** — Protected by Clerk authentication

### Request Types
- Заявка за ремонт (Repair Request)
- Заявка за монтаж (Installation Request)
- Заявка за профилактика (Maintenance/Cleaning)
- Запитване за части (Parts Inquiry)
- Регистрация на уреди (Device Registration)
- Заявки за контакт (Contact Request)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) account
- A [Cloudinary](https://cloudinary.com) account
- A [SendGrid](https://sendgrid.com) account

### 1. Clone the repository

```bash
git clone https://github.com/na4oman/srachko-website.git
cd srachko-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

**Backend** — copy and fill in `.env`:
```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=your_neon_postgres_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**Frontend** — copy and fill in `.env.local`:
```bash
cp frontend/.env.example frontend/.env.local
```

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

### 4. Set up the database

```bash
npm run db:push --workspace=backend
```

Optionally seed with initial data:
```bash
npm run db:seed --workspace=backend
```

### 5. Run the development servers

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:5000
```

---

## 🗄️ Database

The project uses **Drizzle ORM** with **Neon (PostgreSQL)**.

```bash
# Generate migrations
npm run db:generate --workspace=backend

# Push schema to database
npm run db:push --workspace=backend

# Open Drizzle Studio (visual DB browser)
npm run db:studio --workspace=backend
```

---

## 🧪 Testing

```bash
# Run backend tests
npm run test --workspace=backend
```

---

## 🏗️ Build for Production

```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

---

## 🚢 Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) |

### Frontend (Vercel)
Set the root directory to `frontend` and add the environment variables from `frontend/.env.example`.

### Backend (Render)
Set the root directory to `backend`, build command `npm run build`, start command `npm start`, and add the environment variables from `backend/.env.example`.

---

## 📄 License

This project is proprietary software. All rights reserved © Srachko Service.
