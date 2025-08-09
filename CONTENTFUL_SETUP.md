# Contentful Blog Setup Guide

This guide will help you set up Contentful for your GA4 Helper blog.

## Prerequisites

1. ✅ Contentful account created
2. ✅ Space named "GA4 Helper Blog" created
3. ✅ Content model "Blog Post" created with all required fields

## Environment Variables Setup

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values with your actual Contentful credentials:
   ```
   CONTENTFUL_SPACE_ID=your_actual_space_id
   CONTENTFUL_ACCESS_TOKEN=your_actual_access_token
   ```

## Getting Your Contentful Credentials

1. **Space ID**: 
   - Go to Settings → General settings
   - Copy the "Space ID"

2. **Access Token**:
   - Go to Settings → API keys
   - Click on your API key (or create a new one)
   - Copy the "Content Delivery API - access token"

## Content Model Verification

Make sure your "Blog Post" content type has these fields:

| Field Name | Field Type | Settings |
|------------|------------|----------|
| Title | Short text | Required, Used as title |
| Slug | Short text | Required, Unique, Pattern: `^[a-z0-9-]+$` |
| Excerpt | Long text | Required, Max 200 chars |
| Content | Rich text | Required |
| Author | Short text | Default: "GA4 Helper Team" |
| Publish Date | Date & time | Required |
| Category | Short text | Dropdown with: Configuration, Events, Attribution, Best Practices, Updates |
| Featured Image | Media | Accept only images |
| Tags | Short text | List |
| SEO Title | Short text | Optional |
| SEO Description | Long text | Optional, Max 160 chars |

## Testing the Integration

1. Create a test blog post in Contentful
2. Run your development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000/blog` to see your blog posts
4. Click on a blog post to view the individual post page

## Troubleshooting

### No blog posts showing up?
- Check that your environment variables are correctly set
- Verify that you have published at least one blog post in Contentful
- Check the browser console for any errors

### Images not displaying?
- Make sure the Featured Image field is properly configured in Contentful
- Verify that the image is published and accessible

### Rich text content not rendering properly?
- The current implementation supports basic markdown-style formatting
- For more complex rich text, you may need to install and configure `@contentful/rich-text-react-renderer`

## Next Steps

1. **Create your first blog post** in Contentful
2. **Customize the styling** to match your brand
3. **Add more features** like:
   - Category filtering
   - Search functionality
   - Related posts
   - Social sharing
   - Comments system

## Support

If you encounter any issues, check:
1. Contentful documentation: https://www.contentful.com/developers/docs/
2. Next.js documentation: https://nextjs.org/docs
3. Your browser's developer console for error messages
