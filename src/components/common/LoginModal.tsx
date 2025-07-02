import React from 'react';
import { Shield, X } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  login: () => void;
  oauthLoading?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, login, oauthLoading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={onClose}
          aria-label="Close login modal"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect Your Google Account</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Sign in with Google to get a complete 30-point GA4 configuration audit. We use secure OAuth and never store your password.
          </p>
          <button
            onClick={login}
            disabled={oauthLoading}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide text-lg shadow-lg shadow-orange-600/25 transform hover:scale-105 disabled:opacity-50"
          >
            {oauthLoading ? 'Connecting...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
      {/* Click outside to close */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </div>
  );
};

export default LoginModal; 