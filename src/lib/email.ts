import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "Cookfectionary <noreply@cookfectionary.com>";

export async function sendOrderConfirmationEmail(to: string, name: string, orderId: string, total: number) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Order Confirmed — Cookfectionary",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#f97316">Cookfectionary</h2>
        <h3>Hi ${name}, your order is confirmed! 🎉</h3>
        <p>Order #${orderId.slice(-8).toUpperCase()} has been received and is being reviewed.</p>
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
        <p>We'll be in touch shortly to confirm details. You can also message us directly through the app.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px">View Order</a>
        <p style="color:#888;margin-top:24px;font-size:13px">Cookfectionary — Where Every Bite Tells a Story</p>
      </div>
    `,
  });
}

export async function sendInvoiceEmail(to: string, name: string, invoiceId: string, amount: number, stripeUrl: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Invoice Ready — Cookfectionary",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#f97316">Cookfectionary</h2>
        <h3>Hi ${name}, your invoice is ready.</h3>
        <p>Invoice #${invoiceId.slice(-8).toUpperCase()} for <strong>$${amount.toFixed(2)}</strong> is now available.</p>
        <a href="${stripeUrl}" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px">Pay Now</a>
        <p style="color:#888;margin-top:24px;font-size:13px">Cookfectionary — Where Every Bite Tells a Story</p>
      </div>
    `,
  });
}

export async function sendNewMessageEmail(to: string, name: string, preview: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "New Message — Cookfectionary",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#f97316">Cookfectionary</h2>
        <h3>Hi ${name}, you have a new message.</h3>
        <blockquote style="border-left:4px solid #f97316;padding-left:12px;color:#555">${preview}</blockquote>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/messages" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px">Reply</a>
        <p style="color:#888;margin-top:24px;font-size:13px">Cookfectionary — Where Every Bite Tells a Story</p>
      </div>
    `,
  });
}
