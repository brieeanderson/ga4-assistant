'use client';

import React from 'react';
import { extractHeadings } from '../../lib/anchorUtils';

export default function TocEmbed({ content, title = "Table of Contents" }) {
  if (!content) return null;

  const headings = extractHeadings(content);
  
  if (!headings.length) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        {title}
      </h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm transition-colors hover:text-blue-600 text-gray-700 hover:underline ${
                  heading.level === 1 ? 'font-semibold' :
                  heading.level === 2 ? 'ml-0 font-medium' :
                  heading.level === 3 ? 'ml-4' :
                  heading.level === 4 ? 'ml-8' :
                  'ml-12'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
