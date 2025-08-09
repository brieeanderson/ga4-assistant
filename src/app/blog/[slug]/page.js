import React from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Logo from '../../../components/common/Logo';
import BlogContent from '../../../components/BlogContent';

import { getBlogPostBySlug, getBlogPosts } from '../../../lib/contentful';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - GA4 Helper Blog',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-b from-black to-brand-black-soft border-b border-brand-blue/15 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-black/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Logo size="medium" variant="white" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/#screenshot" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">
              Sample Report
            </Link>
            <Link href="/blog" className="text-brand-blue font-medium text-sm">
              Blog
            </Link>
            <button className="bg-brand-blue text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-brand-blue-dark hover:translate-y-[-2px] hover:shadow-lg hover:shadow-brand-blue/25">
              Sign In with Google
            </button>
          </nav>
        </div>
      </header>

      {/* Blog Post */}
      <article className="py-20">
        <div className="max-w-5xl mx-auto px-12">
          {/* Back to Blog */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-light mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-12 max-w-4xl">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              {post.category && (
                <div className="flex items-center gap-2">
                  <span className="bg-brand-blue/20 text-brand-blue px-2 py-1 rounded text-xs">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
            
            <h1 className="logo-font text-4xl md:text-5xl text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <div className="flex gap-2">
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <div className="max-w-4xl">
            <BlogContent content={post.content} />
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" />
            <div className="flex items-center space-x-6 text-gray-600 text-sm mt-4 md:mt-0">
              <span>GA4 Helper by <a href="https://beastanalyticsco.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:text-brand-blue-light transition-colors font-medium">BEAST Analytics</a></span>
              <span>•</span>
              <span>© 2025 All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
