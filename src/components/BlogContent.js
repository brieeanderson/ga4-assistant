import React from 'react';
import { renderRichText, renderMarkdown } from '../lib/richTextRenderer';

export default function BlogContent({ content }) {
  if (!content) {
    return (
      <div className="text-gray-400 text-center py-8">
        No content available for this post.
      </div>
    );
  }

  // Try to render as rich text first, fallback to markdown
  const richTextContent = renderRichText(content, content);
  
  if (richTextContent && typeof richTextContent !== 'string') {
    return (
      <div className="max-w-none">
        <div className="text-gray-900 leading-relaxed text-lg">
          {richTextContent}
        </div>
      </div>
    );
  }

  // Fallback to markdown rendering
  return (
    <div className="max-w-none">
      <div className="text-gray-900 leading-relaxed space-y-6 text-lg">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}
