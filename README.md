Invoicify

Invoicify ist eine moderne Webanwendung für Freelancer, Selbstständige und kleine Unternehmen, um professionelle Rechnungen einfach zu erstellen, zu verwalten und zu organisieren.
✨ Funktionen

    Benutzer-Authentifizierung (Registrieren / Login)

    Mehrsprachigkeit (Deutsch / Englisch)

    Übersichtliches Dashboard mit Schnellzugriffen

    Kundenverwaltung (Hinzufügen, Bearbeiten, Löschen)

    Firmendatenverwaltung

    Rechnungserstellung mit:

        Dynamischer Produktliste

        Automatischer Netto-/Bruttoberechnung

        Fälligkeitsdatum

    Responsive, modernes UI (Tailwind CSS)

    Toast-Benachrichtigungen für Benutzerfeedback

🛠️ Tech-Stack

Frontend:

    React, TypeScript

    React Router, React Hook Form

    i18next (Mehrsprachigkeit)

    Tailwind CSS, React Toastify

Backend:

    fastify, Express

    Drizzle ORM

    PostgreSQL

🚀 Erste Schritte
Voraussetzungen

    Node.js (v18 oder neuer empfohlen)

    npm oder yarn

    PostgreSQL-Datenbank

Installation

1. Repository klonen

git clone https://github.com/ferdiag/invoicify.git
cd invoicify

2. Abhängigkeiten installieren

cd client
npm install
cd ../server
npm install

3. Umgebungsvariablen konfigurieren

Kopiere die Datei .env.example in beiden Ordnern client und server nach .env und passe die Werte an (z. B. Datenbankverbindung, JWT-Secret). 4. Datenbank einrichten

Führe Migrationen aus oder erstelle das Schema wie in server/src/db/schema.ts beschrieben. 5. Entwicklungsserver starten

Backend:

cd server
npm run dev

Frontend:

cd client
npm run dev

Standardmäßig:

    Frontend: http://localhost:5173

    Backend: http://localhost:3000

📖 Nutzung

    Registriere einen neuen Account oder melde dich an.

    Hinterlege deine Firmendaten und Kunden.

    Erstelle Rechnungen, wähle Kunden aus, füge Produkte hinzu, setze MwSt. und Fälligkeitsdatum.

    Lade Rechnungen herunter oder versende sie direkt (zukünftige Funktion).

📂 Projektstruktur

invoicify/
client/ # React-Frontend
src/
components/
pages/
i18n/
factories/
...
server/ # Node.js-Backend
src/
db/
routes/
...

🌍 Anpassung

    Neue Sprachen: Dateien in client/src/i18n/languages/ erweitern.

    Zusätzliche Rechnungsfelder: Formular-Logik und Datenbankschema entsprechend anpassen.

🐳 Optional: Docker-Setup für PostgreSQL

Falls du PostgreSQL nicht lokal installieren möchtest, kannst du die Datenbank auch mit Docker starten:

services:
db:
image: postgres:15
restart: always
ports: - "5433:5432"
environment:
POSTGRES_USER: ferhat
POSTGRES_PASSWORD: supersecret
POSTGRES_DB: invoicify
volumes: - postgres_data:/var/lib/postgresql/data

volumes:
postgres_data:

Starte die Datenbank mit:

docker-compose up -d

    Hinweis: Backend & Frontend müssen weiterhin separat gestartet werden.

📜 Lizenz

MIT
