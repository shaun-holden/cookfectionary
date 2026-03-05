# Cookfectionary — Admin Guide

A step-by-step guide for managing your catering business through the admin dashboard.

---

## Getting Started

1. Go to your site: **https://cookfectionary-app-production.up.railway.app**
2. Click **Sign In** (top right, or hamburger menu on mobile)
3. Log in with your admin credentials:
   - **Email:** `admin@cookfectionary.com`
   - **Password:** `admin123`
4. You'll be redirected to the **Admin Dashboard**

> **On mobile:** Tap the ☰ (hamburger) icon in the top-left corner to open the sidebar navigation.

---

## Dashboard Overview

The admin overview page shows a quick snapshot of your business at a glance. From here, use the sidebar to navigate to any section.

---

## Managing Orders

**Sidebar → Orders**

### Viewing Orders
- All customer orders appear in a list with customer name, order total, event date, and current status
- Click an order to see full details: items ordered, event type, guest count, and special notes

### Updating Order Status
Each order moves through these stages:

| Status | Meaning |
|--------|---------|
| **Pending** | New order just placed — needs your review |
| **Confirmed** | You've accepted the order |
| **In Progress** | You're preparing for the event |
| **Completed** | Event is done, order fulfilled |
| **Cancelled** | Order was cancelled |

- Click the status button to advance an order to the next stage
- The customer sees the updated status in their dashboard in real-time

---

## Managing the Menu

**Sidebar → Menu**

### Adding a Menu Item
1. Click **Add Item** (or the + button)
2. Fill in:
   - **Name** — e.g., "Jerk Chicken Platter"
   - **Description** — a short description shown to customers
   - **Price** — the per-unit price
   - **Category** — Mains, Sides, Desserts, or Drinks
   - **Photo** — click to upload an image (stored on Cloudinary)
3. Click **Save**

### Editing a Menu Item
- Click the edit icon on any item to update its details or photo
- Toggle **availability** on/off to hide items from the public menu without deleting them

### Deleting a Menu Item
- Click the delete icon — the item and its photo are removed permanently

---

## Managing the Gallery

**Sidebar → Gallery**

The gallery showcases your food and events on the public website.

### Adding Photos
1. Click **Add Photo**
2. Upload an image (stored on Cloudinary)
3. Add a **title**, **description**, and **category**
4. Click **Save**

### Removing Photos
- Click the delete icon on any photo — it's removed from both the site and Cloudinary

---

## Managing Invoices

**Sidebar → Invoices**

### Creating an Invoice
1. Click **Create Invoice**
2. Select the **order** to invoice
3. Enter:
   - **Amount** — the total amount due
   - **Deposit** (optional) — a partial amount due upfront
   - **Due Date** — when payment is due
4. Click **Create**

What happens next:
- A **Stripe Payment Link** is automatically generated
- The customer receives an **email** with the payment link
- The customer receives an **SMS** (if Twilio is configured)
- The invoice appears in the customer's dashboard with a **"Pay Now"** button

### Invoice Statuses

| Status | Meaning |
|--------|---------|
| **Pending** | Invoice created but not yet sent |
| **Sent** | Customer has been notified |
| **Paid** | Customer completed payment via Stripe |
| **Overdue** | Past the due date and still unpaid |

> Payments are tracked automatically — when a customer pays through the Stripe link, the invoice and order are marked as **Paid** via webhook.

---

## Managing Customers

**Sidebar → Customers**

- View all registered customers with their name, email, phone, and order count
- Use this to look up customer contact info or check their order history

---

## Managing Messages

**Sidebar → Messages**

### Viewing Conversations
- All customer conversations appear in a unified inbox
- Click a conversation to open it

### Replying to Messages
- Type your reply at the bottom and hit **Send**
- Messages are delivered in **real-time** — the customer sees your reply instantly without refreshing
- The customer also receives an **email notification** with a preview of your message

---

## Notifications

The system automatically sends notifications when key events happen:

| Event | What the Customer Gets |
|-------|----------------------|
| **Order placed** | Confirmation email + SMS |
| **Invoice sent** | Email with payment link + SMS |
| **New message from you** | Email with message preview |

> SMS notifications require Twilio to be configured. Email notifications work through Gmail SMTP.

---

## Tips

- **Check orders daily** — new orders come in as "Pending" and customers expect a timely response
- **Use messages** — communicate event details, special requests, or changes directly with customers
- **Upload quality photos** — the gallery and menu photos are what sell your business to new visitors
- **Create invoices promptly** — customers can only pay once you've sent them an invoice with a payment link
- **Keep the menu updated** — toggle availability off for seasonal items instead of deleting them

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Can't log in | Make sure you're using the admin email and password. If locked out, re-run `railway run npm run db:seed` to reset |
| Images not uploading | Check that Cloudinary credentials are set correctly in Railway variables |
| Customer didn't receive email | Verify SMTP settings in Railway. Check the sender Gmail's "Sent" folder |
| Payment not marked as paid | Make sure the Stripe webhook is set up and `STRIPE_WEBHOOK_SECRET` is correct |
| Sidebar not showing on mobile | Tap the ☰ icon in the top-left corner below the navbar |
