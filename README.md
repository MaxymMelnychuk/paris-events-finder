# Paris Events Finder

**Paris Events Finder** is a small full‑stack Next.js application that lets users search for events happening in Paris. It includes user registration and login, a simple session‑based auth flow, and a search interface that displays matching events in responsive cards.

The goal of the project is to be a clean, minimal example of:

- **Modern Next.js app router UI** for event search
- **Authentication (register / login / logout)** with password validation
- **Server–side integration** with a database (via `mysql2`) and secure password hashing (`bcrypt`)
- **Dockerized deployment** for easy running in containers

---

### Features

- **Search Paris events**
  - Type a query (e.g. concert, theater, exhibition) into the search bar on the home page.
  - Fetches matching events via a typed helper (`fetchEvents`) and renders them as `EventCard` components.
  - Displays loading and error states, as well as an empty state (`No events found.`).

- **User accounts & authentication**
  - **Register** with username, email, and password (`/auth/register`).
  - Password is validated client‑side via `validatePassword` for basic strength rules.
  - **Login** with email and password (`/auth/login`).
  - On success, you are redirected back to `/` and your session is available via `/api/me`.
  - **Logout** button on the home page invalidates the session via `/api/logout`.

- **User‑aware UI**
  - When authenticated, the header shows your username and a **Logout** button.
  - When not authenticated, the header shows **Login** and **Register** buttons.

- **Clean, responsive UI**
  - Built with small reusable UI primitives like `Button`, `PrimaryButton`, and `TextInput`.
  - Event grid layout adapts from 1 to 3 columns (`sm` / `lg` breakpoints).

---

### Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database / Backend**:
  - `mysql2` for database access (MySQL / MariaDB)
  - `bcrypt` for password hashing
- **Tooling**:
  - ESLint (`eslint-config-next`)
  - Prettier
  - Dockerfile for containerized builds

---

### Project Structure (high level)

- `app/`
  - `page.tsx` – Home page with search bar, auth‑aware header, and event results grid.
  - `auth/login/page.tsx` – Login form, calls `/api/login`.
  - `auth/register/page.tsx` – Registration form with password validation, calls `/api/register`.
  - `api/*` – (not shown here) server endpoints for auth, current user, events, etc.
- `components/`
  - `events/EventCard.tsx` – Presentational card for a single event.
  - `auth/AuthShell.tsx` – Shell layout for auth pages.
  - `auth/AuthFormCard.tsx` – Shared card wrapper for register/login.
  - `ui/Button.tsx`, `ui/PrimaryButton.tsx`, `ui/TextInput.tsx` – Reusable UI primitives.
- `lib/`
  - `fetchEvents.ts` – Client helper that calls the events API and returns typed data.
  - `passwordValidation.ts` – Password validation logic for registration.
- `types/`
  - `event.ts` – `Event` type definition.
  - `auth.ts` – Auth‑related types (`SessionUser`, `LoginResponse`, `RegisterResponse`, etc.).
- `Dockerfile` – Production build and runtime image for the app.

(Some folders/files may differ slightly from this overview but follow the same ideas.)

---

### Prerequisites

- **Node.js** 18+ (Node 22 is used in the `Dockerfile`)
- **npm** (or another Node package manager)
- A **MySQL/MariaDB database** if you intend to use the full auth stack in production.

You will also need to configure the appropriate environment variables (for example, database connection string, session secret, etc.) in `.env` or `.env.local`. These files are intentionally ignored by Git and Docker (`.env`, `.env.local`, `.env.*.local`, `.env.docker`).

---

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

If you use a different package manager (e.g. `pnpm`, `yarn`, or `bun`), install using its equivalent command.

---

### Running the app in development

Start the Next.js dev server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

In dev mode you can:

- **Visit `/`** – search for events in Paris.
- **Visit `/auth/register`** – create a new user account.
- **Visit `/auth/login`** – log in and then return to `/` with your authenticated session.

The page will hot‑reload as you edit code.

---

### Building and running in production (locally)

Create a production build and run it:

```bash
npm run build
npm start
```

This will start the app in production mode (by default on port `3000`).

Make sure your environment variables are set before running these commands.

---

### Running with Docker

This project includes a simple `Dockerfile` that:

1. Uses `node:22-alpine`
2. Installs dependencies
3. Builds the Next.js app
4. Runs `npm start`

Build the image:

```bash
docker build -t paris-events-finder .
```

Run the container (mapping port 3000):

```bash
docker run -p 3000:3000 --env-file .env.docker paris-events-finder
```

Adjust the `--env-file` argument (or individual `-e` flags) to match how you manage secrets and database configuration.

---

### What you can do with Paris Events Finder

- **Explore events**: Use the search input on the home page to look for different kinds of events in Paris.
- **Create an account**: Register, log in, and see a personalized header that shows your username.
- **Securely authenticate**: Passwords are validated and hashed before storage on the server.
- **Experiment & extend**: Treat this as a starter for building a richer events platform (favourites, categories, booking, maps, etc.).

---

### Scripts

- **`npm run dev`** – Start the development server.
- **`npm run build`** – Create an optimized production build.
- **`npm start`** – Start the production server (after building).
- **`npm run lint`** – Run ESLint over the project.
- **`npm run format`** – Format files with Prettier.

---

### Notes & next steps

This project is intentionally small and focused. Good next steps you could implement:

- Add filtering (date range, category, free/paid).
- Add user favourites or saved events.
- Integrate a real events datasource (public API or your own DB schema).
- Add tests (unit and integration) to cover auth flows and search behaviour.

