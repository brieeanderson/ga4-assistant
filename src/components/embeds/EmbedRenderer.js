import React from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import CodeEmbed from './CodeEmbed';
import IframeEmbed from './IframeEmbed';
import TweetEmbed from './TweetEmbed';
import TocEmbed from './TocEmbed';
import ImageSizeEmbed from './ImageSizeEmbed';

export default function EmbedRenderer({ embedType, data }) {
  switch (embedType) {
    case 'youtube':
      return <YouTubeEmbed url={data.url} title={data.title} />;
    
    case 'code':
      return <CodeEmbed code={data.code} language={data.language} title={data.title} />;
    
    case 'iframe':
      return <IframeEmbed url={data.url} title={data.title} height={data.height} />;
    
    case 'tweet':
      return <TweetEmbed tweetId={data.tweetId} theme={data.theme} />;
    
    case 'custom':
      return (
        <div className="my-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Custom Embed</div>
          <div dangerouslySetInnerHTML={{ __html: data.html }} />
        </div>
      );
    
    case 'toc':
      return <TocEmbed content={data.fullContent} title={data.title} />;
    
    case 'imageSize':
      return (
        <ImageSizeEmbed 
          imageUrl={data.imageUrl}
          imageAlt={data.imageAlt}
          imageTitle={data.imageTitle}
          size={data.size}
          caption={data.caption}
        />
      );
    
    default:
      return (
        <div className="my-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">Unsupported embed type: {embedType}</p>
        </div>
      );
  }
}
