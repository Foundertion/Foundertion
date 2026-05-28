(()=>{var a={};a.id=435,a.ids=[435],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1454:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>F,patchFetch:()=>E,routeModule:()=>A,serverHooks:()=>D,workAsyncStorage:()=>B,workUnitAsyncStorage:()=>C});var d={};c.r(d),c.d(d,{POST:()=>z});var e=c(9225),f=c(4006),g=c(8317),h=c(9373),i=c(4775),j=c(4235),k=c(261),l=c(4365),m=c(771),n=c(3461),o=c(7798),p=c(2280),q=c(2018),r=c(5696),s=c(7929),t=c(6439),u=c(7527),v=c(3211);let w=[{code:"id",name:"Indonesia",flag:"\uD83C\uDDEE\uD83C\uDDE9",patterns:[],commonWords:["yang","dan","dengan","untuk","dari","ini","itu","saya","kamu","bisnis","aplikasi","platform","bantu","membantu"]},{code:"en",name:"English",flag:"\uD83C\uDDEC\uD83C\uDDE7",patterns:[],commonWords:["the","and","with","for","from","this","that","help","business","app","platform","solution","startup","founder"]},{code:"ja",name:"日本語",flag:"\uD83C\uDDEF\uD83C\uDDF5",patterns:[/[぀-ゟ゠-ヿ一-龯]/],commonWords:["ビジネス","アプリ","プラットフォーム","スタートアップ","創業者","ソリューション","ヘルプ"]},{code:"es",name:"Espa\xf1ol",flag:"\uD83C\uDDEA\uD83C\uDDF8",patterns:[/[À-ÿ]/],commonWords:["el","la","y","con","para","negocio","aplicaci\xf3n","plataforma","soluci\xf3n","emprendedor"]},{code:"fr",name:"Fran\xe7ais",flag:"\uD83C\uDDEB\uD83C\uDDF7",patterns:[/[À-ÿ]/],commonWords:["le","la","et","avec","pour","entreprise","application","plateforme","solution","fondateur"]},{code:"de",name:"Deutsch",flag:"\uD83C\uDDE9\uD83C\uDDEA",patterns:[/[À-ÿ]/],commonWords:["der","die","und","mit","f\xfcr","gesch\xe4ft","anwendung","plattform","l\xf6sung","gr\xfcnder"]},{code:"pt",name:"Portugu\xeas",flag:"\uD83C\uDDF5\uD83C\uDDF9",patterns:[/[À-ÿ]/],commonWords:["o","a","e","com","para","neg\xf3cio","aplicativo","plataforma","solu\xe7\xe3o","fundador"]},{code:"ru",name:"Русский",flag:"\uD83C\uDDF7\uD83C\uDDFA",patterns:[/[Ѐ-ӿ]/],commonWords:["бизнес","приложение","платформа","решение","основатель","стартап","помощь"]},{code:"ar",name:"العربية",flag:"\uD83C\uDDF8\uD83C\uDDE6",patterns:[/[؀-ۿ]/],commonWords:["عمل","تطبيق","منصة","حل","مؤسس","بدء","مساعدة"]},{code:"zh",name:"中文",flag:"\uD83C\uDDE8\uD83C\uDDF3",patterns:[/[一-鿿]/],commonWords:["商业","应用","平台","解决方案","创始人","创业","帮助"]},{code:"ko",name:"한국어",flag:"\uD83C\uDDF0\uD83C\uDDF7",patterns:[/[가-힯]/],commonWords:["비즈니스","앱","플랫폼","솔루션","창업자","스타트업","도움"]},{code:"hi",name:"हिन्दी",flag:"\uD83C\uDDEE\uD83C\uDDF3",patterns:[/[ऀ-ॿ]/],commonWords:["व्यवसाय","ऐप","प्लेटफॉर्म","समाधान","संस्थापक","स्टार्टअप","मदद"]},{code:"nl",name:"Nederlands",flag:"\uD83C\uDDF3\uD83C\uDDF1",patterns:[],commonWords:["het","de","en","met","voor","bedrijf","applicatie","platform","oplossing","oprichter"]},{code:"it",name:"Italiano",flag:"\uD83C\uDDEE\uD83C\uDDF9",patterns:[/[À-ÿ]/],commonWords:["il","la","e","con","per","business","applicazione","piattaforma","soluzione","fondatore"]},{code:"tr",name:"T\xfcrk\xe7e",flag:"\uD83C\uDDF9\uD83C\uDDF7",patterns:[/[À-ÿ]/],commonWords:["ve","ile","i\xe7in","iş","uygulama","platform","\xe7\xf6z\xfcm","kurucu","yardım"]},{code:"pl",name:"Polski",flag:"\uD83C\uDDF5\uD83C\uDDF1",patterns:[/[À-ÿ]/],commonWords:["i","z","dla","biznes","aplikacja","platforma","rozwiązanie","założyciel"]},{code:"vi",name:"Tiếng Việt",flag:"\uD83C\uDDFB\uD83C\uDDF3",patterns:[/[À-ỹ]/],commonWords:["v\xe0","với","cho","kinh doanh","ứng dụng","nền tảng","giải ph\xe1p","nh\xe0 s\xe1ng lập"]},{code:"th",name:"ไทย",flag:"\uD83C\uDDF9\uD83C\uDDED",patterns:[/[฀-๿]/],commonWords:["ธุรกิจ","แอป","แพลตฟอร์ม","โซลูชัน","ผู้ก่อตั้ง","สตาร์ทอัพ","ช่วยเหลือ"]},{code:"ms",name:"Melayu",flag:"\uD83C\uDDF2\uD83C\uDDFE",patterns:[],commonWords:["dan","dengan","untuk","perniagaan","aplikasi","platform","penyelesaian","pengasas"]},{code:"tl",name:"Filipino",flag:"\uD83C\uDDF5\uD83C\uDDED",patterns:[],commonWords:["at","sa","para","negosyo","app","platform","solusyon","tagapagtatag"]}];async function x(a,b){let c=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"user",content:b}],max_tokens:1024,temperature:.7})}),d=await c.json();return d.choices?.[0]?.message?.content||"Error generating."}async function y(a){let{description:b,apiKey:c}=a,d=function(a){let b=a.toLowerCase(),c="en",d=0;for(let e of w){let f=0;for(let b of e.patterns)b.test(a)&&(f+=50);for(let a of e.commonWords)b.includes(a.toLowerCase())&&(f+=10);if("id"===e.code)for(let a of["lah","kah","pun","nya","ku","mu"])b.includes(a)&&(f+=5);f>d&&(d=f,c=e.code)}return c}(b),e=`Respond ENTIRELY in the same language as this idea (detected: ${d}). Do NOT switch languages.`,[f,g,h,i]=await Promise.all([x(c,`You are a world-class startup analyst. ${e}

Analyze this startup idea: "${b}"

## IDEA SCORE: [X/10]
**One-liner:** [one powerful sentence]

## MARKET ANALYSIS
**Market Size:** [TAM/SAM/SOM]
**Target Customer:** [specific persona]
**Problem Severity:** [1-10]

## STRENGTHS
1. [strength]
2. [strength]
3. [strength]

## RISKS
1. [risk + mitigation]
2. [risk + mitigation]
3. [risk + mitigation]

## COMPETITION
[2-3 competitors + differentiation]

## VERDICT
[2-3 sentences. Build this? #1 thing to validate?]`),x(c,`You are a serial entrepreneur. ${e}

Create a 90-day plan for: "${b}"

## BUSINESS PLAN: [Product Name]
**Mission:** [one sentence]
**Revenue Model:** [specific]
**Pricing:** [concrete tiers]

## DAY 1-30: VALIDATE
- [ ] [action]
- [ ] [action]
- [ ] [action]
- [ ] [action]
**Goal:** [milestone]

## DAY 31-60: BUILD MVP
- [ ] [action]
- [ ] [action]
- [ ] [action]
**Goal:** [milestone]

## DAY 61-90: LAUNCH
- [ ] [action]
- [ ] [action]
- [ ] [action]
**Goal:** [milestone]

## FINANCIAL PROJECTION (Month 3)
- MRR Target: [amount]
- Customers: [number]
- CAC: [amount]
- Burn Rate: [amount]

## TECH STACK
[Simple MVP stack]`),x(c,`You are a pitch coach. ${e}

Write a 2-minute investor pitch for: "${b}"

## PITCH: [Product Name]
**HOOK (15s):** [shocking stat or pain]
**PROBLEM (20s):** [vivid pain scenario]
**SOLUTION (20s):** [We built X that does Y for Z]
**TRACTION (20s):** [any signal]
**MARKET (15s):** [big number narrowed]
**BUSINESS MODEL (15s):** [how you make money]
**THE ASK (15s):** [how much, for what, why now]
**CLOSING LINE:** [one memorable sentence]`),x(c,`You are a conversion copywriter. ${e}

Write landing page copy for: "${b}"

## HERO SECTION
**Headline:** [max 8 words]
**Subheadline:** [max 20 words]
**Primary CTA:** [button text]
**Risk reducer:** [answer #1 objection]

## PROBLEM SECTION
**Headline:** [empathy-driven]
- [pain point 1]
- [pain point 2]
- [pain point 3]

## SOLUTION SECTION
**Headline:** [transformation]
- [benefit 1]
- [benefit 2]
- [benefit 3]

## SOCIAL PROOF
1. "[quote]" — [Name, Role]
2. "[quote]" — [Name, Role]

## PRICING
- Free: [what's included]
- Pro $9/mo: [what's included]

## FAQ
Q: [objection 1]
A: [answer]
Q: [objection 2]
A: [answer]

## FINAL CTA
**Headline:** [urgency]
**CTA:** [action]
**Risk reversal:** [guarantee]`)]);return{detectedLang:d,validation:f,plan:g,pitch:h,landing:i}}async function z(a){try{let{description:b}=await a.json();if(!b||b.trim().length<10)return v.NextResponse.json({error:"Description too short. Minimum 10 characters."},{status:400});let c=process.env.GROQ_API_KEY;if(!c)return v.NextResponse.json({error:"API key not configured."},{status:500});let d=await y({description:b,apiKey:c});return v.NextResponse.json(d)}catch(a){return console.error("Generation error:",a),v.NextResponse.json({error:"Failed to generate results"},{status:500})}}let A=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:"app/api/generate/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/data/data/com.termux/files/home/Foundertion/app/api/generate/route.ts",nextConfigOutput:"",userland:d,...{}}),{workAsyncStorage:B,workUnitAsyncStorage:C,serverHooks:D}=A;function E(){return(0,g.patchFetch)({workAsyncStorage:B,workUnitAsyncStorage:C})}async function F(a,b,c){c.requestMeta&&(0,h.setRequestMeta)(a,c.requestMeta),A.isDev&&(0,h.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let d="/api/generate/route";"/index"===d&&(d="/");let e=await A.prepare(a,b,{srcPage:d,multiZoneDraftMode:!1});if(!e)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:g,deploymentId:v,params:w,nextConfig:x,parsedUrl:y,isDraftMode:z,prerenderManifest:B,routerServerContext:C,isOnDemandRevalidate:D,revalidateOnlyGenerated:E,resolvedPathname:F,clientReferenceManifest:G,serverActionsManifest:H}=e,I=(0,k.normalizeAppPath)(d),J=!!(B.dynamicRoutes[I]||B.routes[F]),K=async()=>((null==C?void 0:C.render404)?await C.render404(a,b,y,!1):b.end("This page could not be found"),null);if(J&&!z){let a=!!B.routes[F],b=B.dynamicRoutes[I];if(b&&!1===b.fallback&&!a){if(x.adapterPath)return await K();throw new t.NoFallbackError}}let L=null;!J||A.isDev||z||(L="/index"===(L=F)?"/":L);let M=!0===A.isDev||!J,N=J&&!M;H&&G&&(0,j.setManifestsSingleton)({page:d,clientReferenceManifest:G,serverActionsManifest:H});let O=a.method||"GET",P=(0,i.getTracer)(),Q=P.getActiveScopeSpan(),R=!!(null==C?void 0:C.isWrappedByNextServer),S=!!(0,h.getRequestMeta)(a,"minimalMode"),T=(0,h.getRequestMeta)(a,"incrementalCache")||await A.getIncrementalCache(a,x,B,S);null==T||T.resetRequestCache(),globalThis.__incrementalCache=T;let U={params:w,previewProps:B.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:M,incrementalCache:T,cacheLifeProfiles:x.cacheLife,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d,e)=>A.onRequestError(a,b,d,e,C)},sharedContext:{buildId:g,deploymentId:v}},V=new l.NodeNextRequest(a),W=new l.NodeNextResponse(b),X=m.NextRequestAdapter.fromNodeNextRequest(V,(0,m.signalFromNodeResponse)(b));try{let e,g=async a=>A.handle(X,U).finally(()=>{if(!a)return;a.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let c=P.getRootSpanAttributes();if(!c)return;if(c.get("next.span_type")!==n.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${c.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let f=c.get("next.route");if(f){let b=`${O} ${f}`;a.setAttributes({"next.route":f,"http.route":f,"next.span_name":b}),a.updateName(b),e&&e!==a&&(e.setAttribute("http.route",f),e.updateName(b))}else a.updateName(`${O} ${d}`)}),h=async e=>{var h,i;let j=async({previousCacheEntry:f})=>{try{if(!S&&D&&E&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let d=await g(e);a.fetchMetrics=U.renderOpts.fetchMetrics;let h=U.renderOpts.pendingWaitUntil;h&&c.waitUntil&&(c.waitUntil(h),h=void 0);let i=U.renderOpts.collectedTags;if(!J)return await (0,p.I)(V,W,d,U.renderOpts.pendingWaitUntil),null;{let a=await d.blob(),b=(0,q.toNodeOutgoingHttpHeaders)(d.headers);i&&(b[s.NEXT_CACHE_TAGS_HEADER]=i),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==U.renderOpts.collectedRevalidate&&!(U.renderOpts.collectedRevalidate>=s.INFINITE_CACHE)&&U.renderOpts.collectedRevalidate,e=void 0===U.renderOpts.collectedExpire||U.renderOpts.collectedExpire>=s.INFINITE_CACHE?void 0:U.renderOpts.collectedExpire;return{value:{kind:u.CachedRouteKind.APP_ROUTE,status:d.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:e}}}}catch(b){throw(null==f?void 0:f.isStale)&&await A.onRequestError(a,b,{routerKind:"App Router",routePath:d,routeType:"route",revalidateReason:(0,o.c)({isStaticGeneration:N,isOnDemandRevalidate:D})},!1,C),b}},k=await A.handleResponse({req:a,nextConfig:x,cacheKey:L,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:B,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:E,responseGenerator:j,waitUntil:c.waitUntil,isMinimalMode:S});if(!J)return null;if((null==k||null==(h=k.value)?void 0:h.kind)!==u.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==k||null==(i=k.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});S||b.setHeader("x-nextjs-cache",D?"REVALIDATED":k.isMiss?"MISS":k.isStale?"STALE":"HIT"),z&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,q.fromNodeOutgoingHttpHeaders)(k.value.headers);return S&&J||l.delete(s.NEXT_CACHE_TAGS_HEADER),!k.cacheControl||b.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,r.getCacheControlHeader)(k.cacheControl)),await (0,p.I)(V,W,new Response(k.value.body,{headers:l,status:k.value.status||200})),null};R&&Q?await h(Q):(e=P.getActiveScopeSpan(),await P.withPropagatedContext(a.headers,()=>P.trace(n.BaseServerSpan.handleRequest,{spanName:`${O} ${d}`,kind:i.SpanKind.SERVER,attributes:{"http.method":O,"http.target":a.url}},h),void 0,!R))}catch(b){if(b instanceof t.NoFallbackError||await A.onRequestError(a,b,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,o.c)({isStaticGeneration:N,isOnDemandRevalidate:D})},!1,C),J)throw b;return await (0,p.I)(V,W,new Response(null,{status:500})),null}}},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},8335:()=>{},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[741,813],()=>b(b.s=1454));module.exports=c})();