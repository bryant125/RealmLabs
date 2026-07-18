import {defineField, defineType} from 'sanity'

// One "article" type with a required brand selector. Each brand's article
// section on the site queries only its own brand, keeping MamaBee and
// BurnScroll fully separated — just like before.
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      options: {
        list: [
          {title: '🐝 MamaBee', value: 'mamabee'},
          {title: '🔥 BurnScroll', value: 'burnscroll'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta description (SEO + card blurb)',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Realm Labs',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      of: [
        {
          type: 'block',
          // inline "download link" mark: highlight any text and link it to the app
          marks: {
            annotations: [
              {
                name: 'appLink',
                type: 'object',
                title: '📲 Download-app link',
                fields: [{name: 'note', type: 'string', title: 'Internal note (optional)'}],
              },
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'caption', type: 'string', title: 'Caption (shown under the image)'},
            {name: 'alt', type: 'string', title: 'Alt text (accessibility/SEO)'},
            {name: 'phone', type: 'boolean', title: 'App screenshot (show in a phone frame)'},
          ],
        },
        // Insertable "Download the app" call-to-action button block
        {
          type: 'object',
          name: 'appCta',
          title: '📲 App Download button',
          fields: [
            {name: 'heading', type: 'string', title: 'Headline (optional)', description: 'e.g. "Track every feed and nap — without the 3 AM math."'},
            {name: 'label', type: 'string', title: 'Button text', initialValue: 'Get the app'},
          ],
          preview: {
            select: {heading: 'heading'},
            prepare({heading}: any) {
              return {title: heading || 'App Download button', subtitle: '📲 CTA'}
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', brand: 'brand', media: 'coverImage'},
    prepare({title, brand, media}) {
      return {title, subtitle: brand === 'mamabee' ? '🐝 MamaBee' : '🔥 BurnScroll', media}
    },
  },
})
