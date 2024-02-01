import { sanityClient } from 'sanity:client'

export async function getPastEvents() {
  const pastEvents = await sanityClient.fetch(
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