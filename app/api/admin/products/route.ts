import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { generatePriceMap, normalizeCurrency, normalizePriceOverrides } from "@/lib/currency";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Create new product
export async function POST(req: NextRequest) {
  await requireAdmin();

  try {
    const { slug, type, price, currency, status, translations, priceOverrides } = await req.json();

    // Validate required fields
    const basePriceValue = Number(price);
    if (!slug || !type || Number.isNaN(basePriceValue) || basePriceValue <= 0 || !currency) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }
    const normalizedCurrency = normalizeCurrency(currency);

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
    const priceMap = buildPriceMap(basePriceValue, normalizedCurrency, priceOverrides);

    const product = await db.product.create({
      data: {
        slug,
        type,
        price: basePriceValue,
        currency: normalizedCurrency,
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

    return NextResponse.json(productWithPrices, { status: 201 });
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
        prices: true,
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
