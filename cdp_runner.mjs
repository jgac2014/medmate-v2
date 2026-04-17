import { WebSocket } from "ws";
import { writeFileSync } from "fs";

const WS_URL = "ws://localhost:51026/devtools/page/BFB6FDC27A99C9876018BCF054F6F672";
const ws = new WebSocket(WS_URL);
let msgId = 1;
const pending = new Map();
ws.on("message",(d)=>{const msg=JSON.parse(d.toString());if(msg.id&&pending.has(msg.id)){const{resolve,reject}=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result);}});
function cdp(method,params={}){return new Promise((resolve,reject)=>{const id=msgId++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(new Error("timeout:"+method));}},12000);});}
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function shot(name){const r=await cdp("Page.captureScreenshot",{format:"png",quality:85});writeFileSync("C:/Users/joaog/Downloads/"+name+".png",Buffer.from(r.data,"base64"));console.log("[shot] "+name+".png");}
async function js(expr){const r=await cdp("Runtime.evaluate",{expression:expr,awaitPromise:true,returnByValue:true,timeout:8000});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value;}
async function nav(url){await cdp("Page.navigate",{url});await sleep(3500);}
async function clickPatient(name){return await js("(function(){const rows=document.querySelectorAll('li,a,[class]');for(const row of rows){if(row.textContent.includes('"+name+"')&&row.offsetParent!==null&&row.children.length<=4){row.click();return true;}}return false;})()"); }
async function clickIniciar(){await js("(function(){const btns=document.querySelectorAll('button');for(const b of btns){if(b.textContent.trim().includes('Iniciar')){b.click();return;}}})()");await sleep(3000);}
async function fillVitals(pas,pad,peso){await js("(function(){function setVal(inp,val){const d=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');d.set.call(inp,val);inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));}const inputs=document.querySelectorAll('input');for(const inp of inputs){const lbl=(inp.name+inp.id+inp.placeholder+(inp.getAttribute('aria-label')||inp.getAttribute('data-field')||'')).toLowerCase();if(lbl==='pas'||(lbl.includes('pas')&&!lbl.includes('pad')))setVal(inp,'"+pas+"');else if(lbl==='pad'||lbl.includes('pad'))setVal(inp,'"+pad+"');else if(lbl==='peso'||lbl.includes('peso'))setVal(inp,'"+peso+"');}})()");await sleep(1200);}
async function expandPanel(){await js("(function(){const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('vs. \u00faltima'));if(btn)btn.click();})()");await sleep(700);}
async function getPanelInfo(){return await js("(function(){const body=document.body.innerText;const idx=body.indexOf('vs. \u00faltima');if(idx<0)return JSON.stringify({found:false});const ctx=body.substring(idx,idx+500);return JSON.stringify({found:true,ctx:ctx.substring(0,400),hasPA:ctx.includes('mmHg'),hasPeso:ctx.includes('Peso')||ctx.includes('kg'),hasUp:ctx.includes('subiu'),hasDown:ctx.includes('caiu'),hasStable:ctx.includes('est\u00e1vel')});})()"); }
const BASE="https://medmate-ob96hmfn5-joaogustavo9-2587s-projects.vercel.app";
ws.on("open",async()=>{
  try{
    console.log("=== TESTES P3 ===");
    // T1: Carlos com historico
    console.log("--- T1: Carlos historico ---");
    await nav(BASE+"/nova-consulta");
    await clickPatient("Carlos Silva");await sleep(2000);
    await clickIniciar();
    await fillVitals("155","98","88.5");
    await expandPanel();
    const p1=JSON.parse(await getPanelInfo()||"{}");
    console.log("T1:",JSON.stringify(p1));
    await shot("p3_t1");

    // T2: Ana sem historico
    console.log("--- T2: Ana sem historico ---");
    await nav(BASE+"/nova-consulta");
    await clickPatient("Ana Oliveira");await sleep(2000);
    await clickIniciar();
    await fillVitals("120","80","65");
    const p2=JSON.parse(await getPanelInfo()||"{}");
    console.log("T2:",JSON.stringify(p2));
    await shot("p3_t2");

    // T3: Carlos valores estaveis
    console.log("--- T3: Carlos estaveis ---");
    await nav(BASE+"/nova-consulta");
    await clickPatient("Carlos Silva");await sleep(2000);
    await clickIniciar();
    await expandPanel();
    const p3pre=JSON.parse(await getPanelInfo()||"{}");
    console.log("T3 pre:",JSON.stringify(p3pre));
    let pPas="120",pPad="80",pPeso="70";
    if(p3pre.ctx){
      const nums=p3pre.ctx.match(/([0-9]+) mmHg/g);
      const paMatch=p3pre.ctx.match(/([0-9]+)\\s*\\/\\s*([0-9]+)/);
      if(paMatch){pPas=paMatch[1];pPad=paMatch[2];}
      const kgMatch=p3pre.ctx.match(/([0-9]+[.,]?[0-9]*) kg/);
      if(kgMatch)pPeso=kgMatch[1];
    }
    console.log("Valores anteriores detectados:",pPas,pPad,pPeso);
    await fillVitals(pPas,pPad,pPeso);
    await expandPanel();
    const p3=JSON.parse(await getPanelInfo()||"{}");
    console.log("T3:",JSON.stringify(p3));
    await shot("p3_t3");

    // T4: Carlos consulta reaberta
    console.log("--- T4: Consulta reaberta ---");
    await nav(BASE+"/nova-consulta");
    await clickPatient("Carlos Silva");await sleep(1500);
    await js("(function(){const els=document.querySelectorAll('[class],a,button');for(const el of els){if(el.textContent.includes('Consultas anteriores')&&el.offsetParent){el.click();return;}}})()");
    await sleep(2500);
    await shot("p3_t4_lista");
    await js("(function(){const items=document.querySelectorAll('a,[class*=item],[class*=card],li,[class*=consult]');for(const item of items){const href=item.getAttribute('href')||'';const txt=item.textContent||'';if(href.includes('consult')||txt.match(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/)){item.click();return;}}})()");
    await sleep(3000);
    const urlT4=await js("window.location.href");
    console.log("URL T4:",urlT4);
    await expandPanel();
    const p4=JSON.parse(await getPanelInfo()||"{}");
    console.log("T4:",JSON.stringify(p4));
    await shot("p3_t4");

    // RESULTADOS
    console.log("\\n=== RESULTADOS ===");
    console.log("T1a - Bloco aparece Carlos:",(p1.found?"PASSOU":"FALHOU"));
    console.log("T1b - PA aparece:",(p1.hasPA?"PASSOU":"FALHOU"));
    console.log("T1c - Peso aparece:",(p1.hasPeso?"PASSOU":"FALHOU"));
    console.log("T1d - Tendencia subiu/caiu:",((p1.hasUp||p1.hasDown)?"PASSOU":"FALHOU"));
    console.log("T2a - Panel NAO aparece Ana:",(!p2.found?"PASSOU":"FALHOU"));
    console.log("T3a/b - PA/Peso estaveis:",(p3.hasStable?"PASSOU":"FALHOU"));
    console.log("T4 - Consulta reaberta painel:",(p4.found?"PASSOU":"FALHOU"));
    ws.close();
  }catch(e){console.error("ERRO:",e.message);try{await shot("p3_erro");}catch(e2){}ws.close();}
});
ws.on("error",(e)=>console.error("WS_ERR:",e.message));