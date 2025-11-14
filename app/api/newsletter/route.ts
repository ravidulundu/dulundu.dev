import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/validation';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp, inquiryRateLimiter } from '@/lib/rate-limit';

// Input validation limits
const MAX_EMAIL_LENGTH = 255;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting protection
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(
      `newsletter:${clientIp}`,
      inquiryRateLimiter,
      5 // 5 requests per minute
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email length
    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email must be ${MAX_EMAIL_LENGTH} characters or less` },
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

    // Check if email already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: validatedEmail },
    });

    if (existing) {
      if (existing.status === 'subscribed') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      } else if (existing.status === 'unsubscribed') {
        // Resubscribe
        await db.newsletterSubscriber.update({
          where: { email: validatedEmail },
          data: { status: 'subscribed', subscribedAt: new Date() },
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Successfully resubscribed to newsletter',
          },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    await db.newsletterSubscriber.create({
      data: {
        email: validatedEmail,
        status: 'subscribed',
      },
    });

    // TODO: Send welcome email
    // TODO: Add to email marketing service (Mailchimp, ConvertKit, etc.)

    // Log for immediate visibility
    console.log('New newsletter subscription:', {
      email: validatedEmail,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
      },
      { status: 201 }
    );
  } catch (error) {
    // Sanitized error logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing newsletter subscription:', { errorMessage });

    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
