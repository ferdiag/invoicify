# Invoicify

**Invoicify** is a modern web application for freelancers, self-employed professionals, and small businesses to create, manage, and organize professional invoices with ease.

## Features

- User authentication (register/login)
- Multilingual support (German/English)
- Dashboard with quick actions
- Customer management (add/edit customers)
- Company data management
- Invoice creation with:
  - Dynamic product list
  - VAT configuration
  - Automatic calculation of net/gross amounts
  - Due date management
- Responsive and modern UI (Tailwind CSS)
- Toast notifications for user feedback

## Tech Stack

- **Frontend:** React, TypeScript, React Router, React Hook Form, i18next, Tailwind CSS, React Toastify
- **Backend:** Node.js, Express, Drizzle ORM, PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/invoicify.git
cd invoicify
```

#### 2. Install dependencies

```bash
cd client
npm install
cd ../server
npm install
```

#### 3. Configure environment variables

- Copy `.env.example` to `.env` in both `client` and `server` folders and adjust the settings (e.g. database connection, JWT secret, etc.).

#### 4. Database setup

- Run migrations or set up your database schema as needed (see `server/src/db/schema.ts`).

#### 5. Start the development servers

**Backend:**

```bash
cd server
npm run dev
```

**Frontend:**

```bash
cd client
npm run dev
```

- The frontend will typically run on [http://localhost:5173](http://localhost:5173)
- The backend will typically run on [http://localhost:3000](http://localhost:3000)

## Usage

1. Register a new account or log in.
2. Add your company data and customers.
3. Create invoices by selecting a customer, adding products, setting VAT and due date.
4. Download or send invoices as needed (feature may require extension).

## Folder Structure

```
invoicify/
  client/      # React frontend
    src/
      components/
      pages/
      i18n/
      factories/
      ...
  server/      # Node.js backend
    src/
      db/
      routes/
      ...
```

## Customization

- To add more languages, extend the files in `client/src/i18n/languages/`.
- To add more invoice fields, adjust the form factories and backend schema.

## License

MIT

---
