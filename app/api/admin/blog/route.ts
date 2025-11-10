import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { parseDate } from '@/lib/validation';

// POST - Create new blog post
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body = await req.json();
    const { slug, status, featured, publishedAt, translations } = body;

    // Validate required fields
    if (!slug || !translations || translations.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.post.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create post with translations
    const post = await db.post.create({
      data: {
        slug,
        status: status || 'draft',
        featured: featured || false,
        publishedAt: parseDate(publishedAt),
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
            coverImage: t.coverImage || null,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - List all blog posts (admin view, includes drafts)
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const posts = await db.post.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
