import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/validation';
import { db } from '@/lib/db';

// Input validation limits (BUG-NEW-005 fix)
const MAX_NAME_LENGTH = 100;
const MAX_COMPANY_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 5000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, projectType, budget, timeline, description } = body;

    // Validate required fields
    if (!name || !email || !projectType || !budget || !timeline || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate field lengths (BUG-NEW-005 fix)
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be ${MAX_NAME_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (company && company.length > MAX_COMPANY_LENGTH) {
      return NextResponse.json(
        { error: `Company name must be ${MAX_COMPANY_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    // Validate email format
    const validatedEmail = validateEmail(email);
    if (!validatedEmail) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Save inquiry to database (BUG-NEW-002 fix)
    const inquiry = await db.inquiry.create({
      data: {
        name: name.trim(),
        email: validatedEmail,
        company: company?.trim() || null,
        projectType,
        budget,
        timeline,
        description: description.trim(),
        status: 'new',
      },
    });

    // TODO: Send email notification to admin
    // Consider using Resend, SendGrid, or AWS SES
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `New Project Inquiry: ${projectType}`,
    //   template: 'inquiry-notification',
    //   data: { inquiry }
    // });

    // Log for immediate visibility (until email service is set up)
    console.log('New inquiry saved:', {
      id: inquiry.id,
      email: validatedEmail,
      projectType,
      timestamp: inquiry.createdAt.toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry.id
      },
      { status: 201 }
    );
  } catch (error) {
    // Sanitized error logging (BUG-NEW-009 fix)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing inquiry:', { errorMessage });

    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
