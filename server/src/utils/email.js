import nodemailer from "nodemailer";

// Base transporter using Gmail + App Password from .env
const emailUser = process.env.EMAIL_USER || "bakebuddy.notifications@gmail.com";
const emailPass = process.env.EMAIL_PASS || "kyuuejfbazisyfqj";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

/**
 * Send a beautiful, on-brand welcome email to new BakeBuddy customers.
 */
export async function sendWelcomeEmail(to, name) {
  if (!to) return;

  const appUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const loginLink = `${appUrl}/login`;
  const safeName =
    name && String(name).trim().length > 0 ? String(name).trim() : "BakeBuddy friend";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your BakeBuddy account is ready</title>
      </head>
      <body style="margin:0; padding:0; background-color:#fff7f0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fff7f0; padding:24px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(0,0,0,0.06);">
                <tr>
                  <td style="padding:18px 24px; background:linear-gradient(135deg,#ffb199,#ff8ba7); color:#ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="left" style="font-size:20px; font-weight:700;">
                          <span style="font-size:22px;">🍰</span>
                          <span style="margin-left:6px;">BakeBuddy</span>
                        </td>
                        <td align="right" style="font-size:12px; opacity:0.9;">
                          Fresh bakes, sweet vibes.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=260"
                      alt="Fresh bakery display"
                      width="600"
                      style="display:block; width:100%; max-height:260px; object-fit:cover;"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 24px 8px 24px;">
                    <h1 style="margin:0 0 8px 0; font-size:22px; color:#222;">
                      Your BakeBuddy account is ready, ${safeName}! 🧁
                    </h1>
                    <p style="margin:0 0 10px 0; font-size:14px; color:#555;">
                      Welcome to <strong>BakeBuddy</strong>. Your account has been created successfully.
                    </p>
                    <p style="margin:0 0 14px 0; font-size:14px; color:#555;">
                      You can now log in, explore the menu, add your favourite treats to the cart and place an order in just a few clicks.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 20px 0;">
                      <tr>
                        <td align="center">
                          <a
                            href="${loginLink}"
                            style="
                              display:inline-block;
                              padding:12px 26px;
                              background:linear-gradient(135deg,#ff8ba7,#ff9b73);
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:999px;
                              font-size:14px;
                              font-weight:600;
                              box-shadow:0 8px 20px rgba(255,139,167,0.45);
                            "
                          >
                            Open BakeBuddy &amp; Log In
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 12px 0; font-size:13px; color:#777;">
                      If the button doesn’t work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:0 0 18px 0; font-size:12px; color:#555; word-break:break-all;">
                      <a href="${loginLink}" style="color:#ff8ba7; text-decoration:none;">
                        ${loginLink}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 20px 24px; border-top:1px solid #f3e2d8; background:#fffaf5;">
                    <p style="margin:0 0 4px 0; font-size:12px; color:#999;">
                      You received this email because you created an account on BakeBuddy.
                    </p>
                    <p style="margin:0; font-size:11px; color:#bbb;">
                      BakeBuddy · Campus Bakery Ordering System · For demo/academic use.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || emailUser,
    to,
    subject: "Your BakeBuddy account is ready 🍰",
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Welcome email sent to ${to}`);
}

/**
 * Send an email when a customer places an order.
 * Includes total items and a link back to the app.
 */
export async function sendOrderPlacedEmail(to, order) {
  if (!order) return;

  const targetEmail =
    to ||
    order.customerEmail ||
    order.email;

  if (!targetEmail) {
    console.warn("🚫 sendOrderPlacedEmail called without a valid email");
    return;
  }

  const appUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const safeName =
    order.customerName && order.customerName.trim().length > 0
      ? order.customerName.trim()
      : "BakeBuddy friend";
  const totalItems = order.totalItems || 0;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your BakeBuddy order is placed</title>
      </head>
      <body style="margin:0; padding:0; background-color:#fff7f0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fff7f0; padding:24px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(0,0,0,0.06);">
                <tr>
                  <td style="padding:18px 24px; background:linear-gradient(135deg,#ffb199,#ff8ba7); color:#ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="left" style="font-size:20px; font-weight:700;">
                          <span style="font-size:22px;">🍰</span>
                          <span style="margin-left:6px;">BakeBuddy</span>
                        </td>
                        <td align="right" style="font-size:12px; opacity:0.9;">
                          Fresh bakes, sweet vibes.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=260"
                      alt="Fresh bakery display"
                      width="600"
                      style="display:block; width:100%; max-height:260px; object-fit:cover;"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 24px 8px 24px;">
                    <h1 style="margin:0 0 8px 0; font-size:22px; color:#222;">
                      Order placed successfully 🧺
                    </h1>
                    <p style="margin:0 0 10px 0; font-size:14px; color:#555;">
                      Hi ${safeName}, your BakeBuddy order has been received.
                    </p>
                    <p style="margin:0 0 12px 0; font-size:14px; color:#555;">
                      <strong>Total items:</strong> ${totalItems}<br />
                      <strong>Current status:</strong> Pending
                    </p>
                    <p style="margin:0 0 14px 0; font-size:14px; color:#555;">
                      You can track this order any time from the <strong>My Orders</strong> section inside BakeBuddy.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 20px 0;">
                      <tr>
                        <td align="center">
                          <a
                            href="${appUrl}"
                            style="
                              display:inline-block;
                              padding:12px 26px;
                              background:linear-gradient(135deg,#ff8ba7,#ff9b73);
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:999px;
                              font-size:14px;
                              font-weight:600;
                              box-shadow:0 8px 20px rgba(255,139,167,0.45);
                            "
                          >
                            Open BakeBuddy
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 12px 0; font-size:13px; color:#777;">
                      We’ll email you again when your order status changes.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 20px 24px; border-top:1px solid #f3e2d8; background:#fffaf5;">
                    <p style="margin:0 0 4px 0; font-size:12px; color:#999;">
                      You received this email because you placed an order on BakeBuddy.
                    </p>
                    <p style="margin:0; font-size:11px; color:#bbb;">
                      BakeBuddy · Campus Bakery Ordering System · For demo/academic use.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || emailUser,
    to: targetEmail,
    subject: "Your BakeBuddy order has been placed 🧺",
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Order placed email sent to ${targetEmail}`);
}

/**
 * Send an email whenever the admin updates the order status.
 * If the status is 'ready' or 'completed', the messaging is a bit more celebratory.
 */
export async function sendOrderStatusEmail(to, order) {
  if (!order) return;

  const targetEmail =
    to ||
    order.customerEmail ||
    order.email;

  if (!targetEmail) {
    console.warn("🚫 sendOrderStatusEmail called without a valid email");
    return;
  }

  const appUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const safeName =
    order.customerName && order.customerName.trim().length > 0
      ? order.customerName.trim()
      : "BakeBuddy friend";
  const totalItems = order.totalItems || 0;
  const status = (order.status || "").toLowerCase();

  const isReadyOrCompleted = status === "ready" || status === "completed";
  const statusLabel = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Updated";

  const highlightText = isReadyOrCompleted
    ? "Your order is ready to pick up or enjoy! 🎉"
    : "Your order status has been updated by our team.";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your BakeBuddy order status has changed</title>
      </head>
      <body style="margin:0; padding:0; background-color:#fff7f0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fff7f0; padding:24px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(0,0,0,0.06);">
                <tr>
                  <td style="padding:18px 24px; background:linear-gradient(135deg,#ffb199,#ff8ba7); color:#ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="left" style="font-size:20px; font-weight:700;">
                          <span style="font-size:22px;">🍰</span>
                          <span style="margin-left:6px;">BakeBuddy</span>
                        </td>
                        <td align="right" style="font-size:12px; opacity:0.9;">
                          Fresh bakes, sweet vibes.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=260"
                      alt="Fresh bakery display"
                      width="600"
                      style="display:block; width:100%; max-height:260px; object-fit:cover;"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 24px 8px 24px;">
                    <h1 style="margin:0 0 8px 0; font-size:22px; color:#222;">
                      Order status updated 📦
                    </h1>
                    <p style="margin:0 0 10px 0; font-size:14px; color:#555;">
                      Hi ${safeName}, there is an update on your BakeBuddy order.
                    </p>
                    <p style="margin:0 0 12px 0; font-size:14px; color:#555;">
                      <strong>Current status:</strong>
                      <span style="display:inline-block; padding:4px 10px; border-radius:999px; background:${isReadyOrCompleted ? "#d1f2d5" : "#ffe6ef"}; color:${isReadyOrCompleted ? "#1e7b34" : "#c0394d"}; font-size:12px; font-weight:600; margin-left:4px;">
                        ${statusLabel}
                      </span>
                    </p>
                    <p style="margin:0 0 10px 0; font-size:14px; color:#555;">
                      <strong>Total items:</strong> ${totalItems}
                    </p>
                    <p style="margin:0 0 14px 0; font-size:14px; color:#555;">
                      ${highlightText}
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 20px 0;">
                      <tr>
                        <td align="center">
                          <a
                            href="${appUrl}"
                            style="
                              display:inline-block;
                              padding:12px 26px;
                              background:linear-gradient(135deg,#ff8ba7,#ff9b73);
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:999px;
                              font-size:14px;
                              font-weight:600;
                              box-shadow:0 8px 20px rgba(255,139,167,0.45);
                            "
                          >
                            View My Orders
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 12px 0; font-size:13px; color:#777;">
                      Thank you for ordering with BakeBuddy. We appreciate you!
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 20px 24px; border-top:1px solid #f3e2d8; background:#fffaf5;">
                    <p style="margin:0 0 4px 0; font-size:12px; color:#999;">
                      You received this email because the status of your BakeBuddy order changed.
                    </p>
                    <p style="margin:0; font-size:11px; color:#bbb;">
                      BakeBuddy · Campus Bakery Ordering System · For demo/academic use.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || emailUser,
    to: targetEmail,
    subject: isReadyOrCompleted
      ? "Your BakeBuddy order is ready 🎉"
      : "Your BakeBuddy order status was updated",
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📦 Order status email sent to ${targetEmail} (status: ${statusLabel})`);
}
