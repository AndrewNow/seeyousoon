import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroImages',
  title: "Hero images (don't touch this!)",
  type: 'document',
  fields: [
    defineField({
      title: "Images for the hero section",
      description: "Don't edit this unless you know what you're doing - Contact Andrew (andrew.p.nowacki@gmail.com) for questions if necessary.",
      name: "images",
      type: "array",
      of: [{
        type: "object",
        name: "imageEntry",
        title: "Image",
        fields: [{
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          }
        },
        {
        name: 'altText',
        title: 'Descriptive text for accessibility',
        description: "Create a description of the image for the visually impaired.",
        type: 'string',
        }],
      }]
    }),
    defineField({
      title: 'Newsletter image',
      name: 'newsletterImg',
      type: 'image',
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ]
    })
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare(selection) {
      const { images } = selection;

      // Check if there are images and if the first image has been defined
      const firstImage = images && images.length > 0 ? images[0].image : null;

      return {
        title: "Hero images",
        media: firstImage,
      };
    },
  },
});