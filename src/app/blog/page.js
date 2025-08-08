import React from 'react';
import Link from 'next/link';
import { Calendar, User, Tag } from 'lucide-react';
import Logo from '../../components/common/Logo';

// This would typically come from your CMS or API
const blogPosts = [
  {
    title: "Welcome to GA4 Helper Blog",
    description: "Your first blog post about GA4 configuration and optimization",
    date: "2024-01-15",
    author: "GA4 Helper Team",
    tags: ["GA4", "Analytics", "Configuration"],
    slug: "welcome-to-ga4-helper-blog"
  }
];

export default function BlogPage() {
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
          <div className="grid gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-gradient-to-br from-brand-gray-medium to-brand-gray-dark border border-brand-blue/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-all duration-300">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h2 className="logo-font text-2xl text-white mb-4">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand-blue transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {post.description}
                </p>
                
                <div className="flex items-center justify-between">
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
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-brand-blue hover:text-brand-blue-light font-medium transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
