# 🧰 Benflux DevTools

> Community-driven developer tools platform powered by **DevArena** — where developers compete weekly to build real tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone git@github.com:benflux-company/benflux-devtools.git
cd benflux-devtools

# 2. Copy environment
cp .env.example .env
# Edit .env with your GitHub OAuth credentials

# 3. Start database
docker compose up postgres -d

# 4. Install dependencies
npm install

# 5. Run migrations + seed
cd apps/api
npx prisma migrate dev
npx prisma db seed

# 6. Start dev servers (both api + web)
cd ../..
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🏗️ Architecture

```
benflux-devtools/
├── apps/
│   ├── api/          ← NestJS REST API (port 4000)
│   └── web/          ← Next.js frontend (port 3000)
├── scripts/          ← GitHub automation
├── docker-compose.yml
└── .env.example
```

### Stack

| Layer      | Tech                          |
|-----------|-------------------------------|
| Frontend  | Next.js 14 (App Router), TailwindCSS, TypeScript |
| Backend   | NestJS, TypeScript, Swagger   |
| Database  | PostgreSQL 16, Prisma ORM     |
| Auth      | GitHub OAuth 2.0, JWT         |
| DevOps    | Docker, Docker Compose, Turbo |

---

## 🧩 Features

| Feature | Status |
|---------|--------|
| GitHub OAuth Login | ✅ |
| Developer Dashboard | ✅ |
| JSON Formatter Tool | ✅ Week 1 |
| Weekly Challenge System | ✅ |
| PR Submission & Review | ✅ |
| Leaderboard (Weekly/Monthly/All-time) | ✅ |
| Benflux Coin Wallet | ✅ |
| Admin Panel | ✅ |
| GitHub Issues Auto-generation | ✅ |
| GitHub Labels Auto-setup | ✅ |
| JWT Decoder Tool | 🔜 Week 2 |
| Password Generator | 🔜 Week 3 |

---

## 🎮 Weekly Challenge System

Each week, one tool is built collaboratively:

1. Admin creates a challenge
2. GitHub Issues are auto-generated (7 tasks = 100 points)
3. Developers fork the repo, pick issues, submit PRs
4. Admin reviews and scores PRs (min 60 to pass)
5. Points + BFC rewards distributed to top contributors

**Week 1:** JSON Formatter — 100 points total

---

## 💰 Benflux Coin (BFC)

Internal reward system — **not blockchain**.

- `100 BFC = $5 USD` (virtual conversion)
- Weekly reward pool: `100 BFC`
- Top 3 earners get: `40 / 35 / 25 BFC`
- Tracked in internal wallet per user

---

## 🛠️ API Docs

Once the API is running, visit:

```
http://localhost:4000/api/docs
```

---

## 🔧 GitHub Automation

Setup labels and issues automatically:

```bash
cd scripts
npx ts-node github-setup.ts
```

Requires `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` in your `.env`.

---

## 🐳 Docker (Full Stack)

```bash
docker compose up --build
```

---

## 📜 License

MIT © [Benflux Company](https://github.com/benflux-company)
