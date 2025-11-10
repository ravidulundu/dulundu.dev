import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Fetch post by slug
    const post = await db.post.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        translations: {
          where: {
            locale,
          },
        },
      },
    });

    // Check if post exists
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if post is published (for public access)
    if (post.status !== 'published' || !post.publishedAt || post.publishedAt > new Date()) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if translation exists for the requested locale
    if (post.translations.length === 0) {
      return NextResponse.json(
        { error: 'Translation not available for this locale' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
