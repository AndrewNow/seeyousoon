import { createClient } from '@sanity/client';
import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, i as renderHead, j as renderSlot, m as maybeRenderHead, k as renderComponent } from '../astro_5378a7ba.mjs';
import 'html-escaper';
import 'clsx';
/* empty css                           */import { $ as $$Image } from './generic_eed6e2cb.mjs';

const sanityClient = createClient(
            {"apiVersion":"2024-01-22","projectId":"gt0shs9f","dataset":"production","useCdn":true}
          );

globalThis.sanityClient = sanityClient;

const $$Astro$4 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/anj/Coding/seeyousoon/web/src/layouts/Layout.astro", void 0);

const image1 = new Proxy({"src":"/_astro/sys1.61e578e3.png","width":1738,"height":1232,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const image2 = new Proxy({"src":"/_astro/sys2.9debb89a.png","width":1738,"height":1232,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const image3 = new Proxy({"src":"/_astro/sys3.e4aeef3e.png","width":1738,"height":1232,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const image4 = new Proxy({"src":"/_astro/sys4.a6df1dfc.png","width":1738,"height":1232,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

const $$Astro$3 = createAstro();
const $$MagneticHero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$MagneticHero;
  return renderTemplate`${maybeRenderHead()}<div class="cursor-container" data-astro-cid-k5qp2fsz> ${renderComponent($$result, "Image", $$Image, { "class": "landing-image", "src": image1, "alt": "image1", "quality": 100, "id": "image1", "data-astro-cid-k5qp2fsz": true })} ${renderComponent($$result, "Image", $$Image, { "class": "landing-image", "src": image2, "alt": "image2", "quality": 100, "id": "image2", "data-astro-cid-k5qp2fsz": true })} ${renderComponent($$result, "Image", $$Image, { "class": "landing-image", "src": image3, "alt": "image3", "quality": 100, "id": "image3", "data-astro-cid-k5qp2fsz": true })} ${renderComponent($$result, "Image", $$Image, { "class": "landing-image", "src": image4, "alt": "image4", "quality": 100, "id": "image4", "data-astro-cid-k5qp2fsz": true })} </div>  `;
}, "/Users/anj/Coding/seeyousoon/web/src/components/MagneticHero.astro", void 0);

const $$Astro$2 = createAstro();
const $$PastEventEntry = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PastEventEntry;
  const { eventData } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="event-text-wrapper" data-astro-cid-cxec3ieg> <div class="title-area" data-astro-cid-cxec3ieg> <h4 data-astro-cid-cxec3ieg> ${eventData.title} </h4> <p data-astro-cid-cxec3ieg>${eventData.description}</p> </div> <div class="details-area" data-astro-cid-cxec3ieg> <div data-astro-cid-cxec3ieg>
Where <br data-astro-cid-cxec3ieg> ${eventData.location} </div> <div data-astro-cid-cxec3ieg>
When <br data-astro-cid-cxec3ieg> ${eventData.date} </div> </div> </div> <div id="marquee" data-astro-cid-cxec3ieg> <div class="image-wrapper" data-astro-cid-cxec3ieg> ${eventData.images.map((img) => {
    return renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": img.imageSrc, "alt": img.altText, "width": "300", "height": "375", "quality": 90, "data-astro-cid-cxec3ieg": true })}`;
  })} </div> </div>  `;
}, "/Users/anj/Coding/seeyousoon/web/src/components/PastEvents/PastEventEntry.astro", void 0);

const $$Astro$1 = createAstro();
const $$PastEvents = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PastEvents;
  const { data } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="wrapper" data-astro-cid-cchkcslc> <h1 data-astro-cid-cchkcslc>Past Events</h1> ${data.map((event) => {
    return renderTemplate`<div class="pastevent-entry-wrapper" data-astro-cid-cchkcslc> ${renderComponent($$result, "PastEventEntry", $$PastEventEntry, { "eventData": event, "data-astro-cid-cchkcslc": true })} </div>`;
  })} </div> `;
}, "/Users/anj/Coding/seeyousoon/web/src/components/PastEvents/PastEvents.astro", void 0);

// import { useSanityClient, groq } from 'astro-sanity';
// import { createClient } from '@sanity/client'


async function getPastEvents() {
  const pastEvents = await useSanityClient().fetch(
    `*[_type == "pastEvents"]{
    _id,
    title,
    location,
    date,
    description,
    images[]{
      _key,
      'imageSrc': image.asset->url,
      altText,
    },
  }`);
  return pastEvents
}

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const pastEventsData = await getPastEvents();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro.", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero" id="magneticHero-wrapper" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MagneticHero", $$MagneticHero, { "data-astro-cid-j7pv25f6": true })} </section> <section class="past-events" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "PastEvents", $$PastEvents, { "data": pastEventsData, "data-astro-cid-j7pv25f6": true })} </section> ` })} `;
}, "/Users/anj/Coding/seeyousoon/web/src/pages/index.astro", void 0);

const $$file = "/Users/anj/Coding/seeyousoon/web/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, prerender, $$url as url };
