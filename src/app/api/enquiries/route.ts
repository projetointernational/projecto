import { NextRequest, NextResponse } from 'next/server';
import { createAdminServiceClient } from '@/lib/supabase/server';
import { sendEnquiryEmailNotification } from '@/lib/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service_type, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Client name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Enquiry message is required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminServiceClient();

    // Insert enquiry into Supabase
    const { data: enquiry, error: dbError } = await supabase
      .from('enquiries')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
          service_type: service_type ? service_type.trim() : null,
          message: message.trim(),
          status: 'new',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('[Enquiries API] Database insertion failed:', dbError);
      // Even if placeholder credentials or DB table error, provide helpful response
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to register enquiry in database. Please verify Supabase credentials.',
          details: dbError.message,
        },
        { status: 500 }
      );
    }

    // Fetch site_settings to obtain admin notification email and company name
    let adminEmail: string | undefined = undefined;
    let companyName: string | undefined = undefined;

    try {
      const { data: settings } = await supabase
        .from('site_settings')
        .select('enquiry_notification_email, email, company_name')
        .limit(1)
        .maybeSingle();

      if (settings?.enquiry_notification_email) {
        adminEmail = settings.enquiry_notification_email;
      } else if (settings?.email) {
        adminEmail = settings.email;
      }

      if (settings?.company_name) {
        companyName = settings.company_name;
      }
    } catch (settingsErr) {
      console.warn('[Enquiries API] Could not retrieve site_settings for email:', settingsErr);
    }

    // Trigger Brevo transactional email notifications (Admin side & Client side)
    try {
      await sendEnquiryEmailNotification({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        serviceType: enquiry.service_type,
        message: enquiry.message,
        enquiryId: enquiry.id,
        adminEmail,
        companyName,
      });
    } catch (emailErr) {
      console.error('[Enquiries API] Email notification failed:', emailErr);
      // Non-blocking: record is saved in DB even if Brevo notification encounters an issue
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry received successfully.',
      enquiryId: enquiry.id,
    });
  } catch (err) {
    console.error('[Enquiries API] Unexpected exception:', err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
