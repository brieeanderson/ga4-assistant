import React from 'react';
import { PropertyAccess } from '@/types/ga4';
import { Users, Shield, UserCheck, UserX } from 'lucide-react';

interface PropertyAccessTableProps {
  propertyAccess: PropertyAccess[];
}

export const PropertyAccessTable: React.FC<PropertyAccessTableProps> = ({ propertyAccess }) => {
  // Debug logging
  console.log('🔍 PropertyAccessTable received data:', propertyAccess);
  console.log('🔍 PropertyAccessTable data type:', typeof propertyAccess);
  console.log('🔍 PropertyAccessTable is array:', Array.isArray(propertyAccess));
  console.log('🔍 PropertyAccessTable length:', propertyAccess?.length);
  
  if (propertyAccess && propertyAccess.length > 0) {
    console.log('🔍 PropertyAccessTable first item:', propertyAccess[0]);
  }
  const formatRole = (role: string) => {
    // Remove the 'predefinedRoles/' prefix and format nicely
    const roleName = role.replace('predefinedRoles/', '');
    return roleName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getRoleColor = (role: string) => {
    const roleName = role.toLowerCase();
    if (roleName.includes('admin')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (roleName.includes('editor')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (roleName.includes('analyst')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (roleName.includes('viewer')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (roleName.includes('no-cost') || roleName.includes('no-revenue')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getAccessTypeIcon = (accessType: string) => {
    return accessType === 'direct' ? UserCheck : UserX;
  };

  const getAccessTypeColor = (accessType: string) => {
    return accessType === 'direct' ? 'text-green-400' : 'text-blue-400';
  };

  if (!propertyAccess || propertyAccess.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Shield className="w-7 h-7 mr-3 text-purple-400" />
          Property Access
        </h3>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No direct property access found</p>
          <p className="text-gray-500 text-sm mt-2">
            Users may have inherited access from account-level permissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Shield className="w-7 h-7 mr-3 text-purple-400" />
        Property Access
      </h3>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-4">
          Users with direct access to this GA4 property and their permission levels.
        </p>
        <div className="text-sm text-gray-400">
          <strong>Note:</strong> This shows only direct property-level access. Users may also have inherited access from account-level permissions.
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Email Address</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Roles</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Access Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {propertyAccess.map((user, index) => {
              const AccessTypeIcon = getAccessTypeIcon(user.accessType);
              
              return (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role, roleIndex) => (
                        <span
                          key={roleIndex}
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}
                        >
                          {formatRole(role)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <AccessTypeIcon className={`w-4 h-4 ${getAccessTypeColor(user.accessType)}`} />
                      <span className={`text-sm font-medium ${getAccessTypeColor(user.accessType)}`}>
                        {user.accessType === 'direct' ? 'Direct' : 'Inherited'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-400">
                      {user.source || 'Property Level'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <h4 className="font-semibold text-white mb-3">Role Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                Admin
              </span>
              <span className="text-gray-300">Full access to all settings and data</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Editor
              </span>
              <span className="text-gray-300">Can modify settings and view data</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Analyst
              </span>
              <span className="text-gray-300">Can view data and create reports</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                Viewer
              </span>
              <span className="text-gray-300">Read-only access to data</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                No Cost/Revenue
              </span>
              <span className="text-gray-300">Limited access to cost/revenue data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="font-semibold text-blue-300 mb-2">🔒 Security Recommendations</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div>• Regularly review and audit user access permissions</div>
          <div>• Remove access for users who no longer need it</div>
          <div>• Use the principle of least privilege - only grant necessary permissions</div>
          <div>• Consider using account-level permissions for broader access control</div>
        </div>
      </div>
    </div>
  );
}; 