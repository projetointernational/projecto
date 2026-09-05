interface SendEnquiryNotificationParams {
  name: string;
  email: string;
  phone?: string | null;
  serviceType?: string | null;
  message: string;
  enquiryId: string;
}

export async function sendEnquiryEmailNotification(params: SendEnquiryNotificationParams): Promise<{ success: boolean; message?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'notifications@projecto.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Projecto Enquiries';
  const receiverEmail = process.env.NOTIFICATION_RECEIVER_EMAIL || 'enquiries@projecto.com';

  if (!apiKey || apiKey === 'placeholder-brevo-key') {
    console.warn('[Brevo] API key not configured or using placeholder. Skipping live email dispatch.');
    return { success: true, message: 'Email skipped: Brevo API key is not configured.' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
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
            border-radius: 2px;
          }
          .header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #EFECE2;
          }
          .badge {
            display: inline-block;
            background-color: #5A5B33;
            color: #FFFFFF;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 4px 10px;
            border-radius: 2px;
            margin-bottom: 12px;
          }
          h1 {
            font-family: 'Georgia', serif;
            font-size: 24px;
            font-weight: 400;
            color: #151512;
            margin: 0;
          }
          .detail-row {
            margin: 16px 0;
            line-height: 1.6;
          }
          .detail-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #77766E;
            margin-bottom: 4px;
          }
          .detail-value {
            font-size: 15px;
            color: #151512;
            font-weight: 500;
          }
          .message-box {
            background-color: #F7F5EF;
            padding: 20px;
            margin-top: 24px;
            border-radius: 2px;
            font-size: 14px;
            line-height: 1.7;
            color: #151512;
            white-space: pre-wrap;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #EFECE2;
            font-size: 12px;
            color: #77766E;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">New Enquiry</span>
            <h1>Projecto Construction</h1>
          </div>
          <div class="detail-row">
            <div class="detail-label">Client Name</div>
            <div class="detail-value">${params.name}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Email Address</div>
            <div class="detail-value"><a href="mailto:${params.email}">${params.email}</a></div>
          </div>
          ${params.phone ? `
          <div class="detail-row">
            <div class="detail-label">Telephone</div>
            <div class="detail-value"><a href="tel:${params.phone}">${params.phone}</a></div>
          </div>` : ''}
          ${params.serviceType ? `
          <div class="detail-row">
            <div class="detail-label">Project / Service Scope</div>
            <div class="detail-value">${params.serviceType}</div>
          </div>` : ''}
          <div class="detail-row">
            <div class="detail-label">Project Brief / Message</div>
            <div class="message-box">${params.message}</div>
          </div>
          <div class="footer">
            Enquiry Reference ID: ${params.enquiryId} &bull; Manage in Projecto Admin
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: receiverEmail, name: 'Projecto Estimations Team' }],
        replyTo: { email: params.email, name: params.name },
        subject: `New Project Enquiry: ${params.name} — ${params.serviceType || 'General Consultation'}`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Brevo] Error response:', response.status, errText);
      return { success: false, message: `Brevo error: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    console.error('[Brevo] Request failed:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown Brevo error' };
  }
}
