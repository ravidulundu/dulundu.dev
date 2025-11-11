import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { generatePriceMap, normalizeCurrency, normalizePriceOverrides } from "@/lib/currency";
import { NextRequest, NextResponse } from "next/server";

async function syncProductPrices(productId: string, priceMap: Record<string, string>) {
  await Promise.all(
    Object.entries(priceMap).map(([currencyCode, amount]) =>
      db.productPrice.upsert({
        where: {
          productId_currency: {
            productId,
            currency: currencyCode
          }
        },
        update: {
          amount
        },
        create: {
          productId,
          currency: currencyCode,
          amount
        }
      })
    )
  );
}

function buildPriceMap(
  price: number,
  currency: string,
  overrides?: Record<string, string | number>
) {
  const normalizedCurrency = normalizeCurrency(currency);
  const normalizedOverrides = normalizePriceOverrides(overrides);
  if (normalizedOverrides[normalizedCurrency]) {
    delete normalizedOverrides[normalizedCurrency];
  }
  return generatePriceMap(price, normalizedCurrency, normalizedOverrides);
}

// Get single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        translations: true,
        prices: true,
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
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  try {
    const { slug, type, price, currency, status, translations, priceOverrides } = await req.json();

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id },
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
      where: { productId: id },
    });

    const basePriceValue = Number(price);
    if (Number.isNaN(basePriceValue) || basePriceValue <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }
    const normalizedCurrency = normalizeCurrency(currency);
    const priceMap = buildPriceMap(basePriceValue, normalizedCurrency, priceOverrides);

    const product = await db.product.update({
      where: { id },
      data: {
        slug,
        type,
        price: basePriceValue,
        currency: normalizedCurrency,
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
        prices: true,
      },
    });

    await syncProductPrices(product.id, priceMap);

    const productWithPrices = await db.product.findUnique({
      where: { id: product.id },
      include: {
        translations: true,
        prices: true,
      },
    });

    return NextResponse.json(productWithPrices);
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
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;

  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.product.delete({
      where: { id },
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
