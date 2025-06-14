import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mx-4 mt-4">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <span className="text-red-300 flex-1">{error}</span>
        <button 
          onClick={onDismiss}
          className="ml-auto text-red-400 hover:text-red-300 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
