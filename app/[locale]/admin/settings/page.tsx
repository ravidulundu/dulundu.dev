import { Settings, User, Bell, Shield, Database, Globe } from 'lucide-react';

export default async function AdminSettingsPage() {

  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      color: 'blue',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure email and system notifications',
      color: 'green',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Password, two-factor authentication, and access logs',
      color: 'red',
    },
    {
      icon: Database,
      title: 'Database',
      description: 'Backup, restore, and maintenance options',
      color: 'purple',
    },
    {
      icon: Globe,
      title: 'Localization',
      description: 'Default language, timezone, and regional settings',
      color: 'orange',
    },
    {
      icon: Settings,
      title: 'System',
      description: 'Advanced system configuration and integrations',
      color: 'gray',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your application settings and preferences
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Settings Panel Coming Soon
          </h2>
        </div>
        <p className="text-gray-600">
          Advanced settings and configuration options will be available in a future update.
          For now, you can manage your content through the other admin sections.
        </p>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const colorClass = colorClasses[section.color as keyof typeof colorClasses];

          return (
            <div
              key={section.title}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-not-allowed opacity-60"
            >
              <div className={`inline-flex p-3 ${colorClass} rounded-lg mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {section.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {section.description}
              </p>
              <div className="mt-4 text-xs text-gray-500 italic">
                Coming soon
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            disabled
            className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Clear Cache
          </button>
          <button
            disabled
            className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Run Backup
          </button>
          <button
            disabled
            className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Export Data
          </button>
          <button
            disabled
            className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            System Info
          </button>
        </div>
      </div>
    </div>
  );
}
