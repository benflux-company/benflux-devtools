# Contributing to Benflux DevTools

Thank you for your interest in contributing! This guide explains how to participate in weekly challenges and submit quality contributions.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Standards](#code-standards)
- [Scoring & Rewards](#scoring--rewards)
- [Community Rules](#community-rules)

---

## How It Works

Each week, a new developer tool challenge is opened via GitHub Issues. Each challenge is broken into **7 tasks worth a total of 100 points**.

1. Browse the [Issues tab](https://github.com/benflux-company/benflux-devtools/issues) and pick an open task
2. Comment on the issue to claim it (first-come, first-served)
3. Fork the repo, work on your task in a branch
4. Submit a Pull Request referencing the issue
5. Wait for review and scoring
6. Top contributors earn **Benflux Coin (BFC)** rewards

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10
- Docker & Docker Compose
- Git

### Local Setup

```bash
# 1. Fork then clone
git clone git@github.com:YOUR_USERNAME/benflux-devtools.git
cd benflux-devtools

# 2. Copy env
cp .env.example .env
# Fill in your GitHub OAuth credentials (see .env.example for instructions)

# 3. Start the database
docker compose up postgres -d

# 4. Install dependencies
npm install

# 5. Run migrations + seed
cd apps/api
npx prisma migrate dev
npx prisma db seed
cd ../..

# 6. Start both servers
npm run dev
```

- Frontend: http://localhost:3000
- API + Swagger: http://localhost:4000/api/docs

---

## Submitting a Pull Request

### Branch naming

```
feat/week-1-json-formatter-copy-button
fix/week-1-json-validation-error
docs/update-readme-setup
```

### PR checklist

- [ ] Branch is up to date with `main`
- [ ] Code builds without errors (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Feature works end-to-end in the browser
- [ ] PR description explains **what** and **why**
- [ ] Issue number referenced in description (`Closes #42`)

### PR size

Keep PRs focused — one task per PR. Large multi-task PRs will be asked to split.

---

## Code Standards

### TypeScript

- Strict mode enabled — no `any` without justification
- Use explicit return types on public functions
- Prefer `const` over `let`

### React / Next.js

- Components in `apps/web/src/components/`
- Use Tailwind for all styling
- No inline styles

### NestJS / Backend

- All endpoints must be documented with `@ApiTags` / `@ApiOperation`
- DTOs must use `class-validator` decorators
- Follow existing module structure

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add copy-to-clipboard button to JSON formatter
fix: handle empty input in JSON validator
docs: add setup instructions for Windows
test: add unit tests for JSON parse utility
```

---

## Scoring & Rewards

Pull Requests are scored 0–100 on:

| Criterion | Weight |
|-----------|--------|
| Code quality | 30% |
| Performance | 20% |
| User experience | 20% |
| Clean architecture | 20% |
| Documentation | 10% |

**Minimum score to merge: 60/100**

Weekly BFC distribution (100 BFC pool):
- 1st place: 40 BFC
- 2nd place: 35 BFC
- 3rd place: 25 BFC

---

## Community Rules

- Be respectful and constructive in reviews
- Do not submit AI-generated code without understanding it
- Do not claim issues you cannot complete in 48h — unclaim promptly
- Plagiarism results in permanent ban
- Low-quality or copy-pasted PRs will be closed without review

---

Questions? Open a [Discussion](https://github.com/benflux-company/benflux-devtools/discussions) or reach out on the Benflux community.
