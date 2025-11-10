import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Fetch project by slug
    const project = await db.project.findUnique({
      where: {
        slug,
      },
      include: {
        translations: {
          where: {
            locale,
          },
        },
      },
    });

    // Check if project exists
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if project is published (for public access)
    if (project.status !== 'published') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if translation exists for the requested locale
    if (project.translations.length === 0) {
      return NextResponse.json(
        { error: 'Translation not available for this locale' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio project' },
      { status: 500 }
    );
  }
}
