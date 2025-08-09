import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import EmbedRenderer from '../components/embeds/EmbedRenderer';
import { generateAnchorId, extractTextFromChildren } from './anchorUtils';

// Simple rich text renderer for Contentful content
export function renderRichText(content, fullContent = null) {
  if (!content) return null;

  // If content is already a string, return it as is
  if (typeof content === 'string') {
    return content;
  }

  // If it's a Contentful rich text object, use the official renderer
  if (content.content && Array.isArray(content.content)) {
    return documentToReactComponents(content, {
      renderNode: {
        // Handle embedded entries
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          const { target } = node.data;
          if (!target) return null;

          // Handle different types of embedded content
          switch (target.sys.contentType.sys.id) {
            case 'youtubeEmbed':
              return (
                <EmbedRenderer
                  embedType="youtube"
                  data={{
                    url: target.fields.url,
                    title: target.fields.title
                  }}
                />
              );
            
            case 'codeEmbed':
              return (
                <EmbedRenderer
                  embedType="code"
                  data={{
                    code: target.fields.code,
                    language: target.fields.language,
                    title: target.fields.title
                  }}
                />
              );
            
            case 'iframeEmbed':
              return (
                <EmbedRenderer
                  embedType="iframe"
                  data={{
                    url: target.fields.url,
                    title: target.fields.title,
                    height: target.fields.height
                  }}
                />
              );
            
            case 'customEmbed':
              return (
                <EmbedRenderer
                  embedType="custom"
                  data={{
                    html: target.fields.html
                  }}
                />
              );
            
            case 'tocEmbed':
              return (
                <EmbedRenderer
                  embedType="toc"
                  data={{
                    title: target.fields.title,
                    fullContent: fullContent || content
                  }}
                />
              );
            
            case 'imageSizeEmbed':
              return (
                <EmbedRenderer
                  embedType="imageSize"
                  data={{
                    imageUrl: target.fields.image?.fields?.file?.url,
                    imageAlt: target.fields.image?.fields?.description,
                    imageTitle: target.fields.image?.fields?.title,
                    size: target.fields.size,
                    caption: target.fields.caption
                  }}
                />
              );
            
            default:
              return (
                <div className="my-4 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">Unsupported embedded content</p>
                </div>
              );
          }
        },
        
        // Handle embedded assets (images, videos, etc.)
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          const { target } = node.data;
          if (!target || !target.fields) return null;

          const { file, title, description } = target.fields;
          if (!file || !file.url) return null;

          // Handle images
          if (file.contentType && file.contentType.startsWith('image/')) {
            return (
              <figure className="my-8">
                <img
                  src={`https:${file.url}`}
                  alt={description || title || ''}
                  className="w-full h-auto rounded-lg max-w-2xl mx-auto"
                />
                {title && (
                  <figcaption className="text-center text-sm text-gray-400 mt-2">
                    {title}
                  </figcaption>
                )}
              </figure>
            );
          }

          // Handle other file types
          return (
            <div className="my-4 p-4 bg-gray-800 rounded-lg">
              <a 
                href={`https:${file.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-blue hover:text-brand-blue-light underline"
              >
                {title || file.fileName || 'Download file'}
              </a>
            </div>
          );
        },

        // Handle hyperlinks
        [INLINES.HYPERLINK]: (node, children) => {
          const { uri } = node.data;
          return (
            <a
              href={uri}
              className="text-brand-blue hover:text-brand-blue-light underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },

        // Handle headings with custom styling and anchor links
        [BLOCKS.HEADING_1]: (node, children) => {
          const text = extractTextFromChildren(children);
          const id = generateAnchorId(text);
          return (
            <h1 id={id} className="text-4xl font-bold text-blue-600 mt-12 mb-6 leading-tight group">
              <a href={`#${id}`} className="hover:text-brand-blue transition-colors flex items-center group">
                {children}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue text-lg">#</span>
              </a>
            </h1>
          );
        },
        
        [BLOCKS.HEADING_2]: (node, children) => {
          const text = extractTextFromChildren(children);
          const id = generateAnchorId(text);
          return (
            <h2 id={id} className="text-3xl font-bold text-blue-600 mt-10 mb-5 leading-tight group">
              <a href={`#${id}`} className="hover:text-brand-blue transition-colors flex items-center group">
                {children}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue text-lg">#</span>
              </a>
            </h2>
          );
        },
        
        [BLOCKS.HEADING_3]: (node, children) => {
          const text = extractTextFromChildren(children);
          const id = generateAnchorId(text);
          return (
            <h3 id={id} className="text-2xl font-semibold text-blue-600 mt-8 mb-4 leading-tight group">
              <a href={`#${id}`} className="hover:text-brand-blue transition-colors flex items-center group">
                {children}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue text-lg">#</span>
              </a>
            </h3>
          );
        },

        [BLOCKS.HEADING_4]: (node, children) => {
          const text = extractTextFromChildren(children);
          const id = generateAnchorId(text);
          return (
            <h4 id={id} className="text-xl font-bold text-gray-700 mt-6 mb-3 leading-tight group">
              <a href={`#${id}`} className="hover:text-brand-blue transition-colors flex items-center group">
                {children}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue text-lg">#</span>
              </a>
            </h4>
          );
        },

        // Handle paragraphs
        [BLOCKS.PARAGRAPH]: (node, children) => (
          <p className="text-gray-800 mb-6 leading-relaxed">
            {children}
          </p>
        ),

        // Handle lists
        [BLOCKS.UL_LIST]: (node, children) => (
          <ul className="list-disc ml-6 mb-6 space-y-2">
            {children}
          </ul>
        ),

        [BLOCKS.OL_LIST]: (node, children) => (
          <ol className="list-decimal ml-6 mb-6 space-y-2">
            {children}
          </ol>
        ),

        // Handle list items
        [BLOCKS.LIST_ITEM]: (node, children) => (
          <li className="text-gray-800 leading-relaxed">
            {children}
          </li>
        ),

        // Handle blockquotes
        [BLOCKS.QUOTE]: (node, children) => (
          <blockquote className="border-l-4 border-brand-blue pl-4 italic text-gray-700 my-4">
            {children}
          </blockquote>
        ),

        // Handle code blocks
        [BLOCKS.CODE]: (node, children) => (
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-4">
            <code className="text-sm text-gray-200">
              {children}
            </code>
          </pre>
        ),
      },
    });
  }

  return content;
}

// Convert markdown-like content to React components (fallback)
export function renderMarkdown(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const lines = content.split('\n');
  const elements = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="logo-font text-3xl text-white mt-8 mb-4">
          {trimmedLine.replace('# ', '')}
        </h1>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="logo-font text-2xl text-white mt-6 mb-3">
          {trimmedLine.replace('## ', '')}
        </h2>
      );
    } else if (trimmedLine.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="logo-font text-xl text-white mt-4 mb-2">
          {trimmedLine.replace('### ', '')}
        </h3>
      );
    } else if (trimmedLine.startsWith('- ')) {
      elements.push(
        <li key={index} className="text-gray-300 ml-4 list-disc">
          {trimmedLine.replace('- ', '')}
        </li>
      );
    } else if (trimmedLine.startsWith('1. ')) {
      elements.push(
        <li key={index} className="text-gray-300 ml-4 list-decimal">
          {trimmedLine.replace(/^\d+\.\s/, '')}
        </li>
      );
    } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      elements.push(
        <strong key={index} className="font-bold text-white">
          {trimmedLine.replace(/\*\*/g, '')}
        </strong>
      );
    } else if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
      elements.push(
        <em key={index} className="italic text-gray-300">
          {trimmedLine.replace(/\*/g, '')}
        </em>
      );
    } else if (trimmedLine.startsWith('---')) {
      elements.push(
        <hr key={index} className="border-gray-700 my-8" />
      );
    } else if (trimmedLine.startsWith('[') && trimmedLine.includes('](')) {
      // Handle markdown links
      const linkMatch = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        elements.push(
          <a 
            key={index} 
            href={linkMatch[2]} 
            className="text-brand-blue hover:text-brand-blue-light underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        elements.push(
          <p key={index} className="text-gray-300">
            {trimmedLine}
          </p>
        );
      }
    } else if (trimmedLine === '') {
      elements.push(<br key={index} />);
    } else {
      elements.push(
        <p key={index} className="text-gray-300">
          {trimmedLine}
        </p>
      );
    }
  });

  return elements;
}
