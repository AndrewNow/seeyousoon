import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'mime';
import 'html-escaper';
import 'clsx';
import './chunks/astro_5378a7ba.mjs';
import { compile } from 'path-to-regexp';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

new TextEncoder();

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.f310bfb3.js"}],"styles":[{"type":"inline","content":"Modern CSS Reset from https://piccalil.li/blog/a-modern-css-reset/ *,*::before,*::after{box-sizing:border-box}body,h1,h2,h3,h4,h5,h6,p,figure,blockquote,dl,dd{margin:0}ul[role=list],ol[role=list]{list-style:none;padding:0;list-style-position:inside}html:focus-within{scroll-behavior:smooth}body{min-height:100vh}a:not([class]){text-decoration-skip-ink:auto}img,picture{max-width:100%;display:block}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){html:focus-within{scroll-behavior:auto}*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}:root{--beige: #F9F8F3;--brown-bg: #14100E}.cursor-container[data-astro-cid-k5qp2fsz]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:grid;place-items:center;aspect-ratio:1738/1232;width:50%;height:auto}.landing-image[data-astro-cid-k5qp2fsz]{width:100%;height:100%;position:absolute}#marquee[data-astro-cid-cxec3ieg]{width:100%;overflow:hidden}.event-text-wrapper[data-astro-cid-cxec3ieg]{display:flex;justify-content:flex-start;width:95%;margin:5rem auto}.event-text-wrapper[data-astro-cid-cxec3ieg] h4[data-astro-cid-cxec3ieg],.event-text-wrapper[data-astro-cid-cxec3ieg] p[data-astro-cid-cxec3ieg]{color:#fff}.title-area[data-astro-cid-cxec3ieg]{flex:1.5;max-width:50%}.title-area[data-astro-cid-cxec3ieg] p[data-astro-cid-cxec3ieg]{width:65%}.details-area[data-astro-cid-cxec3ieg]{flex:1;max-width:500px;display:flex;justify-content:space-between;color:#fff}.image-wrapper[data-astro-cid-cxec3ieg]{display:flex}.image-wrapper[data-astro-cid-cxec3ieg] img[data-astro-cid-cxec3ieg]{max-width:100%;height:auto;margin-right:10px}.wrapper[data-astro-cid-cchkcslc]{width:98%;margin:0 auto;background:var(--brown-bg)}.wrapper[data-astro-cid-cchkcslc] h1[data-astro-cid-cchkcslc]{color:#fff;text-align:center}.pastevent-entry-wrapper[data-astro-cid-cchkcslc]{margin:5rem auto}.hero[data-astro-cid-j7pv25f6]{position:relative;overflow:hidden;width:100%;height:99vh}\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/anj/Coding/seeyousoon/web/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/src/pages/index.astro":"chunks/pages/index_d8cdca87.mjs","\u0000@astrojs-manifest":"manifest_b659a800.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_d5bfe738.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_db6c1835.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.f310bfb3.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/sys4.a6df1dfc.png","/_astro/sys3.e4aeef3e.png","/_astro/sys2.9debb89a.png","/_astro/sys1.61e578e3.png","/favicon.svg","/_astro/hoisted.f310bfb3.js"]});

export { manifest };
