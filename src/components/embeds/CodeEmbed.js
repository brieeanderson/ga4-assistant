import React from 'react';

export default function CodeEmbed({ code, language = 'javascript', title }) {
  return (
    <div className="my-8">
      {title && (
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 border-b border-gray-700">
          <p className="text-sm text-gray-300 font-medium">{title}</p>
        </div>
      )}
      <div className="bg-gray-900 rounded-b-lg overflow-hidden">
        <pre className="p-4 overflow-x-auto">
          <code className={`language-${language} text-sm text-gray-200`}>
            {code}
          </code>
        </pre>
      </div>
      {language && (
        <div className="bg-gray-800 px-3 py-1 rounded-b-lg">
          <span className="text-xs text-gray-400 uppercase">{language}</span>
        </div>
      )}
    </div>
  );
}
