# Next.js Table

An interactive, server-rendered table build with Next.js and Prisma OR with pagination, searching, sorting, column visibility, and
advances filter.

## 🚀 Features

- Server-side pagination, search, sorting, and filtering
- Dynamic filters for text, lists, dates, periods, and numeric values
- Configurable column visibility and sorting
- Search and table controls synchronized with URL parameters
- SQLite database with seeded company and revenue data
- Responsive UI built with reusable table components

## 🛠️ Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma ORM](https://www.prisma.io/) - Database toolkit
- [SQLite](https://www.sqlite.org/) - Local database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Floating UI](https://floating-ui.com/) - Popovers and positioned controls

## Getting started

Install the dependencies and create the local SQLite database:

```bash
bun install
bun run db:setup
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database is
created at `prisma/dev.db`; the seed command upserts six companies and 30
monthly revenue records, so it can be run repeatedly with `bun run db:seed`
without creating duplicates.

Use `bun run db:migrate` to apply future schema changes.
