import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pastEvents',
  title: 'Past Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      description: "Enter event title here.",
      title: 'Event title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: "Enter in the following format: 'City name, Country'. Ex: 'Toronto, CA'",
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Event start date',
      type: 'date',
      options: {
        dateFormat: "DD-MM-YYYY", 
      },
      validation: Rule => Rule.required()
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
      location: 'location',
      date: "date"
    },
    prepare(selection) {
      const { title, images, location, date } = selection;

      // Check if there are images and if the first image has been defined
      const firstImage = images && images.length > 0 ? images[0].image : null;

      
      // Create subtitle
      const locationInfo = location ? location : '';

      function convertDateFormat(inputDate) {
        // Parse the input date string in the "YYYY-MM-DD" format
        const parts = inputDate.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        // Create a Date object
        const dateObject = new Date(year, month - 1, day);

        // Format the date in the "DD-MM-YYYY" format
        const formattedDate = `${dateObject.getDate().toString().padStart(2, '0')}.${(dateObject.getMonth() + 1).toString().padStart(2, '0')}.${dateObject.getFullYear()}`;

        return formattedDate;
      }

      const inputDate = date;
      const convertedDate = convertDateFormat(inputDate);


      const dateInfo = convertedDate ? convertedDate : '';

      const subtitle = `${locationInfo} | ${dateInfo}`

      // Return the modified selection for preview
      return {
        title,
        media: firstImage,
        subtitle,
      };
    },
  },
});