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
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e8e4;font-size:14px;color:#1C382C;font-weight:600">${i.productName}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e8e4;font-size:13px;color:#666;text-align:center">${i.date}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e8e4;font-size:13px;color:#666;text-align:center">${i.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e8e4;font-size:14px;color:#1C382C;font-weight:600;text-align:right">AED ${(i.unitPrice * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff">
<tr><td align="center" style="padding:24px 16px">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

  <!-- Header -->
  <tr><td style="background:#1C382C;padding:36px 28px 32px;text-align:center;border-radius:20px 20px 0 0">
    <img src="${appUrl}/tazizi-logo.svg" alt="Tazizi" width="130" style="margin-bottom:24px;filter:brightness(0) invert(1)" />
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><div style="width:40px;height:2px;background:#BED13A;border-radius:1px"></div></td></tr></table>
    <h1 style="margin:20px 0 0;font-size:20px;color:#ffffff;font-weight:600;letter-spacing:0.5px">YOUR ORDER IS CONFIRMED</h1>
    <p style="margin:10px 0 0;color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:0.5px">${params.orderNumber}</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:0;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0">

    <!-- Greeting -->
    <div style="padding:28px 28px 0">
      <p style="margin:0;font-size:15px;color:#444;line-height:1.6">
        Hi <strong style="color:#1C382C">${params.customerName}</strong>, your meals are being prepared. Here's your order summary.
      </p>
    </div>

    <!-- Pickup Location -->
    <div style="padding:20px 28px">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FEC2;border-radius:14px"><tr><td style="padding:16px 20px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#099358;font-weight:700">Delivery Location</p>
        <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#1C382C">${params.locationName} Fridge</p>
      </td></tr></table>
    </div>

    <div style="padding:0 28px"><div style="border-top:1px solid #f0f0f0"></div></div>

    <!-- Items -->
    <div style="padding:20px 28px">
      <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#099358;font-weight:700">Your meals</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <thead>
          <tr>
            <th style="padding:8px 0;text-align:left;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #1C382C">Item</th>
            <th style="padding:8px 0;text-align:center;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #1C382C">Date</th>
            <th style="padding:8px 0;text-align:center;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #1C382C">Qty</th>
            <th style="padding:8px 0;text-align:right;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #1C382C">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>

    <div style="padding:0 28px"><div style="border-top:1px solid #f0f0f0"></div></div>

    <!-- Totals -->
    <div style="padding:20px 28px">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#999">Subtotal</td>
          <td style="padding:4px 0;font-size:13px;color:#1C382C;text-align:right">AED ${params.subtotal.toFixed(2)}</td>
        </tr>
        ${params.discountAmount > 0 ? `
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#099358;font-weight:600">Discount</td>
          <td style="padding:4px 0;font-size:13px;color:#099358;font-weight:600;text-align:right">-AED ${params.discountAmount.toFixed(2)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#999">VAT (5% included)</td>
          <td style="padding:4px 0;font-size:13px;color:#1C382C;text-align:right">AED ${params.vatAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:12px 0 0"><div style="border-top:2px solid #1C382C"></div></td>
        </tr>
        <tr>
          <td style="padding:12px 0 0;font-size:17px;font-weight:800;color:#1C382C">Total Paid</td>
          <td style="padding:12px 0 0;font-size:17px;font-weight:800;color:#1C382C;text-align:right">AED ${params.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="padding:0 28px"><div style="border-top:1px solid #f0f0f0"></div></div>

    <!-- What's Next -->
    <div style="padding:24px 28px 28px">
      <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#099358;font-weight:700">What's next</p>
      <p style="margin:0 0 10px;font-size:13px;color:#1C382C"><strong>1.</strong> Your meals will be freshly prepared for each pickup date</p>
      <p style="margin:0 0 10px;font-size:13px;color:#1C382C"><strong>2.</strong> Grab from <strong>${params.locationName} Fridge</strong></p>
      <p style="margin:0;font-size:13px;color:#1C382C"><strong>3.</strong> Look for the label with your name: <strong>${params.customerName}</strong></p>
    </div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#1C382C;padding:24px 28px;text-align:center;border-radius:0 0 20px 20px">
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#ffffff">Tazizi</p>
    <p style="margin:0 0 12px;font-size:12px;color:rgba(255,255,255,0.5)">Where Fresh Meets Fast</p>
    <a href="https://instagram.com/tazizi.ae" style="font-size:12px;color:#BED13A;text-decoration:none;font-weight:600">Follow us @tazizi.ae</a>
    <p style="margin:12px 0 0;font-size:11px;color:rgba(255,255,255,0.3)">Questions? Reply to this email or reach us at hello@tazizi.ae</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from: '"Tazizi" <hello@tazizi.ae>',
    to: params.customerEmail,
    subject: `Tazizi — Order Confirmed — ${params.orderNumber}`,
    html,
  });
}
