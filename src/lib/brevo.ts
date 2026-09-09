export interface SendEnquiryNotificationParams {
  name: string;
  email: string;
  phone?: string | null;
  serviceType?: string | null;
  message: string;
  enquiryId: string;
  adminEmail?: string | null;
  companyName?: string | null;
}

export interface BrevoDispatchResult {
  success: boolean;
  adminSent?: boolean;
  clientSent?: boolean;
  message?: string;
}

async function sendBrevoRawEmail(apiKey: string, payload: {
  sender: { name: string; email: string };
  to: { email: string; name?: string }[];
  replyTo?: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}): Promise<{ ok: boolean; status: number; errorText?: string }> {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, status: response.status, errorText };
    }

    return { ok: true, status: response.status };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      errorText: err instanceof Error ? err.message : 'Network error connecting to Brevo',
    };
  }
}

/**
 * Dispatches dual Brevo transactional emails for an enquiry submission:
 * 1. Admin notification email with full client enquiry details
 * 2. Client confirmation email acknowledging receipt of the architectural enquiry
 */
export async function sendEnquiryEmailNotification(
  params: SendEnquiryNotificationParams
): Promise<BrevoDispatchResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || 'notifications@projecto.com';
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Projecto Enquiries';
  const adminEmail =
    params.adminEmail?.trim() ||
    process.env.NOTIFICATION_RECEIVER_EMAIL?.trim() ||
    'enquiries@projecto.com';
  const companyName = params.companyName?.trim() || 'Projecto';

  if (!apiKey || apiKey === 'placeholder-brevo-key') {
    console.warn(
      '[Brevo] API key not configured or using placeholder. Skipping live email dispatch for admin and client.'
    );
    return {
      success: true,
      adminSent: false,
      clientSent: false,
      message: 'Email skipped: Brevo API key is not configured.',
    };
  }

  // 1. HTML Template for Admin Notification
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Montserrat', Helvetica, Arial, sans-serif;
            background-color: #F7F5EF;
            color: #151512;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #FFFFFF;
            padding: 40px;
            border: 1px solid #EFECE2;
            border-radius: 2px;
          }
          .header {
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid #EFECE2;
          }
          .badge {
            display: inline-block;
            background-color: #5A5B33;
            color: #FFFFFF;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            padding: 4px 10px;
            border-radius: 2px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          h1 {
            font-family: 'Georgia', serif;
            font-size: 22px;
            font-weight: normal;
            color: #151512;
            margin: 0;
          }
          .detail-row {
            margin: 16px 0;
            line-height: 1.5;
          }
          .detail-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #77766E;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .detail-value {
            font-size: 14px;
            color: #151512;
            font-weight: 500;
          }
          .detail-value a {
            color: #5A5B33;
            text-decoration: none;
          }
          .message-box {
            background-color: #F7F5EF;
            padding: 18px 20px;
            margin-top: 20px;
            border-radius: 2px;
            font-size: 13px;
            line-height: 1.7;
            color: #151512;
            white-space: pre-wrap;
            border-left: 3px solid #5A5B33;
          }
          .footer {
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px solid #EFECE2;
            font-size: 11px;
            color: #77766E;
            text-align: center;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">New Client Brief</span>
            <h1>New Architectural Enquiry Received</h1>
          </div>

          <div class="detail-row">
            <div class="detail-label">Client Name</div>
            <div class="detail-value">${params.name}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Email Address</div>
            <div class="detail-value"><a href="mailto:${params.email}">${params.email}</a></div>
          </div>

          ${
            params.phone
              ? `
          <div class="detail-row">
            <div class="detail-label">Telephone</div>
            <div class="detail-value"><a href="tel:${params.phone}">${params.phone}</a></div>
          </div>`
              : ''
          }

          <div class="detail-row">
            <div class="detail-label">Project / Service Scope</div>
            <div class="detail-value">${params.serviceType || 'General Architectural Consultation'}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Project Brief / Enquiry Details</div>
            <div class="message-box">${params.message}</div>
          </div>

          <div class="footer">
            Enquiry Reference ID: <strong>${params.enquiryId}</strong><br>
            Submitted via ${companyName} Web Portal &bull; Manage in Admin Dashboard
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. HTML Template for Client Confirmation
  const clientHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Montserrat', Helvetica, Arial, sans-serif;
            background-color: #F7F5EF;
            color: #151512;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #FFFFFF;
            padding: 40px;
            border: 1px solid #EFECE2;
            border-radius: 2px;
          }
          .header {
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid #EFECE2;
          }
          .badge {
            display: inline-block;
            background-color: #5A5B33;
            color: #FFFFFF;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            padding: 4px 10px;
            border-radius: 2px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          h1 {
            font-family: 'Georgia', serif;
            font-size: 22px;
            font-weight: normal;
            color: #151512;
            margin: 0;
          }
          p {
            font-size: 14px;
            line-height: 1.7;
            color: #333333;
            margin: 16px 0;
          }
          .summary-card {
            background-color: #F7F5EF;
            padding: 20px;
            margin: 24px 0;
            border-radius: 2px;
            border-left: 3px solid #5A5B33;
          }
          .summary-item {
            margin: 10px 0;
            font-size: 13px;
          }
          .summary-label {
            font-weight: 600;
            color: #77766E;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.1em;
            display: block;
            margin-bottom: 2px;
          }
          .summary-value {
            color: #151512;
            font-size: 13px;
          }
          .footer {
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px solid #EFECE2;
            font-size: 11px;
            color: #77766E;
            text-align: center;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Enquiry Confirmation</span>
            <h1>${companyName}</h1>
          </div>

          <p>Dear ${params.name},</p>

          <p>
            Thank you for contacting ${companyName}. We have successfully received your architectural enquiry, and our senior estimating and structural engineering directors are currently reviewing your brief.
          </p>

          <div class="summary-card">
            <div class="summary-item">
              <span class="summary-label">Reference ID</span>
              <span class="summary-value"><strong>${params.enquiryId}</strong></span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Service Scope</span>
              <span class="summary-value">${params.serviceType || 'General Consultation'}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Brief Submitted</span>
              <span class="summary-value" style="white-space: pre-wrap;">${params.message}</span>
            </div>
          </div>

          <p>
            A dedicated project consultant will reach out to you within 24 business hours to discuss feasibility, site evaluation, or initial project modeling.
          </p>

          <p>
            If you need to add blueprints or urgent notes to your enquiry, please reply directly to this email.
          </p>

          <p style="margin-top: 28px;">
            Warm regards,<br>
            <strong>The ${companyName} Team</strong>
          </p>

          <div class="footer">
            ${companyName} Architectural Construction &bull; All Rights Reserved
          </div>
        </div>
      </body>
    </html>
  `;

  // 3. Dispatch both emails in parallel via Promise.allSettled
  const [adminResult, clientResult] = await Promise.allSettled([
    // Admin email dispatch
    sendBrevoRawEmail(apiKey, {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: adminEmail, name: `${companyName} Team` }],
      replyTo: { email: params.email, name: params.name },
      subject: `New Architectural Enquiry: ${params.name} — ${params.serviceType || 'General Consultation'}`,
      htmlContent: adminHtml,
    }),

    // Client confirmation email dispatch
    sendBrevoRawEmail(apiKey, {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: params.email, name: params.name }],
      replyTo: { email: adminEmail, name: companyName },
      subject: `Thank you for your enquiry | ${companyName}`,
      htmlContent: clientHtml,
    }),
  ]);

  const adminOk = adminResult.status === 'fulfilled' && adminResult.value.ok;
  const clientOk = clientResult.status === 'fulfilled' && clientResult.value.ok;

  if (!adminOk) {
    const err = adminResult.status === 'fulfilled' ? adminResult.value.errorText : adminResult.reason;
    console.error('[Brevo] Admin email dispatch failed:', err);
  }

  if (!clientOk) {
    const err = clientResult.status === 'fulfilled' ? clientResult.value.errorText : clientResult.reason;
    console.error('[Brevo] Client confirmation email dispatch failed:', err);
  }

  return {
    success: adminOk || clientOk,
    adminSent: adminOk,
    clientSent: clientOk,
  };
}
