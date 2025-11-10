import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { NextRequest, NextResponse } from "next/server";

// Get single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        translations: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  try {
    const { slug, type, price, currency, status, translations } = await req.json();

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it conflicts
    if (slug !== existingProduct.slug) {
      const slugConflict = await db.product.findUnique({
        where: { slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Delete existing translations and create new ones
    await db.productTranslation.deleteMany({
      where: { productId: params.id },
    });

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        slug,
        type,
        price,
        currency,
        status,
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
