import React from 'react';
import Link from 'next/link';
import { Calendar, User, Tag } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { getBlogPosts } from '../../lib/contentful';

// This function runs at build time and request time
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-brand-black-soft">
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

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="logo-font text-5xl md:text-6xl text-white mb-6">
            <span className="brand-blue">GA4 Helper</span> Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expert insights, tips, and best practices for Google Analytics 4 configuration and optimization.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="logo-font text-2xl text-white mb-4">No blog posts yet</h2>
              <p className="text-gray-300">
                We're working on some great content. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <article className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-brand-blue hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h2 className="logo-font text-2xl text-gray-900 mb-4 group-hover:text-brand-blue transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {post.featuredImage && (
                      <div className="mb-6 overflow-hidden rounded-lg">
                        <img 
                          src={post.featuredImage.url} 
                          alt={post.featuredImage.alt}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-600" />
                        <div className="flex gap-2">
                          {post.tags && post.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <span className="text-brand-blue font-medium transition-colors group-hover:text-brand-blue-light">
                        Read More →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" variant="white" />
            <div className="flex items-center space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
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
