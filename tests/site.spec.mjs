import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
test.describe("GitHub Pages sem PHP e sem banco",()=>{
 for(const width of [375,768,1440]){
   test("página responsiva a "+width+"px e sem erros JavaScript",async({browser})=>{
     const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
     page.on("pageerror",error=>errors.push(error.message));await page.goto("/");
     await expect(page.getByRole("heading",{name:"Um lugar para compartilhar."})).toBeVisible();
     expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)).toBe(false);
     expect(errors).toEqual([]);mkdirSync("tests/screenshots",{recursive:true});
     await page.screenshot({path:"tests/screenshots/feed-"+width+".png",fullPage:true});await page.close();
   });
 }
 test("publicação e curtida persistem após atualizar",async({page})=>{
   await page.goto("/");await page.getByPlaceholder("Escreva uma ideia, conquista ou novidade…").fill("Teste automatizado da rede");
   await page.getByRole("button",{name:"Publicar"}).click();
   await expect(page.getByText("Teste automatizado da rede")).toBeVisible();
   await page.reload();await expect(page.getByText("Teste automatizado da rede")).toBeVisible();
   const post=page.locator("article.post").filter({hasText:"Teste automatizado da rede"});
   await post.getByRole("button",{name:/Curtir/}).click();
   await expect(post.getByRole("button",{name:/Curtir/})).toHaveAttribute("aria-pressed","true");
 });
 test("amizades, chat e fechamento com Escape",async({page})=>{
   await page.goto("/");await page.getByRole("button",{name:/Amizades/}).click();
   const bia=page.locator("article.person").filter({hasText:"Bia Costa"});
   await bia.getByRole("button",{name:"Adicionar"}).click();
   await bia.getByRole("button",{name:"Mensagem"}).click();
   await page.locator("#chat-text").fill("Olá Bia!");
   await page.getByRole("button",{name:"Enviar"}).click();
   await expect(page.getByText("Olá Bia!")).toBeVisible();
   await page.keyboard.press("Escape");await expect(page.getByRole("dialog")).toBeHidden();
   await page.reload();await page.getByRole("button",{name:/Mensagens/}).first().click();
   await page.locator(".conversation").filter({hasText:"Bia Costa"}).click();
   await expect(page.getByText("Olá Bia!")).toBeVisible();
 });
});
