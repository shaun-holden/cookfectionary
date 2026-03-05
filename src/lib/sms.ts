export async function sendSMS(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  if (!sid || !sid.startsWith("AC")) return;
  const twilio = (await import("twilio")).default;
  const client = twilio(sid, process.env.TWILIO_AUTH_TOKEN);
  const FROM = process.env.TWILIO_PHONE_NUMBER!;
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
