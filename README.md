<div align="center">

# Cookfectionary

### Where Every Bite Tells a Story

A full-stack catering platform — public website, customer portal, real-time messaging, Stripe payments, and an admin dashboard to run the entire business.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white)](https://stripe.com/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)

[Live Demo](https://cookfectionary-app-production.up.railway.app) · [Report Bug](https://github.com/shaun-holden/cookfectionary/issues) · [Request Feature](https://github.com/shaun-holden/cookfectionary/issues)

</div>

---

## Table of Contents

- [About](#about)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [WebSocket Events](#websocket-events)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## About

Cookfectionary is a production-ready catering business platform built with Next.js 15 and React 19. It combines a polished public-facing website with a full customer ordering portal and an admin dashboard — all backed by real-time messaging, Stripe payments, Cloudinary image hosting, and email/SMS notifications.

---

## Screenshots

> Add screenshots to a `docs/screenshots/` folder and uncomment the sections below.

<!--
### Home Page
![Home Page](docs/screenshots/home.png)

### Menu
![Menu](docs/screenshots/menu.png)

### Customer Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Admin Panel
![Admin](docs/screenshots/admin.png)
-->

---

## Features

### Public Website

- **Home** — Hero section, featured dishes, testimonials, and call-to-action
- **Menu** — Browse all items filtered by category (Mains, Sides, Desserts, Drinks)
- **Gallery** — Masonry photo grid with full-size lightbox
- **About** — The caterer's story, values, and stats
- **Contact** — Inquiry form with business info and hours

### Customer Portal

- **Place Orders** — Add items to cart, enter event details (date, type, guest count), submit
- **Track Orders** — Follow status from Pending → Confirmed → In Progress → Completed
- **Pay Invoices** — Click a Stripe payment link to pay online
- **Live Chat** — Real-time messaging with the caterer via Socket.IO

### Admin Dashboard

| Section | Capabilities |
|---------|-------------|
| **Orders** | View all orders, update status, see event details and special notes |
| **Menu** | Add, edit, or delete items with photo uploads via Cloudinary |
| **Gallery** | Upload and manage event photos (auto-syncs with Cloudinary) |
| **Invoices** | Create invoices, generate Stripe payment links, track payment status |
| **Customers** | View all registered customers with contact info and order history |
| **Messages** | Unified inbox with real-time replies across all conversations |

### Notifications

| Trigger | Email | SMS |
|---------|:-----:|:---:|
| Order placed | ✅ | ✅ |
| Invoice sent | ✅ | ✅ |
| New message | ✅ | — |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + [Framer Motion](https://motion.dev/) |
| **Database** | [PostgreSQL](https://postgresql.org/) + [Prisma ORM](https://prisma.io/) |
| **Auth** | JWT with role-based access (Admin / Customer) |
| **Payments** | [Stripe](https://stripe.com/) — Checkout, Payment Links, Webhooks |
| **Images** | [Cloudinary](https://cloudinary.com/) (signed uploads) |
| **Real-time** | [Socket.IO](https://socket.io/) |
| **Email** | [Nodemailer](https://nodemailer.com/) |
| **SMS** | [Twilio](https://twilio.com/) |
| **Server** | Custom Node.js server (`server.js`) wrapping Next.js + Socket.IO |
| **Hosting** | [Railway](https://railway.app/) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** (local instance or hosted)
- Accounts: [Stripe](https://dashboard.stripe.com/register), [Cloudinary](https://cloudinary.com/), [Twilio](https://twilio.com/), Gmail (or any SMTP provider)

### Installation

```bash
# Clone
git clone https://github.com/shaun-holden/cookfectionary.git
cd cookfectionary

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your actual keys (see section below)

# Push the database schema
npx prisma db push

# Seed with sample data
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cookfectionary.com` | `admin123` |
| Customer | `customer@cookfectionary.com` | `customer123` |

---

## Environment Variables

Create `.env.local` in the project root:

```env
# ── Database ──────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/cookfectionary"

# ── Auth ──────────────────────────────────────────────────
JWT_SECRET="your-random-secret-string"
JWT_EXPIRES_IN="7d"

# ── Stripe ────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ── Cloudinary ────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"

# ── Twilio ────────────────────────────────────────────────
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"

# ── Email (SMTP) ─────────────────────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="your_app_password"
SMTP_FROM="Cookfectionary <your@gmail.com>"

# ── App ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Database Schema

```
User
├── id, email, password, name, phone
├── role (ADMIN | CUSTOMER)
├── orders[], conversations[], notifications[]

MenuItem
├── id, name, description, price, category
├── image (Cloudinary URL), available (boolean)

Order
├── id, userId → User
├── total, status, paymentStatus
├── eventDate, eventType, guestCount, notes
├── items[] → OrderItem, invoice → Invoice

OrderItem
├── id, orderId → Order, menuItemId → MenuItem
├── quantity, price, notes

Invoice
├── id, orderId → Order
├── amount, deposit, status, stripeUrl, dueDate, paidAt

GalleryImage
├── id, title, description, imageUrl, category

Conversation
├── id, customerId → User, messages[] → Message

Message
├── id, conversationId → Conversation, senderId → User
├── content, read (boolean)

Notification
├── id, userId → User, type, title, message, read
```

**Order status flow:** `PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` | `CANCELLED`

**Payment status flow:** `UNPAID` → `PARTIAL` → `PAID` | `REFUNDED`

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a customer account |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/auth/me` | Get the current user from token |

### Menu

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/menu` | Public | List all available items |
| `POST` | `/api/menu` | Admin | Create a menu item |
| `PATCH` | `/api/menu/[id]` | Admin | Update a menu item |
| `DELETE` | `/api/menu/[id]` | Admin | Delete a menu item |

### Gallery

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/gallery` | Public | List all gallery images |
| `POST` | `/api/gallery` | Admin | Add a gallery image |
| `DELETE` | `/api/gallery/[id]` | Admin | Delete image (removes from Cloudinary) |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/orders` | User | List orders (admin: all, customer: own) |
| `POST` | `/api/orders` | User | Place a new order |
| `GET` | `/api/orders/[id]` | User | Get order details |
| `PATCH` | `/api/orders/[id]` | Admin | Update order status |

### Invoices

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/invoices` | User | List invoices |
| `POST` | `/api/invoices` | Admin | Create invoice + Stripe payment link |

### Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/messages` | User | Get conversations (admin: all, customer: own) |
| `POST` | `/api/messages` | User | Send a message |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/payments/checkout` | User | Create a Stripe Checkout session |
| `POST` | `/api/payments/webhook` | Stripe | Handle payment events |

### Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/upload/sign` | Admin | Generate a Cloudinary upload signature |

---

## WebSocket Events

The app uses a custom Node.js server (`server.js`) that wraps Next.js with Socket.IO for real-time features.

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-admin` | Client → Server | Admin joins `admin-room` to receive all events |
| `join-user` | Client → Server | Customer joins their `user:{id}` room |
| `join-conversation` | Client → Server | Join a specific conversation room |
| `send-message` | Client → Server | Send a chat message |
| `new-message` | Server → Client | Broadcast message to conversation participants |
| `new-order` | Server → Client | Notify admin of a new order |

---

## Deployment

### Railway (Recommended)

#### First-Time Setup

```bash
# Create project and add services
railway init --name cookfectionary
railway add --database postgres
railway add --service cookfectionary-app
railway service link cookfectionary-app

# Set environment variables
railway variables set \
  NODE_ENV=production \
  JWT_SECRET="your-secret" \
  JWT_EXPIRES_IN=7d \
  'DATABASE_URL=${{Postgres.DATABASE_URL}}' \
  STRIPE_SECRET_KEY="sk_live_..." \
  # ... (all other env vars)

# Deploy
railway up --detach

# Generate public URL
railway domain

# Seed the database
railway run npm run db:seed
```

#### Ongoing Deploys

```bash
git add . && git commit -m "your message" && git push
railway up --detach
```

> The `postinstall` script automatically runs `prisma generate` and `prisma db push` on every deploy.

#### Stripe Webhook (Production)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.up.railway.app/api/payments/webhook`
3. Select events: `checkout.session.completed`
4. Copy the signing secret → set `STRIPE_WEBHOOK_SECRET` on Railway

### Testing Stripe Payments

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 9995` | Payment declined |

Use any future expiry date and any 3-digit CVC.

---

## Project Structure

```
cookfectionary/
├── server.js                       # Custom server (Next.js + Socket.IO)
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Seed script
├── src/
│   ├── app/
│   │   ├── page.tsx                # Home
│   │   ├── about/                  # About page
│   │   ├── menu/                   # Menu page
│   │   ├── gallery/                # Gallery page
│   │   ├── contact/                # Contact page
│   │   ├── order/                  # Order builder
│   │   ├── login/                  # Login page
│   │   ├── register/               # Registration page
│   │   ├── dashboard/              # Customer portal
│   │   │   ├── orders/
│   │   │   ├── invoices/
│   │   │   └── messages/
│   │   ├── admin/                  # Admin panel
│   │   │   ├── orders/
│   │   │   ├── menu/
│   │   │   ├── gallery/
│   │   │   ├── invoices/
│   │   │   ├── customers/
│   │   │   └── messages/
│   │   └── api/                    # REST API routes
│   ├── components/
│   │   ├── layout/                 # Navbar, Footer, PublicLayout
│   │   ├── home/                   # Home page sections
│   │   └── ui/                     # Shared UI components
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth state + JWT
│   │   ├── CartContext.tsx          # Shopping cart state
│   │   └── SocketContext.tsx        # Socket.IO connection
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── auth.ts                 # JWT helpers + middleware
│   │   ├── stripe.ts               # Stripe client
│   │   ├── cloudinary.ts           # Cloudinary config + signing
│   │   ├── email.ts                # Nodemailer templates
│   │   ├── sms.ts                  # Twilio helpers
│   │   └── socket.ts               # Socket.IO client
│   └── types/
│       └── index.ts                # Shared TypeScript interfaces
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

<div align="center">

Built with ❤️ for Cookfectionary

</div>
