Invoicify

Ein schlankes Rechnungs-Tool für Freelancer, Selbstständige und kleine Unternehmen: Rechnungen professionell erstellen, verwalten und den Überblick behalten – ohne Ballast.

✨ Features

Benutzer-Accounts (Registrierung & Login)

Mehrsprachigkeit (DE/EN)

Übersichtliches Dashboard mit Schnellzugriffen

Kundenverwaltung (Anlegen, Bearbeiten, Löschen)

Firmenstammdaten

Rechnungserstellung mit

dynamischer Positionenliste

Netto/Brutto-Berechnung

Fälligkeitsdatum

Responsives, modernes UI (Tailwind)

Toast-Benachrichtigungen für klares Feedback

Tech-Stack
Frontend: React + TypeScript, React Router, React Hook Form, i18next, Tailwind, React-Toastify
Backend: Fastify (Express-Kompatibilität für Middleware wo sinnvoll), Drizzle ORM, PostgreSQL
Dev: Vite (FE), Node/NPM Scripts (BE) – Standardports: Frontend :5173, Backend :3000. 


🚀 Getting Started
Voraussetzungen

Node.js ≥ 18

npm oder yarn

PostgreSQL (lokal oder via Docker)

Installation

# 1) Repo klonen
git clone https://github.com/ferdiag/invoicify.git
cd invoicify

# 2) Abhängigkeiten installieren
cd client && npm install
cd ../server && npm install

Umgebungsvariablen

Erstelle in client und server jeweils eine .env (ausgehend von .env.example, falls vorhanden) und erstelle sinnvolle Defaults:

/server/.env

DATABASE_URL=postgres://USER:PASS@localhost:5433/invoicify
JWT_SECRET=...
PORT=3000
NODE_ENV=development

/client/.env

VITE_API_URL=http://localhost:3000
VITE_DEFAULT_LOCALE=de

    Passe DATABASE_URL an, falls du Postgres lokal ohne Docker nutzt (Port dann meist 5432).

Datenbank & Schema

    Drizzle ORM definiert das Schema im Backend (z. B. unter server/src/db/schema.ts).

    Führe deine Migrations/Init-Steps gemäß Projektkonfiguration aus (z. B. Drizzle-CLI oder eigener Setup-Script).
    GitHub

Development starten

# Backend
cd server
npm run dev

# Frontend (neues Terminal)
cd client
npm run dev

    Frontend: http://localhost:5173

Backend: http://localhost:3000

    GitHub

🐘 PostgreSQL via Docker (optional)

Es liegt ein docker-compose.yml bei, mit dem du eine lokale Postgres-Instanz starten kannst (Port-Mapping z. B. 5433:5432).

docker-compose up -d

    Danach verbindet sich das Backend über DATABASE_URL mit localhost:5433.
    GitHub

🧭 Projektstruktur (Kurzüberblick)

invoicify/
  client/          # React-Frontend (Vite)
    src/
      components/
      pages/
      i18n/
      factories/
      ...
  server/          # Fastify-Backend
    src/
      db/
      routes/
      ...
  docker-compose.yml
  README.md

🔌 API (Beispiele)

    Die genauen Routen können variieren – orientiere dich an server/src/routes/*.

    POST /auth/register – neuen Benutzer anlegen

    POST /auth/login – Token ausstellen

    GET /customers / POST /customers / PATCH /customers/:id / DELETE /customers/:id

    GET /invoices / POST /invoices / PATCH /invoices/:id / DELETE /invoices/:id

Antwortformate: JSON
Auth: Bearer Token (JWT) im Authorization-Header
🛠️ Nützliche Scripts

Client

npm run dev         # Vite-Devserver
npm run build       # Production-Build
npm run preview     # Build lokal testen

Server

npm run dev         # Dev-Start (Hot Reload, falls konfiguriert)
npm run start       # Prod-Start
# ggf. npm run migrate / npm run db:... (falls definiert)

🧩 i18n

    Sprachen liegen i. d. R. unter client/src/i18n/languages/.

    Neue Sprache hinzufügen: JSON-Datei anlegen, i18next config erweitern, Keys in Komponenten nutzen.
    GitHub

🗺️ Roadmap (Vorschläge)

    PDF-Export & E-Mail-Versand direkt aus der App

    Wiederkehrende Rechnungen & Zahlungserinnerungen

    Mehrwährungs-Support & Rundungsregeln

    Logo-Upload / Marken-Branding pro Account

    Detaillierte Berichte (Umsatz pro Kunde, Zeitraum etc.)

    Rollenkonzept (z. B. Admin/Editor)

🤝 Mitwirken

Issues & Pull Requests sind willkommen: Bitte kurze Beschreibung, Steps zum Reproduzieren und klaren Scope. Code-Style: Prettier/ESLint (falls konfiguriert) respektieren.
📄 Lizenz

MIT

Wenn du willst, passe ich die README direkt an deine tatsächlichen Env-Variablen, Scripts und konkreten Routen im Code an (inkl. Beispiel-Requests mit curl/REST Client) – sag mir einfach, welche Teile ich aus dem Repo 1:1 spiegeln soll.
