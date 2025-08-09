# GA4 Helper

Enhanced GA4 and GTM audit tool with custom dimensions, metrics, and Search Console integration. Now with Contentful-powered blog and rich embed support!

## Features

- 🔍 **GA4 Audit Tool**: Comprehensive Google Analytics 4 configuration audit
- 📊 **Custom Dimensions & Metrics**: Advanced tracking setup and validation
- 🔗 **Search Console Integration**: SEO performance monitoring
- 📝 **Contentful Blog**: Dynamic blog powered by Contentful CMS
- 🎥 **Rich Embeds**: YouTube videos, code snippets, iframes, tweets, and more
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Next.js 15**: Latest React framework with App Router
- 🚀 **Netlify Deploy**: Easy deployment and hosting

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Contentful account (for blog functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ga4-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Contentful credentials:
   ```
   CONTENTFUL_SPACE_ID=your_space_id_here
   CONTENTFUL_ACCESS_TOKEN=your_access_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Contentful Blog Setup

The blog is powered by Contentful CMS with rich embed support. Follow these steps to set it up:

1. **Create Contentful Account**
   - Sign up at [contentful.com](https://contentful.com)
   - Choose the free plan (includes 2 users, 25k records)
   - Name your space "GA4 Helper Blog"

2. **Create Content Model**
   - Go to "Content model" → "Add content type"
   - Name: `Blog Post`
   - API Identifier: `blogPost`

3. **Add Required Fields**
   See [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md) for detailed field configuration.

4. **Set Up Embeds** (Optional but Recommended)
   - Create embed content types for YouTube, code snippets, iframes, etc.
   - See [CONTENTFUL_EMBEDS.md](./CONTENTFUL_EMBEDS.md) for complete embed setup guide

5. **Get API Keys**
   - Go to Settings → API keys
   - Copy your Space ID and Content Delivery API access token
   - Add them to your `.env.local` file

6. **Create Your First Post**
   - Go to Content → Blog Post → Add entry
   - Fill in all required fields
   - Add embeds using the rich text editor
   - Publish the post

## Project Structure

```
ga4-assistant/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── blog/              # Blog pages
│   │   │   ├── [slug]/        # Individual blog posts
│   │   │   └── page.js        # Blog listing
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/            # React components
│   │   ├── common/           # Shared components
│   │   ├── embeds/           # Embed components
│   │   │   ├── YouTubeEmbed.js
│   │   │   ├── CodeEmbed.js
│   │   │   ├── IframeEmbed.js
│   │   │   ├── TweetEmbed.js
│   │   │   └── EmbedRenderer.js
│   │   └── BlogContent.js    # Blog content renderer
│   └── lib/                  # Utility functions
│       ├── contentful.js     # Contentful integration
│       └── richTextRenderer.js # Rich text rendering
├── content/                  # Static content
├── public/                   # Static assets
├── CONTENTFUL_SETUP.md      # Contentful setup guide
└── CONTENTFUL_EMBEDS.md     # Embed functionality guide
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Netlify (Recommended)

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Add environment variables** in Netlify dashboard:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`

### Vercel

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

## Blog Features

- ✅ **Dynamic content** from Contentful CMS
- ✅ **Rich embeds** - YouTube, code, iframes, tweets, custom HTML
- ✅ **SEO optimized** with meta tags and Open Graph
- ✅ **Rich text support** with markdown rendering
- ✅ **Featured images** with responsive design
- ✅ **Categories and tags** for organization
- ✅ **Author information** and publish dates
- ✅ **Responsive design** for all devices

## Embed Types Supported

- 🎥 **YouTube Videos** - Embed YouTube videos with custom styling
- 💻 **Code Snippets** - Syntax-highlighted code blocks
- 🌐 **Iframe Embeds** - External content, forms, tools
- 🐦 **Twitter/X Posts** - Embedded tweets
- 🎨 **Custom HTML** - Custom HTML content
- 📊 **Interactive Tools** - GA4 Helper tools and calculators

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ga4-assistant/issues)
- 📖 Documentation: 
  - [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md) - Basic setup
  - [CONTENTFUL_EMBEDS.md](./CONTENTFUL_EMBEDS.md) - Embed functionality

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Contentful](https://contentful.com/) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icons
