import React from 'react';

export default function YouTubeEmbed({ url, title }) {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const videoId = getVideoId(url);
  
  if (!videoId) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-400">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {title && (
        <p className="text-sm text-gray-400 mt-2 text-center">{title}</p>
      )}
    </div>
  );
}
