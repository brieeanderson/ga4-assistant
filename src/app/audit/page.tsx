'use client';
import React from 'react';
import { Shield, CheckCircle, AlertTriangle, BarChart3, Users, Zap, ArrowRight, Globe, Database, Lock, Clock } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';
import { useRouter } from 'next/navigation';

const AuditLandingPage = () => {
  const { login, isAuthenticated, isLoading } = useOAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/audit/properties');
    }
  }, [isAuthenticated, isLoading, router]);

  const auditCategories = [
    {
      icon: Shield,
      title: "Privacy & Compliance",
      description: "GDPR-critical settings like PII redaction, Google Signals configuration, and data retention policies.",
      items: ["PII URL Redaction", "Google Signals Setup", "Data Retention Settings"]
    },
    {
      icon: BarChart3,
      title: "Data Quality",
      description: "Enhanced measurement, attribution settings, and tracking configurations for reliable data.",
      items: ["Enhanced Measurement", "Attribution Models", "Cross-Domain Tracking"]
    },
    {
      icon: Globe,
      title: "Platform Integrations",
      description: "Connections to Google Ads, Search Console, and BigQuery for comprehensive insights.",
      items: ["Google Ads Links", "Search Console Integration", "BigQuery Export", "Measurement Protocol"]
    },
    {
      icon: Users,
      title: "User Tracking",
      description: "User-ID implementation, audience configurations, and demographic data collection.",
      items: ["User-ID Tracking", "Reporting Identity", "Demographic Data", "Custom Audiences"]
    }
  ];

  const keyBenefits = [
    {
      icon: CheckCircle,
      title: "Comprehensive Coverage",
      description: "Audits 25+ critical GA4 configuration points that impact data quality and compliance."
    },
    {
      icon: AlertTriangle,
      title: "Priority-Based Scoring",
      description: "Identifies critical issues vs. nice-to-haves with weighted scoring system."
    },
    {
      icon: Database,
      title: "API-Powered Accuracy",
      description: "Uses Google Analytics Admin API for precise, real-time configuration assessment."
    },
    {
      icon: Zap,
      title: "Actionable Insights",
      description: "Provides specific recommendations with direct links to fix issues in GA4."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Professional GA4 Audit Tool</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Verify Your GA4
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Fundamentals
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive audit of your Google Analytics 4 setup to ensure reliable data collection, 
              GDPR compliance, and optimal performance. Identify critical configuration gaps before they impact your insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={login}
                disabled={isLoading}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Start Your Free Audit</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Free during beta
                </div>
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-1" />
                  Read-only access
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">
              Secure authentication • No data stored • Instant results
            </p>
          </div>
        </div>
      </div>

      {/* Why This Matters Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Why GA4 Configuration Matters
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            A poorly configured GA4 property can lead to data loss, compliance issues, and missed opportunities. 
            Our audit ensures your setup follows Google's best practices and industry standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keyBenefits.map((benefit, index) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What We Audit Section */}
      <div className="bg-gray-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Comprehensive GA4 Health Check
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our audit covers every critical aspect of your GA4 setup, from privacy compliance to advanced integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {auditCategories.map((category, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <category.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-xl mb-3">{category.title}</h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">{category.description}</p>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-400 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Audit Your GA4 Setup?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Get a comprehensive report of your GA4 configuration in minutes. Identify issues, ensure compliance, and optimize for better data quality.
          </p>
          <button
            onClick={login}
            disabled={isLoading}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Start Your Free Audit</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            This tool uses read-only access to your Google Analytics data. No data is stored or shared.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuditLandingPage; 