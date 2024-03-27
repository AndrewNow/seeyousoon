import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'upcomingEvents',
  title: 'Upcoming Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      description: "Enter event title here, ex: 'Oranj'.",
      title: 'Event title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isResidency',
      title: 'Is this a residency?',
      description: "Defaults to no, click to toggle it to yes",
      type: 'boolean',
      layout: "checkbox",
      initialValue: false,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'eventLink',
      title: '"Reserve" button link (Rezy, OpenTable, etc.). Leave this field empty if no link applies - this will create a "Coming soon" button state.',
      type: 'string',
    }),
    defineField({
      name: 'dateStart',
      title: 'Event start date',
      type: 'datetime',
      options: {
        timeStep: 15,
        dateFormat: "DD-MM-YYYY",
        timeFormat: "h-m"
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'dateEnd',
      title: 'Event end date',
      type: 'datetime',
      options: {
        timeStep: 15,
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'h-m',
      },
      validation: Rule =>
        Rule.custom((dateEnd, context) => {
          const { document } = context;

          // Check if dateEnd is defined and is before dateStart
          if (dateEnd && document.dateStart && dateEnd < document.dateStart) {
            return 'End date must not be before start date';
          }

          return true;
        }),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: "Enter in the following format: 'Address number, Street name'. Ex: '915 Dupont'",
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'locationLink',
      title: 'Link to Google Maps location',
      description: "Paste in a link from Google Maps - Copy the 'share link' link, ex: https://maps.app.goo.gl/SrjPyTBLCca8RiwXA. ",
      type: 'string',
      validation: Rule => Rule.required()
    }),
  ],
  preview: {
    select: {
      title: 'title',
      dateStart: 'dateStart',
      dateEnd: 'dateEnd',
    },
    prepare(selection) {
      const { title, dateStart, dateEnd } = selection;

      function convertDateFormat(dateInput) {
        const options = { month: 'long', day: 'numeric' };
        const date = new Date(dateInput).toLocaleDateString('en-US', options);

        return date;
      }

      const convertedStartDate = convertDateFormat(dateStart);
      const convertedEndDate = convertDateFormat(dateEnd);

      const subtitle = `${convertedStartDate} to ${convertedEndDate}`;

      return {
        title,
        subtitle,
      };
    },
  },
});