import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'currentLocation',
  title: 'Current Location',
  type: 'document',
  fields: [
    defineField({
      name: 'location',
      description: "Enter current location here, ex: 'Toronto'",
      title: 'Current location',
      type: 'string',
      validation: Rule => Rule.required()
    }),
  ],
  preview: {
    select: {
      title: 'location',
    },
    prepare(selection) {
      const { title } = selection;

      const subtitle = `Current location`

      return {
        title,
        subtitle,
      };
    },
  },
});