import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const FROM = process.env.TWILIO_PHONE_NUMBER!;

export async function sendSMS(to: string, body: string) {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.startsWith("AC_")) return;
  try {
    await client.messages.create({ from: FROM, to, body });
  } catch (err) {
    console.error("SMS error:", err);
  }
}

export async function sendOrderConfirmationSMS(to: string, orderId: string) {
  await sendSMS(to, `Cookfectionary: Your order #${orderId.slice(-8).toUpperCase()} has been confirmed! We'll contact you shortly. Reply STOP to opt out.`);
}

export async function sendInvoiceSMS(to: string, amount: number) {
  await sendSMS(to, `Cookfectionary: Your invoice for $${amount.toFixed(2)} is ready. Check your email to pay. Reply STOP to opt out.`);
}
