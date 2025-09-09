# Invoicify – Modern invoicing for freelancers and small businesses

[![Tests (server)](https://github.com/ferdiag/invoicify/actions/workflows/ci.yml/badge.svg)](https://github.com/ferdiag/invoicify/actions/workflows/ci.yml)

Fast and simple invoicing with customer management, VAT calculation (net/gross), and bilingual UI (DE/EN).  
Built with **React, TypeScript, Fastify, PostgreSQL, Drizzle ORM**.

---

## ✨ Features

- 🔐 **Authentication** – Registration & Login with bcrypt password hashing and JWT tokens
- 🌍 **Multilingual UI** – German / English via i18next
- 👥 **Customer & Company Management**
- 📑 **Invoice Creation** – Dynamic item list, VAT auto-calculation, net/gross amounts
- 📱 **Responsive UI** – Tailwind CSS with toast notifications
- 🗄️ **Persistent Storage** – PostgreSQL + Drizzle ORM

---

## 🚀 Quickstart

Clone and run with PostgreSQL via Docker Compose:

```bash
git clone https://github.com/ferdiag/invoicify.git
cd invoicify

# Start Postgres (port 5433)
docker compose up -d db

# Backend
cd server
cp .env.example .env
npm install
npm run dev &

# Frontend
cd ../client
cp .env.example .env
npm install
npm run dev

Frontend → http://localhost:5173

API → http://localhost:3000
📸 Screenshots

...
📖 API Overview
Method	Route	Description	Auth
POST	/register	Create user	–
POST	/login	Issue JWT	–
GET	/customers	List customers	✓
POST	/invoices	Create invoice (net/gross)	✓

.
🛠️ Tech Stack

    Frontend: React, TypeScript, React Router, React Hook Form, Tailwind, i18next, React-Toastify

    Backend: Fastify, TypeScript, Drizzle ORM, PostgreSQL, JWT, bcrypt

    Dev Tools: Vite, Docker Compose, Node.js ≥ 18

📂 Project Structure

invoicify/
├── client/     # React frontend
├── server/     # Fastify backend
└── shared/     # Shared types & utilities

⚡ Development Notes

    .env.example files included for client and server

    Seed script creates a demo user and sample customer/invoice

    Lint, typecheck, and minimal tests included (GitHub Actions CI)

    npm run test:ci generates a coverage report under /coverage (also in CI artifacts)

🤝 Contributing

Issues and pull requests are welcome!
Please open an issue for bugs or feature requests.
📜 License

This project is licensed under the MIT License – see LICENSE for details.
```
