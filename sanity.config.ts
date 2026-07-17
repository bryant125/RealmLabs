import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './src/sanity/schemaTypes'

// projectId is NOT secret — it's set via env for both the Studio and the site.
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env?.PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.PUBLIC_SANITY_DATASET || import.meta.env?.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'realmlabs',
  title: 'RealmLabs',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('🐝 MamaBee Articles')
              .child(
                S.documentList()
                  .title('MamaBee Articles')
                  .filter('_type == "article" && brand == "mamabee"')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              ),
            S.listItem()
              .title('🔥 BurnScroll Articles')
              .child(
                S.documentList()
                  .title('BurnScroll Articles')
                  .filter('_type == "article" && brand == "burnscroll"')
                  .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              ),
          ]),
    }),
  ],
  schema: {types: schemaTypes},
})
