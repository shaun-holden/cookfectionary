# Cookfectionary

> **Where Every Bite Tells a Story** — A full-stack catering website and web app.

**Live:** https://cookfectionary-app-production.up.railway.app
**GitHub:** https://github.com/shaun-holden/cookfectionary

---

## Overview

Cookfectionary is a complete catering business platform with a public-facing marketing website, customer ordering portal, real-time messaging, Stripe payments, and an admin dashboard to manage everything.

---

## Features

### Public Website
| Page | Description |
|---|---|
| **Home** | Hero section, featured menu preview, why-us section, testimonials, CTA |
| **About** | Caterer story, values, stats |
| **Menu** | Full menu filtered by category (Mains, Sides, Desserts, Drinks). Click + to add to cart |
| **Gallery** | Masonry photo grid with lightbox. Click any photo to view full size |
| **Contact** | Inquiry form, business info, hours |

### Customer Account
Customers register/log in to access:

- **Place Orders** — Browse the menu, add items to cart, enter event details (date, type, guest count, notes), submit order
- **View Orders** — Track all orders and their status (Pending → Confirmed → In Progress → Completed)
- **Pay Invoices** — When admin sends an invoice, a Stripe payment link appears. Click "Pay Now" to pay online
- **Messages** — Real-time chat with the caterer. Replies appear instantly without refreshing

### Admin Dashboard (`/admin`)
Admin logs in to manage the entire business:

#### Orders
- View all incoming orders with full customer details
- One-click status updates: Pending → Confirmed → In Progress → Completed → Cancelled
- See event date, type, guest count, special notes per order

#### Menu Management
- Add, edit, or delete menu items
- Upload photos directly (stored on Cloudinary)
- Set name, description, price, category, and availability

#### Gallery
- Upload event/food photos (stored on Cloudinary)
- Attach a title, description, and category to each photo
- Delete photos — automatically removes from Cloudinary too

#### Invoices
- Create invoices for any confirmed order
- Set invoice amount, optional deposit, and due date
- Railway auto-generates a Stripe Payment Link and emails it to the customer
- Track invoice status: Pending / Sent / Paid / Overdue

#### Customers
- View all registered customers with contact info and order count

#### Messages
- See all customer conversations in one inbox
- Reply in real-time — customer sees your message instantly

### Notifications
Every key action triggers automatic notifications:

| Event | Email | SMS |
|---|---|---|
| Order placed | ✅ Customer gets confirmation | ✅ Customer gets SMS |
| Invoice sent | ✅ Customer gets invoice + payment link | ✅ Customer gets SMS |
| New message | ✅ Recipient gets email preview | — |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 + Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (ADMIN / CUSTOMER roles) |
| Payments | Stripe Checkout + Payment Links + Webhooks |
| Images | Cloudinary (signed uploads) |
| Real-time | Socket.IO |
| Email | Nodemailer |
| SMS | Twilio |
| Server | Custom Node.js server (`server.js`) |
| Deploy | Railway |

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Railway)
- Accounts for: Stripe, Cloudinary, Twilio, Gmail (or SMTP provider)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/shaun-holden/cookfectionary.git
cd cookfectionary

# 2. Install dependencies
npm install

# 3. Copy env file and fill in your keys
cp .env.local.example .env.local
# Edit .env.local with your actual API keys

# 4. Push the database schema
npx prisma db push

# 5. Seed the database (creates admin account + sample data)
npm run db:seed

# 6. Start the development server
npm run dev
```

Open http://localhost:3000

### Seed Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@cookfectionary.com | admin123 |
| Customer | customer@cookfectionary.com | customer123 |

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cookfectionary"

# Auth
JWT_SECRET="your-random-secret-string"
JWT_EXPIRES_IN="7d"

# Stripe (get from dashboard.stripe.com → Developers → API Keys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary (get from cloudinary.com → Dashboard)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"

# Twilio (get from console.twilio.com)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1xxxxxxxxxx"

# Email / SMTP (Gmail: Settings → Security → App Passwords)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="your_app_password"
SMTP_FROM="Cookfectionary <your@gmail.com>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## API Routes

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create customer account |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### Menu
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/menu` | Public | List all available items |
| POST | `/api/menu` | Admin | Create menu item |
| PATCH | `/api/menu/[id]` | Admin | Update menu item |
| DELETE | `/api/menu/[id]` | Admin | Delete menu item |

### Gallery
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/gallery` | Public | List all gallery images |
| POST | `/api/gallery` | Admin | Add gallery image |
| DELETE | `/api/gallery/[id]` | Admin | Remove image (also deletes from Cloudinary) |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders` | User | List orders (admin sees all, customer sees own) |
| POST | `/api/orders` | User | Place new order |
| GET | `/api/orders/[id]` | User | Get order detail |
| PATCH | `/api/orders/[id]` | Admin | Update order status |

### Invoices
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/invoices` | User | List invoices |
| POST | `/api/invoices` | Admin | Create invoice + Stripe Payment Link |

### Messages
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/messages` | User | Get conversation(s). Admin gets all, customer gets their own |
| POST | `/api/messages` | User | Send a message |

### Payments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/payments/checkout` | User | Create Stripe Checkout session |
| POST | `/api/payments/webhook` | Stripe | Handle payment events (marks invoices/orders as paid) |

### Upload
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload/sign` | Admin | Generate Cloudinary upload signature |

---

## Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `join-admin` | Client → Server | Admin joins the `admin-room` to receive all events |
| `join-user` | Client → Server | Customer joins their `user:{id}` room |
| `join-conversation` | Client → Server | Join a specific conversation room |
| `send-message` | Client → Server | Send a chat message |
| `new-message` | Server → Client | Broadcast new message to conversation participants |
| `new-order` | Server → Client | Notify admin room of a new order |

---

## Deployment (Railway)

### First-time setup
```bash
# 1. Create Railway project
railway init --name cookfectionary

# 2. Add PostgreSQL
railway add --database postgres

# 3. Add app service and link
railway add --service cookfectionary-app
railway service link cookfectionary-app

# 4. Set environment variables
railway variables set NODE_ENV=production \
  JWT_SECRET="your-secret" \
  JWT_EXPIRES_IN=7d \
  'DATABASE_URL=${{Postgres.DATABASE_URL}}' \
  STRIPE_SECRET_KEY="sk_live_..." \
  # ... etc

# 5. Deploy
railway up --detach

# 6. Generate domain
railway domain

# 7. Run seed
railway run npm run db:seed
```

### Ongoing deploys
```bash
git add . && git commit -m "your message" && git push && railway up --detach
```

### Stripe Webhook (production)
After deploying, go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks):
1. Add endpoint: `https://cookfectionary-app-production.up.railway.app/api/payments/webhook`
2. Select events: `checkout.session.completed`, `payment_link.completed`
3. Copy the signing secret → set `STRIPE_WEBHOOK_SECRET` on Railway

---

## Database Schema

```
User         — id, email, password, name, phone, role (ADMIN/CUSTOMER)
MenuItem     — id, name, description, price, category, image, available
Order        — id, userId, total, status, eventDate, eventType, guestCount, paymentStatus
OrderItem    — id, orderId, menuItemId, quantity, price, notes
Invoice      — id, orderId, amount, deposit, status, stripeUrl, dueDate, paidAt
GalleryImage — id, title, description, imageUrl, category
Conversation — id, customerId
Message      — id, conversationId, senderId, content, read
Notification — id, userId, type, title, message, read
```

---

## Project Structure

```
Cookfectionary/
├── server.js                    # Custom server (Next.js + Socket.IO)
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script (admin + sample data)
├── src/
│   ├── app/
│   │   ├── page.tsx             # Home page
│   │   ├── about/               # About page
│   │   ├── menu/                # Menu page
│   │   ├── gallery/             # Gallery page
│   │   ├── contact/             # Contact page
│   │   ├── order/               # Order builder
│   │   ├── login/ register/     # Auth pages
│   │   ├── dashboard/           # Customer portal
│   │   │   ├── orders/
│   │   │   ├── invoices/
│   │   │   └── messages/
│   │   ├── admin/               # Admin panel
│   │   │   ├── orders/
│   │   │   ├── menu/
│   │   │   ├── gallery/
│   │   │   ├── invoices/
│   │   │   ├── customers/
│   │   │   └── messages/
│   │   └── api/                 # All API routes
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── home/                # Home page sections
│   │   └── ui/                  # Shared UI components
│   ├── context/
│   │   ├── AuthContext.tsx      # Auth state
│   │   ├── CartContext.tsx      # Shopping cart
│   │   └── SocketContext.tsx    # Socket.IO connection
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client
│   │   ├── auth.ts              # JWT helpers
│   │   ├── stripe.ts            # Stripe client
│   │   ├── cloudinary.ts        # Cloudinary + upload signing
│   │   ├── email.ts             # Nodemailer templates
│   │   └── sms.ts               # Twilio helpers
│   └── types/index.ts           # Shared TypeScript types
```

---

## Testing Stripe Payments (Development)

Use Stripe test cards:

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 9995` | Payment declined |

Any future expiry date and any 3-digit CVC work.

---

Built with ❤️ for Cookfectionary.
