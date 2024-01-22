// import { useSanityClient, groq } from 'astro-sanity';
import { createClient } from '@sanity/client'

const client = createClient ({
  projectId: 'gt0shs9f',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-22',
})

export async function getPastEvents() {
  const pastEvents = await client.fetch(
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
  }`)
  return pastEvents
}