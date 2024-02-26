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

export async function getUpcomingEvents() {
  const pastEvents = await sanityClient.fetch(
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
  return pastEvents
}


export async function getUpcomingEvent() {
  const upcomingEvent = await sanityClient.fetch(
    `*[_type == "upcomingEvents" && dateStart >= now()] | order(dateStart asc) [0] {
      _id,
      title,
      isResidency,
      eventLink,
      dateStart,
      dateEnd,
      location,
      locationLink
    }`
  );

  return upcomingEvent;
}