import React from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Logo from '../../../components/common/Logo';

// This would typically come from your CMS or API
const blogPosts = [
  {
    title: "Welcome to GA4 Helper Blog",
    description: "Your first blog post about GA4 configuration and optimization",
    date: "2024-01-15",
    author: "GA4 Helper Team",
    tags: ["GA4", "Analytics", "Configuration"],
    slug: "welcome-to-ga4-helper-blog",
    content: `
# Welcome to GA4 Helper Blog

Welcome to the official GA4 Helper blog! Here you'll find expert insights, tips, and best practices for Google Analytics 4 configuration and optimization.

## What You'll Find Here

Our blog covers everything you need to know about GA4:

- **Configuration Best Practices**: Learn how to set up GA4 properly from day one
- **Common Issues**: Discover and fix the most common GA4 configuration problems
- **Advanced Features**: Explore advanced GA4 features and how to implement them
- **Case Studies**: Real-world examples of GA4 optimization success stories

## Why GA4 Configuration Matters

Proper GA4 configuration is crucial for:

1. **Accurate Data Collection**: Ensure you're capturing the right data
2. **Better Insights**: Get meaningful analytics that drive business decisions
3. **Cost Optimization**: Avoid wasting ad spend due to poor tracking
4. **Compliance**: Stay compliant with privacy regulations

## Stay Tuned

We'll be publishing regular content to help you master GA4 configuration. Subscribe to our newsletter to stay updated with the latest posts and GA4 news.

---

*Ready to optimize your GA4 setup? [Start your free audit today](/audit).*
    `
  }
];

export default function BlogPostPage({ params }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-black-soft flex items-center justify-center">
        <div className="text-center">
          <h1 className="logo-font text-2xl text-white mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-brand-blue hover:text-brand-blue-light">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black-soft">
      {/* Header */}
      <header className="bg-gradient-to-b from-black to-brand-black-soft border-b border-brand-blue/15 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-black/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Logo size="medium" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-brand-blue font-medium text-sm">
              Blog
            </Link>
            <Link href="/audit" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">
              Audit
            </Link>
          </nav>
        </div>
      </header>

      {/* Blog Post */}
      <article className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back to Blog */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-light mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>
            
            <h1 className="logo-font text-4xl md:text-5xl text-white mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {post.description}
            </p>
            
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex gap-2">
                {post.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="logo-font text-2xl text-white mt-8 mb-4">{paragraph.replace('# ', '')}</h2>;
                } else if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="logo-font text-xl text-white mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                } else if (paragraph.startsWith('- ')) {
                  return <li key={index} className="text-gray-300 ml-4">{paragraph.replace('- ', '')}</li>;
                } else if (paragraph.startsWith('1. ')) {
                  return <li key={index} className="text-gray-300 ml-4">{paragraph.replace(/^\d+\.\s/, '')}</li>;
                } else if (paragraph.trim() === '') {
                  return <br key={index} />;
                } else if (paragraph.startsWith('---')) {
                  return <hr key={index} className="border-gray-700 my-8" />;
                } else {
                  return <p key={index} className="text-gray-300">{paragraph}</p>;
                }
              })}
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" />
            <div className="flex items-center space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
              <span>GA4 Helper by <a href="#" className="text-brand-blue hover:text-brand-blue-light transition-colors font-medium">BEAST Analytics</a></span>
              <span>•</span>
              <span>© 2024 All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
