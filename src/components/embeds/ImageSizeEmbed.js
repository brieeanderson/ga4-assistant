import React from 'react';

export default function ImageSizeEmbed({ imageUrl, imageAlt, imageTitle, size, caption }) {
  const getSizeClasses = (size) => {
    switch (size) {
      case 'tiny':
        return 'max-w-xs'; // 320px
      case 'small':
        return 'max-w-sm'; // 384px
      case 'medium-small':
        return 'max-w-md'; // 448px
      case 'medium':
        return 'max-w-lg'; // 512px
      case 'large':
        return 'max-w-xl'; // 576px
      case 'extra-large':
        return 'max-w-2xl'; // 672px
      case 'huge':
        return 'max-w-3xl'; // 768px
      case 'massive':
        return 'max-w-4xl'; // 896px
      case 'full':
        return 'max-w-full'; // No limit
      default:
        return 'max-w-2xl'; // Default to extra-large
    }
  };

  if (!imageUrl) return null;

  const sizeClass = getSizeClasses(size);

  return (
    <figure className="my-8">
      <img
        src={imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl}
        alt={imageAlt || imageTitle || ''}
        className={`w-full h-auto rounded-lg ${sizeClass} mx-auto`}
      />
      {(caption || imageTitle) && (
        <figcaption className="text-center text-sm text-gray-400 mt-2">
          {caption || imageTitle}
        </figcaption>
      )}
    </figure>
  );
}
