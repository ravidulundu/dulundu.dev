import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';

// GET - Get single project for editing
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const { slug, category, status, featured, url, order, translations } = body;

    // BUG-NEW-004 FIX: Use transaction for atomicity
    const result = await db.$transaction(async (tx) => {
      // Check if project exists
      const existing = await tx.project.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error('Project not found');
      }

      // Check if slug is taken by another project
      if (slug && slug !== existing.slug) {
        const slugTaken = await tx.project.findUnique({
          where: { slug },
        });

        if (slugTaken) {
          throw new Error('Slug already exists');
        }
      }

      // If translations are being updated, delete old ones first
      if (translations) {
        await tx.projectTranslation.deleteMany({
          where: { projectId: id },
        });
      }

      // Update project with new translations
      return tx.project.update({
        where: { id },
        data: {
          slug: slug || existing.slug,
          category: category || existing.category,
          status: status || existing.status,
          featured: featured !== undefined ? featured : existing.featured,
          url: url !== undefined ? url : existing.url,
          order: order !== undefined ? order : existing.order,
          translations: translations
            ? {
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
    });

    return NextResponse.json(result);
  } catch (error) {
    // Sanitized error logging (BUG-NEW-009 fix)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating project:', { errorMessage });

    const statusCode = errorMessage === 'Project not found' ? 404
      : errorMessage === 'Slug already exists' ? 409
      : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check if project exists
    const existing = await db.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete project (translations will be cascade deleted)
    await db.project.delete({
      where: { id },
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
