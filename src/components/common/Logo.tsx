import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
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
      <svg 
        className={`${sizeClasses[size]} mr-3`} 
        viewBox="0 0 100 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* New refined cat ears / mountain graphic */}
        <path 
          d="M15 55 L20 15 L30 25 L45 45 L50 35 L55 45 L70 25 L80 15 L85 55" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Horizontal lines */}
        <path 
          d="M10 55 L35 55 M65 55 L90 55" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
      </svg>
      <div className="flex items-baseline">
        <span className={`social-gothic brand-blue ${textSizes[size]}`}>GA4</span>
        <span className={`social-gothic text-black ml-2 ${textSizes[size]}`}>HELPER</span>
      </div>
    </div>
  );
};

export default Logo;
