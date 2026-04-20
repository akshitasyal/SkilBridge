<div align="center">

# 🌉 SkillBridge

### A full-stack freelancing marketplace — inspired by Fiverr

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SkillBridge connects freelancers with clients in a seamless, Fiverr-like experience.  
Sellers list services ("gigs"), buyers discover and purchase them — all powered by a real-time backend.

[Live Demo](#) · [Report Bug](https://github.com/akshitasyal/SkilBridge/issues) · [Request Feature](https://github.com/akshitasyal/SkilBridge/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based login & registration with role-based access (buyer / seller / admin) |
| 🛍️ **Gig Marketplace** | Browse, search, and filter freelance services by category |
| ➕ **Gig Management** | Sellers can create, edit, and manage their service listings |
| 🛒 **Order System** | Full order lifecycle — checkout, payment, tracking, and sales dashboard |
| 💳 **Payments** | Razorpay integration for secure online payments |
| 💬 **Real-time Chat** | Socket.io powered messaging between buyers and sellers |
| 🧑‍💼 **Seller Dashboard** | Revenue tracking, active orders, and gig analytics |
| 👑 **Admin Panel** | User management, platform oversight, and content moderation |
| 📱 **Responsive UI** | Mobile-first design built with TailwindCSS |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│               React 19 + Vite + TailwindCSS                 │
│   Pages: Home, Gigs, GigDetail, Checkout, Chat, Dashboard   │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP (REST) + WebSocket (Socket.io)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                          │
│               Node.js + Express.js (ESM)                    │
│                                                             │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐    │
│  │  Routes  │→ │Controllers │→ │   Prisma ORM Client  │    │
│  └──────────┘  └────────────┘  └──────────┬───────────┘    │
│                                            │                │
│  ┌─────────────────────────────────────┐   │                │
│  │  Middleware: Auth, Admin, Seller    │   │                │
│  └─────────────────────────────────────┘   │                │
│                                            ▼                │
│                                 ┌──────────────────┐        │
│                                 │   PostgreSQL DB   │        │
│                                 │  (Render managed) │        │
│                                 └──────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [TailwindCSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Axios](https://axios-http.com/) | HTTP client |
| [Socket.io Client](https://socket.io/) | Real-time communication |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js 20+](https://nodejs.org/) | JavaScript runtime |
| [Express.js](https://expressjs.com/) | HTTP server & routing |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database access |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Socket.io](https://socket.io/) | Real-time WebSocket server |
| [JWT](https://jwt.io/) | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Razorpay](https://razorpay.com/) | Payment gateway |

### Infrastructure
| Technology | Purpose |
|---|---|
| [Render](https://render.com/) | Cloud hosting (web service + PostgreSQL) |

---

## 📁 Project Structure

```
SkilBridge/
├── backend/                  # Express API server
│   ├── config/               # Database connection setup
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Auth, role guards, validation
│   ├── prisma/               # Schema & migrations
│   ├── routes/               # API route definitions
│   ├── server.js             # App entry point
│   └── README.md             # Backend documentation
│
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── api/              # Axios API call helpers
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Route-level page components
│   │   ├── utils/            # Helper utilities
│   │   └── App.jsx           # Root component & routes
│   └── README.md             # Frontend documentation
│
├── render.yaml               # Render deployment config
├── package.json              # Root scripts (install, build, start)
├── CONTRIBUTING.md           # Contribution guidelines
└── README.md                 # ← You are here
```

> See [`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md) for detailed documentation of each workspace.

---

## ⚡ Quick Start

### Prerequisites
- Node.js **v20+**
- A PostgreSQL database (local or [Render free tier](https://render.com/))
- A [Razorpay](https://razorpay.com/) account (test keys work fine)

### 1. Clone the repository

```bash
git clone https://github.com/akshitasyal/SkilBridge.git
cd SkilBridge
```

### 2. Install all dependencies

```bash
npm install   # installs both frontend and backend dependencies
```

### 3. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# → Fill in your DATABASE_URL, JWT_SECRET, and Razorpay keys

# Frontend (optional — Vite proxy handles /api in dev)
cp frontend/.env.example frontend/.env
```

### 4. Set up the database

```bash
cd backend
npx prisma db push          # sync schema to your DB
npx prisma generate         # generate the Prisma client
```

### 5. Start development servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend → [http://localhost:5173](http://localhost:5173)  
Backend → [http://localhost:5000](http://localhost:5000)

---

## 🔧 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `JWT_SECRET` | `backend/.env` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | `backend/.env` | Token expiry (e.g. `7d`) |
| `RAZORPAY_KEY_ID` | `backend/.env` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | `backend/.env` | Razorpay private key |
| `PORT` | `backend/.env` | Server port (default: `5000`) |
| `NODE_ENV` | `backend/.env` | `development` or `production` |

See [`backend/.env.example`](./backend/.env.example) for a full template.

---

## 🚀 Deployment (Render)

The project deploys as a **single unified service** on Render — the Express server builds the React frontend and serves it statically in production.

```bash
# Build command (Render runs this)
npm install && npm run build

# Start command (Render runs this)
npm start
```

Environment variables are declared in [`render.yaml`](./render.yaml) and linked to a managed PostgreSQL database instance.

> For detailed deployment steps, see [Render's Node.js guide](https://render.com/docs/deploy-node-express-app).

---

## 🤝 Contributing

We welcome contributions! Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a pull request.

### Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/akshitasyal">
        <b>Akshita Syal</b><br/>
        <sub>Full-Stack Development</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Chetan6969">
        <b>Chetan Chauhan</b><br/>
        <sub>Backend & DevOps</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Nishant2817">
        <b>Nishant Pandey</b><br/>
        <sub>Full-Stack Development</sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by [Akshita Syal](https://github.com/akshitasyal) & [Chetan Chauhan](https://github.com/Chetan6969)

</div>
