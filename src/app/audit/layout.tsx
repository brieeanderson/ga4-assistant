import React from 'react';
import Link from 'next/link';
import { Shield, Home } from 'lucide-react';

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <div className="flex items-center space-x-2 text-blue-400">
                <Shield className="h-4 w-4" />
                <span className="font-medium">GA4 Audit Tool</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Professional GA4 Configuration Audit
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
} 