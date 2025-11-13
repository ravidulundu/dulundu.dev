const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    include: {
      translations: true,
      prices: true
    }
  })

  console.log('\n=== STRIPE SENKRONIZASYON DURUMU ===\n')

  products.forEach(product => {
    const enTranslation = product.translations.find(t => t.locale === 'en')
    console.log(`📦 ÜRÜN: ${enTranslation?.title || 'İsimsiz'}`)
    console.log(`   ID: ${product.id}`)
    console.log(`   Stripe Product ID: ${product.stripeProductId || '❌ YOK'}`)
    console.log(`   Stripe Price ID (eski): ${product.stripePriceId || '❌ YOK'}`)
    console.log(`\n   💰 FİYATLAR:`)

    product.prices.forEach(price => {
      const symbol = price.currency === 'USD' ? '$' : price.currency === 'TRY' ? '₺' : 'R$'
      console.log(`      ${price.currency.toUpperCase()}: ${symbol}${price.amount}`)
      console.log(`         Stripe Price ID: ${price.stripePriceId || '❌ EKSIK!'}`)
    })
    console.log('\n' + '─'.repeat(60) + '\n')
  })

  console.log('\n=== STRIPE\'DA MEVCUT FİYATLAR ===\n')
  console.log('Ürün 1: WordPress Performance Audit (prod_TOq3LoqsAsRJON)')
  console.log('   USD: price_1SS2MvB66OuRFPmyJnB8az3u ($1,200)')
  console.log('   TRY: price_1SS2nPB66OuRFPmy0i0fTcfq (₺42,000)')
  console.log('   BRL: price_1SS2nUB66OuRFPmy2euAzU7h (R$6,200)')
  console.log('\nÜrün 2: AI Content Suite (prod_TOqUftwLNRuUVe)')
  console.log('   USD: price_1SS2nzB66OuRFPmyOzd1wTrD ($149)')
  console.log('   TRY: price_1SS2oBB66OuRFPmykteh2ZPE (₺4,990)')
  console.log('   BRL: price_1SS2oGB66OuRFPmyRN2oQO8d (R$790)')
  console.log('\nÜrün 3: WordPress Performans Analizi (prod_TP066Z3hqw684f)')
  console.log('   BRL: price_1SSC6jB66OuRFPmyFO88C5f5 (R$500)')
  console.log('   TRY: price_1SSC73B66OuRFPmytATEByxT (₺3,000)')
  console.log('   USD: ❌ EKSIK')
  console.log('\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
