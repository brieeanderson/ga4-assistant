import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.8.0',
  ssgName: 'nextjs',
  nodeVersion: '18',
  
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['content'],
      models: [
        {
          name: 'page',
          type: 'page',
          label: 'Page',
          fields: [
            {
              type: 'string',
              name: 'title',
              label: 'Title',
              required: true
            },
            {
              type: 'string',
              name: 'description',
              label: 'Description'
            },
            {
              type: 'markdown',
              name: 'content',
              label: 'Content'
            }
          ]
        },
        {
          name: 'blogPost',
          type: 'page',
          label: 'Blog Post',
          fields: [
            {
              type: 'string',
              name: 'title',
              label: 'Title',
              required: true
            },
            {
              type: 'string',
              name: 'description',
              label: 'Description'
            },
            {
              type: 'markdown',
              name: 'content',
              label: 'Content',
              required: true
            },
            {
              type: 'list',
              name: 'tags',
              label: 'Tags',
              items: {
                type: 'string'
              }
            },
            {
              type: 'datetime',
              name: 'date',
              label: 'Date',
              required: true
            },
            {
              type: 'string',
              name: 'author',
              label: 'Author',
              required: true
            },
            {
              type: 'string',
              name: 'slug',
              label: 'Slug',
              required: true
            }
          ]
        }
      ]
    })
  ]
});
