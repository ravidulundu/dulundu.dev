import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Create new product
export async function POST(req: NextRequest) {
  await requireAdmin();

  try {
    const { slug, type, price, currency, status, translations } = await req.json();

    // Validate required fields
    if (!slug || !type || price === undefined || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      );
    }

    // Create product with translations
    const product = await db.product.create({
      data: {
        slug,
        type,
        price,
        currency,
        status: status || 'draft',
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            title: t.title,
            description: t.description || '',
            features: t.features || null,
            coverImage: t.coverImage || null,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// Get all products (admin)
export async function GET(req: NextRequest) {
  await requireAdmin();

  try {
    const products = await db.product.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
