const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    include: {
      prices: true
    }
  })

  console.log('=== VERITABANINDA ÜRÜNLER ===\n')
  products.forEach(p => {
    console.log(`Ürün: ${p.name}`)
    console.log(`ID: ${p.id}`)
    console.log(`Stripe Product ID: ${p.stripeProductId}`)
    console.log(`Stripe Price IDs:`, p.stripePriceIds)
    console.log(`Prices tablosunda:`)
    p.prices.forEach(price => {
      console.log(`  - ${price.currency.toUpperCase()}: ${price.amount / 100} (${price.amount} cents)`)
    })
    console.log('\n')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
