import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('.css')) {
      console.log('CSS File:', url, 'Status:', response.status());
    }
  });
  
  await page.goto('http://localhost:3000/tr', { waitUntil: 'networkidle' });
  
  const cssInfo = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const styles = Array.from(document.querySelectorAll('style'));
    
    return {
      linkCount: links.length,
      links: links.map(l => l.href),
      styleCount: styles.length,
      firstStyleContent: styles[0]?.textContent?.substring(0, 200) || 'NONE'
    };
  });
  
  console.log('\n📋 CSS Import Durumu:');
  console.log('Link tags:', cssInfo.linkCount);
  console.log('Links:', cssInfo.links);
  console.log('Style tags:', cssInfo.styleCount);
  console.log('First style content:', cssInfo.firstStyleContent);
  
  await browser.close();
}

test().catch(console.error);
