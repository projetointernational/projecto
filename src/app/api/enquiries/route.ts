import { NextRequest, NextResponse } from 'next/server';
import { createAdminServiceClient } from '@/lib/supabase/server';
import { sendEnquiryEmailNotification } from '@/lib/brevo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      location,
      project_type,
      required_support,
      project_stage,
      service_type,
      contact_method,
      file_url,
      message,
    } = body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Client name is required.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const effectiveEmail = email && email.includes('@') ? email.trim().toLowerCase() : 'no-email-provided@client.com';
    const effectiveSupport = required_support || service_type || 'General Project Support';

    // Compile comprehensive notes for the admin inbox & email
    const structuredNotes = [
      company ? `Company: ${company}` : null,
      location ? `Project Location: ${location}` : null,
      project_type ? `Project Type: ${project_type}` : null,
      required_support ? `Required Support: ${required_support}` : null,
      project_stage ? `Project Stage: ${project_stage}` : null,
      contact_method ? `Preferred Contact Method: ${contact_method}` : null,
      file_url ? `Uploaded BOQ / Drawings: ${file_url}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const formattedMessage = [
      message?.trim() ? `Requirement / Message:\n${message.trim()}` : '',
      structuredNotes ? `\n--- Project Scope Details ---\n${structuredNotes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const supabase = createAdminServiceClient();

    // Insert enquiry into Supabase
    const { data: enquiry, error: dbError } = await supabase
      .from('enquiries')
      .insert([
        {
          name: name.trim(),
          email: effectiveEmail,
          phone: phone ? phone.trim() : null,
          service_type: effectiveSupport,
          message: formattedMessage || 'Project enquiry submitted.',
          notes: structuredNotes || null,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('[Enquiries API] Database insertion failed:', dbError);
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

    // Trigger Brevo transactional email notification if configured
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
      console.error('[Enquiries API] Email notification non-fatal notice:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Project enquiry submitted successfully.',
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
