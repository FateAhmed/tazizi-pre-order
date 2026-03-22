import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });
}

interface OrderConfirmationParams {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: { productName: string; quantity: number; unitPrice: number; date: string }[];
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  locationName: string;
}

export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  const transporter = getTransporter();
  const appUrl = process.env.APP_URL || "https://pre-order-five.vercel.app";

  const itemRows = params.items
    .map(
      (i) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f5f5f5">
          <div style="flex:1">
            <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a">${i.productName}</p>
            <p style="margin:3px 0 0;font-size:12px;color:#999">${i.date} &middot; Qty: ${i.quantity}</p>
          </div>
          <span style="font-size:14px;font-weight:600;color:#1a1a1a;margin-left:12px">AED ${(i.unitPrice * i.quantity).toFixed(2)}</span>
        </div>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:520px;margin:0 auto;padding:24px 16px">

  <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">

    <div style="background:#1a1a1a;padding:36px 28px 32px;text-align:center">
      <img src="${appUrl}/tazizi-logo.svg" alt="Tazizi" width="120" style="margin-bottom:24px" />
      <div style="width:40px;height:2px;background:#CDDB67;margin:0 auto 20px;border-radius:1px"></div>
      <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:600;letter-spacing:0.5px">YOUR ORDER IS CONFIRMED</h1>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:0.5px">${params.orderNumber}</p>
    </div>

    <div style="padding:28px 28px 0">
      <p style="margin:0;font-size:15px;color:#444;line-height:1.6">
        Hi <strong style="color:#1a1a1a">${params.customerName}</strong>, your meals are being prepared. Here&rsquo;s your order summary.
      </p>
    </div>

    <div style="padding:20px 28px">
      <div style="background:#f8f8f1;border-radius:14px;padding:16px 20px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;font-weight:600">Pickup from</p>
        <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#1a1a1a">${params.locationName}</p>
      </div>
    </div>

    <div style="padding:0 28px"><div style="border-top:1px solid #f0f0f0"></div></div>

    <div style="padding:20px 28px">
      <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;font-weight:700">Your meals</p>
      ${itemRows}
    </div>

    <div style="padding:0 28px"><div style="border-top:1px solid #f0f0f0"></div></div>

    <div style="padding:20px 28px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;color:#999">Subtotal</span>
        <span style="font-size:13px;color:#1a1a1a">AED ${params.subtotal.toFixed(2)}</span>
      </div>
      ${params.discountAmount > 0 ? `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;color:#8BA53E;font-weight:600">Discount</span>
        <span style="font-size:13px;color:#8BA53E;font-weight:600">-AED ${params.discountAmount.toFixed(2)}</span>
      </div>` : ""}
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:#999">VAT (5% included)</span>
        <span style="font-size:13px;color:#1a1a1a">AED ${params.vatAmount.toFixed(2)}</span>
      </div>
      <div style="border-top:2px solid #1a1a1a;padding-top:12px;display:flex;justify-content:space-between">
        <span style="font-size:17px;font-weight:800;color:#1a1a1a">Total Paid</span>
        <span style="font-size:17px;font-weight:800;color:#1a1a1a">AED ${params.totalAmount.toFixed(2)}</span>
      </div>
    </div>

    <div style="padding:0 28px"><div style="border-top:1px solid #f0f0f0"></div></div>

    <div style="padding:24px 28px 28px">
      <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#999;font-weight:700">What&rsquo;s next</p>

      <div style="display:flex;align-items:flex-start;margin-bottom:14px">
        <div style="width:28px;height:28px;background:#f8f8f1;border-radius:8px;text-align:center;line-height:28px;margin-right:12px;flex-shrink:0">
          <span style="font-size:13px">&#127859;</span>
        </div>
        <div>
          <p style="margin:0;font-size:13px;font-weight:600;color:#1a1a1a">Freshly prepared</p>
          <p style="margin:2px 0 0;font-size:12px;color:#999">Your meals will be made fresh for each pickup date</p>
        </div>
      </div>

      <div style="display:flex;align-items:flex-start;margin-bottom:14px">
        <div style="width:28px;height:28px;background:#f8f8f1;border-radius:8px;text-align:center;line-height:28px;margin-right:12px;flex-shrink:0">
          <span style="font-size:13px">&#128205;</span>
        </div>
        <div>
          <p style="margin:0;font-size:13px;font-weight:600;color:#1a1a1a">Grab from your fridge</p>
          <p style="margin:2px 0 0;font-size:12px;color:#999">Your meals will be stocked at ${params.locationName}</p>
        </div>
      </div>

      <div style="display:flex;align-items:flex-start">
        <div style="width:28px;height:28px;background:#f8f8f1;border-radius:8px;text-align:center;line-height:28px;margin-right:12px;flex-shrink:0">
          <span style="font-size:13px">&#127991;</span>
        </div>
        <div>
          <p style="margin:0;font-size:13px;font-weight:600;color:#1a1a1a">Look for your label</p>
          <p style="margin:2px 0 0;font-size:12px;color:#999">Each meal is labelled <strong>${params.customerName}</strong> — just grab and go</p>
        </div>
      </div>
    </div>
  </div>

  <div style="text-align:center;padding:28px 0 16px">
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1a1a1a">Tazizi</p>
    <p style="margin:0;font-size:12px;color:#999">Healthy. Fresh. Fast.</p>
    <p style="margin:12px 0 0;font-size:11px;color:#ccc">Questions? Reply to this email or reach us at hello@tazizi.ae</p>
  </div>

</div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: '"Tazizi" <hello@tazizi.ae>',
    to: params.customerEmail,
    subject: `Order Confirmed — ${params.orderNumber}`,
    html,
  });
}
