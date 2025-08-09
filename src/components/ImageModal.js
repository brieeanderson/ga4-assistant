'use client';

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt, imageTitle }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleReset();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Controls */}
      <div className="absolute top-4 left-4 z-60 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleZoomIn}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleReset}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200"
          title="Reset (0)"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 z-60 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-white text-sm font-medium">{Math.round(scale * 100)}%</span>
      </div>

      {/* Image container */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-none max-h-none transition-transform duration-200 select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          draggable={false}
          onClick={scale === 1 ? handleZoomIn : undefined}
        />
      </div>

      {/* Image title */}
      {imageTitle && (
        <div className="absolute bottom-4 right-4 z-60 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-white font-medium text-sm">{imageTitle}</h3>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-60 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2" onClick={(e) => e.stopPropagation()}>
        <p className="text-white text-xs text-center">
          Click to zoom • Scroll to zoom • Drag to pan • Press ESC to close • Click outside to close
        </p>
      </div>
    </div>
  );
}
