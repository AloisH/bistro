# 🍽️ Bistro

[![CI](https://github.com/AloisH/bistro/actions/workflows/ci.yml/badge.svg)](https://github.com/AloisH/bistro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Free, open-source Nuxt 4 starter kit for AI-powered SaaS products**

## What is Bistro?

Bistro is a production-ready starter kit for developers building AI-powered SaaS applications. Unlike paid alternatives ($149-$349), Bistro provides everything you need completely free with an MIT license.

**Built with:**

- ⚡ **Nuxt 4** — Full-stack framework
- 🎨 **Nuxt UI + Tailwind 4** — Beautiful, accessible components
- 🗄️ **PostgreSQL + Prisma** — Type-safe database
- 🔐 **Better Auth** — Modern authentication
- 🤖 **Vercel AI SDK** — AI integrations (OpenAI, Anthropic, local models)
- 💳 **Polar** — Developer-friendly payments
- 📧 **Resend** — Email with React templates
- 🐳 **Docker** — Consistent dev & production environments

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/bistro.git
cd bistro

# Install dependencies
bun install

# Start PostgreSQL & Redis
docker compose up -d

# Set up environment variables
cp .env.example .env
# Edit .env with your keys

# Run database migrations
bun db:migrate

# Start development server
bun dev
```

Visit http://localhost:3000

## Production Testing

Test production Docker build locally (uses `.env.docker` automatically):

```bash
# Build and run production setup
bun docker:prod

# Or run detached
bun docker:prod:up

# View logs
bun docker:prod:logs

# Stop
bun docker:prod:down
```

Uses separate `.env.docker` file (postgres hostname) so local dev `.env` (localhost) stays unchanged.

See [docs/docker-production.md](docs/docker-production.md) for details.

## Features

✅ **Core Infrastructure**

- Full-stack TypeScript with Nuxt 4
- PostgreSQL database with Prisma ORM
- Better Auth (email, OAuth, 2FA)
- Docker Compose dev environment

🤖 **AI-Powered Workflows**

- Blog post generation
- Ad creative studio
- Landing page builder
- Email funnel designer
- Brand package creator
- Product idea validator

🎨 **UI & Content**

- Pre-built Nuxt UI components
- Nuxt Content for docs/blog
- Tiptap rich text editor
- Mobile-responsive layouts

💼 **Business Features**

- Polar payments integration
- Multi-tenant support
- Email templates (Resend)
- Background job queue

## Project Structure

```
bistro/
├── apps/
│   ├── landing/     # Marketing site
│   ├── web/         # Main starter kit
│   └── docs/        # Documentation
├── packages/
│   ├── cli/         # CLI scaffolding tool
│   ├── ui/          # Shared UI components
│   ├── lib/         # Shared utilities
│   ├── database/    # Prisma schema & migrations
│   └── config/      # Shared configs
├── templates/       # Project templates
├── prompts/         # AI prompt templates
└── scripts/         # Setup & deployment scripts
```

## Documentation

- **[Quickstart Guide](docs/quickstart.md)** — Get running in < 10 minutes
- **[Architecture](docs/architecture.md)** — System design & decisions
- **[Deployment](docs/deployment.md)** — Production deployment guides
- **[AI Integration](docs/ai.md)** — Adding AI features
- **[API Reference](docs/api.md)** — Endpoint documentation

## Why Bistro?

| Feature               | Bistro          | Others       |
| --------------------- | --------------- | ------------ |
| **Price**             | **Free (MIT)**  | $149-$349    |
| **Framework**         | **Nuxt 4**      | Nuxt 3       |
| **AI Built-in**       | **✓**           | Limited/None |
| **Content Workflows** | **✓**           | ❌           |
| **Community**         | **Open-source** | Proprietary  |

## Development

```bash
# Run tests
bun test

# Type checking
bun typecheck

# Lint & format
bun lint
bun format

# Database commands
bun db:migrate    # Run migrations
bun db:seed       # Seed database
bun db:studio     # Open Prisma Studio
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to contribute:**

- 🐛 Bug reports & fixes
- ✨ New features
- 📖 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 Translations

## Community & Support

- **Discord:** [Join our community](#)
- **GitHub Discussions:** Ask questions, share projects
- **Twitter/X:** [@bistrosass](#) for updates

## Roadmap

See [ROADMAP.md](ROADMAP.md) for our 90-day MVP plan and future features.

## License

MIT © 2025 Bistro Contributors

**No restrictions.** Use for personal projects, commercial SaaS, or anything else.

## Sponsor

Support ongoing development via [GitHub Sponsors](#). 100% of core features remain free forever.

---

**Built with ❤️ by the open-source community**
