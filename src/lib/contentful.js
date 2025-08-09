import { createClient } from 'contentful';

// Check if Contentful credentials are configured
const isContentfulConfigured = process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN;

const client = isContentfulConfigured ? createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
}) : null;

export default client;

// Helper function to extract rich text content (for excerpts only)
function extractRichTextContent(content) {
  if (!content) return '';
  
  // If it's already a string, return it
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's a Contentful rich text object, extract plain text for excerpts
  if (content.content && Array.isArray(content.content)) {
    return content.content.map(node => {
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(child => child.value || '').join('');
      }
      return node.value || '';
    }).join('\n');
  }
  
  return '';
}

// Fetch all blog posts
export async function getBlogPosts() {
  if (!isContentfulConfigured) {
    console.warn('Contentful credentials not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables.');
    return [];
  }

  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: '-fields.publishDate',
      include: 2,
    });

    return response.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title || '',
      slug: item.fields.slug || '',
      excerpt: item.fields.excerpt || extractRichTextContent(item.fields.content).substring(0, 200),
      content: item.fields.content, // Keep as rich text object
      author: item.fields.author || 'GA4 Helper Team',
      publishDate: item.fields.publishDate || new Date().toISOString(),
      category: item.fields.category || '',
      featuredImage: item.fields.featuredImage ? {
        url: `https:${item.fields.featuredImage.fields.file.url}`,
        alt: item.fields.featuredImage.fields.description || item.fields.title || '',
      } : null,
      tags: item.fields.tags || [],
      seoTitle: item.fields.seoTitle || item.fields.title || '',
      seoDescription: item.fields.seoDescription || item.fields.excerpt || '',
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug) {
  if (!isContentfulConfigured) {
    console.warn('Contentful credentials not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables.');
    return null;
  }

  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2,
      limit: 1,
    });

    if (response.items.length === 0) {
      return null;
    }

    const item = response.items[0];
    return {
      id: item.sys.id,
      title: item.fields.title || '',
      slug: item.fields.slug || '',
      excerpt: item.fields.excerpt || extractRichTextContent(item.fields.content).substring(0, 200),
      content: item.fields.content, // Keep as rich text object
      author: item.fields.author || 'GA4 Helper Team',
      publishDate: item.fields.publishDate || new Date().toISOString(),
      category: item.fields.category || '',
      featuredImage: item.fields.featuredImage ? {
        url: `https:${item.fields.featuredImage.fields.file.url}`,
        alt: item.fields.featuredImage.fields.description || item.fields.title || '',
      } : null,
      tags: item.fields.tags || [],
      seoTitle: item.fields.seoTitle || item.fields.title || '',
      seoDescription: item.fields.seoDescription || item.fields.excerpt || '',
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Fetch blog posts by category
export async function getBlogPostsByCategory(category) {
  if (!isContentfulConfigured) {
    console.warn('Contentful credentials not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables.');
    return [];
  }

  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.category': category,
      order: '-fields.publishDate',
      include: 2,
    });

    return response.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title || '',
      slug: item.fields.slug || '',
      excerpt: item.fields.excerpt || extractRichTextContent(item.fields.content).substring(0, 200),
      author: item.fields.author || 'GA4 Helper Team',
      publishDate: item.fields.publishDate || new Date().toISOString(),
      category: item.fields.category || '',
      featuredImage: item.fields.featuredImage ? {
        url: `https:${item.fields.featuredImage.fields.file.url}`,
        alt: item.fields.featuredImage.fields.description || item.fields.title || '',
      } : null,
      tags: item.fields.tags || [],
    }));
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

// Fetch all categories
export async function getCategories() {
  if (!isContentfulConfigured) {
    console.warn('Contentful credentials not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables.');
    return [];
  }

  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      select: 'fields.category',
    });

    const categories = [...new Set(response.items.map(item => item.fields.category))];
    return categories.filter(Boolean);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
