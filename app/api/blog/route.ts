import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {
      status: 'published',
      publishedAt: {
        lte: new Date(), // Only show posts with publish date in the past
      },
    };

    if (featured) {
      where.featured = true;
    }

    // Fetch posts with translations filtered by locale
    // Only count posts that have translations for the requested locale
    const [posts, total] = await Promise.all([
      db.post.findMany({
        where: {
          ...where,
          translations: {
            some: {
              locale,
            },
          },
        },
        include: {
          translations: {
            where: {
              locale,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      db.post.count({
        where: {
          ...where,
          translations: {
            some: {
              locale,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
