# Contentful Embeds Guide

This guide shows you how to embed various types of content in your Contentful blog posts.

## 🎯 Supported Embed Types

### 1. YouTube Videos
Embed YouTube videos directly in your blog posts.

**Setup in Contentful:**
1. Go to Content Model → Add content type
2. Name: `YouTube Embed`
3. API Identifier: `youtubeEmbed`
4. Add fields:
   - **URL** (Short text, Required) - YouTube video URL
   - **Title** (Short text, Optional) - Video title/description

**Usage:**
- In your blog post content, click the "Embed entry" button
- Select "YouTube Embed"
- Paste your YouTube URL (supports various formats):
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`

### 2. Code Snippets
Embed syntax-highlighted code blocks.

**Setup in Contentful:**
1. Go to Content Model → Add content type
2. Name: `Code Embed`
3. API Identifier: `codeEmbed`
4. Add fields:
   - **Code** (Long text, Required) - Your code snippet
   - **Language** (Short text, Optional) - Programming language (e.g., javascript, python, html)
   - **Title** (Short text, Optional) - Code block title

**Usage:**
- In your blog post content, click "Embed entry"
- Select "Code Embed"
- Paste your code and specify the language

### 3. Iframe Embeds
Embed external content like forms, tools, or other websites.

**Setup in Contentful:**
1. Go to Content Model → Add content type
2. Name: `Iframe Embed`
3. API Identifier: `iframeEmbed`
4. Add fields:
   - **URL** (Short text, Required) - URL to embed
   - **Title** (Short text, Optional) - Embed title
   - **Height** (Short text, Optional) - Height in pixels (e.g., "400px")

**Usage:**
- In your blog post content, click "Embed entry"
- Select "Iframe Embed"
- Paste the URL you want to embed

### 4. Twitter/X Posts
Embed tweets from Twitter/X.

**Setup in Contentful:**
1. Go to Content Model → Add content type
2. Name: `Tweet Embed`
3. API Identifier: `tweetEmbed`
4. Add fields:
   - **Tweet ID** (Short text, Required) - Tweet ID (extract from URL)
   - **Theme** (Short text, Optional) - "light" or "dark" (default: dark)

**Usage:**
- Get the tweet ID from the URL: `https://twitter.com/username/status/1234567890`
- The tweet ID is: `1234567890`
- In your blog post, click "Embed entry" → "Tweet Embed"

### 5. Custom HTML
Embed custom HTML content.

**Setup in Contentful:**
1. Go to Content Model → Add content type
2. Name: `Custom Embed`
3. API Identifier: `customEmbed`
4. Add fields:
   - **HTML** (Long text, Required) - Your custom HTML code

**Usage:**
- In your blog post content, click "Embed entry"
- Select "Custom Embed"
- Paste your HTML code

## 🚀 How to Add Embeds to Blog Posts

### Method 1: Rich Text Editor
1. **Open your blog post** in Contentful
2. **Click in the Content field** (Rich text editor)
3. **Click the "Embed entry" button** (chain link icon)
4. **Select your embed type** from the dropdown
5. **Fill in the required fields**
6. **Save and publish**

### Method 2: Using the + Button
1. **In the rich text editor**, click the **+** button
2. **Choose "Embed entry"** from the menu
3. **Select your embed type**
4. **Configure the embed settings**
5. **Insert into your content**

## 📝 Example Blog Post with Embeds

Here's how you might structure a blog post with various embeds:

```markdown
# GA4 Configuration Best Practices

In this post, we'll cover the essential GA4 configuration steps.

## Video Tutorial

[YouTube Embed: "GA4 Setup Guide"]

## Code Example

Here's how to implement custom events:

[Code Embed: JavaScript code for custom events]

## Interactive Tool

Try our GA4 configuration checker:

[Iframe Embed: GA4 Helper Tool]

## Latest Updates

Check out our latest announcement:

[Tweet Embed: Latest GA4 news]
```

## 🎨 Customizing Embed Styles

All embeds are styled to match your site's design. You can customize the appearance by editing these files:

- `src/components/embeds/YouTubeEmbed.js` - YouTube video styling
- `src/components/embeds/CodeEmbed.js` - Code block styling
- `src/components/embeds/IframeEmbed.js` - Iframe styling
- `src/components/embeds/TweetEmbed.js` - Tweet styling

## 🔧 Advanced Configuration

### Adding New Embed Types

1. **Create a new embed component** in `src/components/embeds/`
2. **Add it to EmbedRenderer.js**
3. **Update the rich text renderer** in `src/lib/richTextRenderer.js`
4. **Create the content type** in Contentful

### Example: Adding a Spotify Embed

```javascript
// src/components/embeds/SpotifyEmbed.js
import React from 'react';

export default function SpotifyEmbed({ url, title }) {
  const getSpotifyId = (url) => {
    const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const trackId = getSpotifyId(url);
  
  if (!trackId) return <div>Invalid Spotify URL</div>;

  return (
    <div className="my-8">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="encrypted-media"
      />
    </div>
  );
}
```

## 🐛 Troubleshooting

### Embeds Not Showing
- Check that the embed content type is created in Contentful
- Verify the API identifier matches exactly
- Make sure the embed is published in Contentful

### YouTube Videos Not Loading
- Ensure the YouTube URL is valid
- Check that the video is public
- Verify the URL format is supported

### Code Not Highlighting
- Make sure the language field is set correctly
- Check that the language is supported by your syntax highlighter

### Iframes Not Working
- Verify the URL allows embedding (check X-Frame-Options header)
- Make sure the URL is accessible
- Check for CORS issues

## 📚 Additional Resources

- [Contentful Rich Text Documentation](https://www.contentful.com/developers/docs/concepts/rich-text/)
- [Contentful Embedding Content](https://www.contentful.com/developers/docs/concepts/rich-text/#embedding-content)
- [YouTube Embed API](https://developers.google.com/youtube/iframe_api_reference)
- [Twitter Embed Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview)

## 🎯 Best Practices

1. **Always provide fallbacks** for embeds that might fail to load
2. **Use descriptive titles** for better accessibility
3. **Test embeds** on different devices and screen sizes
4. **Keep embed content relevant** to your blog post
5. **Monitor embed performance** and loading times
6. **Provide alternative content** for users who can't view embeds
