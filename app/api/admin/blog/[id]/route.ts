import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { parseDate } from '@/lib/validation';

// GET - Get single post for editing
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const post = await db.post.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const { slug, status, featured, publishedAt, translations } = body;

    // Check if post exists
    const existing = await db.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if slug is taken by another post
    if (slug && slug !== existing.slug) {
      const slugTaken = await db.post.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update post and translations
    const post = await db.post.update({
      where: { id },
      data: {
        slug: slug || existing.slug,
        status: status || existing.status,
        featured: featured !== undefined ? featured : existing.featured,
        publishedAt: parseDate(publishedAt) || existing.publishedAt,
        translations: translations
          ? {
              deleteMany: {}, // Delete existing translations
              create: translations.map((t: any) => ({
                locale: t.locale,
                title: t.title,
                excerpt: t.excerpt,
                content: t.content,
                coverImage: t.coverImage || null,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check if post exists
    const existing = await db.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete post (translations will be cascade deleted)
    await db.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
