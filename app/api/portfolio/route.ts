import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {
      status: 'published',
    };

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.featured = true;
    }

    // Fetch projects with translations filtered by locale
    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          translations: {
            where: {
              locale,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
        skip,
        take: limit,
      }),
      db.project.count({ where }),
    ]);

    // Filter out projects that don't have translation for the requested locale
    const projectsWithTranslation = projects.filter(
      (project) => project.translations.length > 0
    );

    return NextResponse.json({
      projects: projectsWithTranslation,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio projects' },
      { status: 500 }
    );
  }
}
