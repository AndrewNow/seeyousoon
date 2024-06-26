import { sanityClient } from 'sanity:client'

export async function getHeroImages() {
  const data = await sanityClient.fetch(
    `*[_type == "heroImages"][0]{
    images[]{
      _key,
      'imageSrc': image.asset->url,
      altText,
    },
    'newsletterImg' : newsletterImg.asset->url,
  }`)
  return data
}

export async function getPastEvents() {
  const data = await sanityClient.fetch(
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
  return data
}

export async function getUpcomingEvents() {
  const data = await sanityClient.fetch(
    `*[_type == "upcomingEvents"]{
    _id,
    title,
    isResidency,
    eventLink,
    dateStart,
    dateEnd,
    location,
    locationLink
  }`)
  return data
}


export async function getCurrentLocation() {
  const data = await sanityClient.fetch(
    `*[_type == "currentLocation"] [0] {
      _id,
      location
    }`
  );

  return data;
}