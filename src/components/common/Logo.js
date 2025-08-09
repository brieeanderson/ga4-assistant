import React from 'react';

const Logo = ({ size = 'medium', className = '', variant = 'auto' }) => {
  const sizeClasses = {
    small: 'w-8 h-6',
    medium: 'w-12 h-10',
    large: 'w-16 h-12'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  // Determine which logo to use based on variant
  const getLogoSrc = () => {
    if (variant === 'white') return '/logo-white.png';
    if (variant === 'black') return '/logo-black.png';
    
    // Default to black logo for auto mode (works well on most light backgrounds)
    return '/logo-black.png';
  };

  // Determine text colors based on variant
  const helperTextColor = variant === 'white' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex items-center cursor-pointer transition-transform duration-300 hover:translate-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} mr-3`}>
        <img 
          src={getLogoSrc()} 
          alt="GA4 Helper Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex items-baseline">
        <span className={`logo-font brand-blue ${textSizes[size]}`}>GA4</span>
        <span className={`logo-font ${helperTextColor} ml-2 ${textSizes[size]}`}>HELPER</span>
      </div>
    </div>
  );
};

export default Logo;
