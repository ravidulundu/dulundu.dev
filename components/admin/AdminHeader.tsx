'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Admin</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
