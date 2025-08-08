import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
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

  return (
    <div className={`flex items-center cursor-pointer transition-transform duration-300 hover:translate-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} mr-3`}>
        <svg viewBox="0 0 100 70" fill="none">
          {/* Outer M shape */}
          <path 
            d="M10 60 L25 10 L35 25 L50 45 L65 25 L75 10 L90 60" 
            stroke="white" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="square"
          />
          {/* Inner details */}
          <path 
            d="M25 10 L35 25 L50 45 L65 25 L75 10" 
            stroke="white" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="square"
          />
          {/* Base bars */}
          <path 
            d="M5 60 L30 60 M70 60 L95 60" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="square"
          />
        </svg>
      </div>
      <div className="flex items-baseline">
        <span className={`logo-font brand-blue ${textSizes[size]}`}>GA4</span>
        <span className={`logo-font text-white ml-2 ${textSizes[size]}`}>HELPER</span>
      </div>
    </div>
  );
};

export default Logo;
