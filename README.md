# Invoicify – Modern invoicing for freelancers and small businesses

![Backend CI](https://github.com/ferdiag/invoicify/actions/workflows/backend-ci.yml/badge.svg?branch=main)
![Frontend CI](https://github.com/ferdiag/invoicify/actions/workflows/frontend-ci.yml/badge.svg?branch=main)
![Coverage](https://img.shields.io/badge/coverage-29%25-red)
![License](https://img.shields.io/github/license/ferdiag/invoicify)

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

## 📸 Screenshots

_(to be added later)_

```markdown
![Dashboard](docs/screenshots/dashboard.png)
![Invoice Creation](docs/screenshots/invoice.png)

🚀 Quickstart

Clone and run with PostgreSQL via Docker Compose:

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

| Method | Route          | Description                | Auth |
| ------ | -------------- | -------------------------- | ---- |
| POST   | /register      | Create new user            | –    |
| POST   | /login         | Issue JWT                  | –    |
| GET    | /customers     | List all customers         | ✓    |
| POST   | /customers     | Create new customer        | ✓    |
| PATCH  | /customers/:id | Update customer            | ✓    |
| DELETE | /customers/:id | Delete customer            | ✓    |
| PATCH  | /users/:id     | Update user/company data   | ✓    |
| GET    | /invoices      | List invoices              | ✓    |
| POST   | /invoices      | Create invoice (net/gross) | ✓    |

_(✓ = requires JWT authentication)_

🛠️ Tech Stack

    Frontend: React, TypeScript, React Router, React Hook Form, Tailwind, i18next, React-Toastify

    Backend: Fastify, TypeScript, Drizzle ORM, PostgreSQL, JWT, bcrypt

    Dev Tools: Vite, Docker Compose, Node.js ≥ 18

📂 Project Structure

invoicify/
├── client/ # React frontend
├── server/ # Fastify backend
└── shared/ # Shared types & utilities

⚡ Development Notes

    .env.example files included for client and server

    Seed script creates a demo user and sample customer/invoice

    CI is configured for manual runs via GitHub Actions (workflow_dispatch)

    npm run test:ci generates a coverage report under /coverage (also uploaded as CI artifact + Codecov)

    ## 🧪 Testing

- [x] Setup CI pipelines (frontend & backend)
- [x] Unit tests for core components
- [ ] Add backend route tests
- [ ] Increase frontend coverage to 80%+
      🤝 Contributing

Issues and pull requests are welcome!
Please open an issue for bugs or feature requests.
📜 License

This project is licensed under the MIT License – see LICENSE for details.

---
```
