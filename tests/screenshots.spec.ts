import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const widths=[320,360,390,768,1280,1600];
const pages=['feed','faith','explore','friends','messages','profile'] as const;
test.describe('Capturas automáticas e layout sem overflow',()=>{
  for(const width of widths){
    test('resolução '+width+'px',async ({page})=>{
      await page.setViewportSize({width,height:width<700?800:900});
      for(const section of pages){
        await page.goto('/rede_social/#'+section);
        await expect(page.locator('main h1')).toBeVisible();
        const errors:string[]=[];
        page.on('pageerror',e=>errors.push(e.message));
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
        const dest=join('test-results','screenshots');
        mkdirSync(dest,{recursive:true});
        await page.screenshot({path:join(dest,section+'-'+width+'.png'),fullPage:true,animations:'disabled'});
        expect(errors).toEqual([]);
      }
    });
  }
});
test('respeita preferência de movimento reduzido',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/rede_social/');
  await expect(page.getByRole('heading',{name:/Boas-vindas/})).toBeVisible();
  const duration=await page.locator('.side-link').first().evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration));
  expect(duration).toBeLessThanOrEqual(0.001);
});
