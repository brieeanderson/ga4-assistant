import React from 'react';

export default function IframeEmbed({ url, title, height = '400px' }) {
  return (
    <div className="my-8">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {title && (
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm text-gray-300 font-medium">{title}</p>
          </div>
        )}
        <iframe
          src={url}
          title={title || 'Embedded content'}
          className="w-full"
          style={{ height }}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
