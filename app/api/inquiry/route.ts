import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Implement email sending logic
    // For now, just log the inquiry
    console.log('Project Inquiry:', {
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
      description,
      timestamp: new Date().toISOString(),
    });

    // In production, you would send an email here using a service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Postmark
    // etc.

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
