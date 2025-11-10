import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

// GET - Get single project for editing
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const project = await db.project.findUnique({
      where: { id: params.id },
      include: {
        translations: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing project
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { slug, category, status, featured, url, order, translations } = body;

    // Check if project exists
    const existing = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if slug is taken by another project
    if (slug && slug !== existing.slug) {
      const slugTaken = await db.project.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update project and translations
    const project = await db.project.update({
      where: { id: params.id },
      data: {
        slug: slug || existing.slug,
        category: category || existing.category,
        status: status || existing.status,
        featured: featured !== undefined ? featured : existing.featured,
        url: url !== undefined ? url : existing.url,
        order: order !== undefined ? order : existing.order,
        translations: translations
          ? {
              deleteMany: {}, // Delete existing translations
              create: translations.map((t: any) => ({
                locale: t.locale,
                title: t.title,
                description: t.description,
                technologies: t.technologies || null,
                images: t.images || null,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // Check if project exists
    const existing = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete project (translations will be cascade deleted)
    await db.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
