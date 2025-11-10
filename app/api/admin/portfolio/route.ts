import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

// POST - Create new portfolio project
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body = await req.json();
    const { slug, category, status, featured, url, order, translations } = body;

    // Validate required fields
    if (!slug || !category || !translations || translations.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.project.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create project with translations
    const project = await db.project.create({
      data: {
        slug,
        category,
        status: status || 'draft',
        featured: featured || false,
        url: url || null,
        order: order || 0,
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            title: t.title,
            description: t.description,
            technologies: t.technologies || null,
            images: t.images || null,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - List all portfolio projects (admin view, includes drafts)
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const projects = await db.project.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
