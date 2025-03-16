"use client"

import { HomeIcon, CloudSunIcon, NewspaperIcon, LineChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Weather', href: '/weather', icon: CloudSunIcon },
  { name: 'News', href: '/news', icon: NewspaperIcon },
  { name: 'Finance', href: '/finance', icon: LineChartIcon },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="h-full border-r border-gray-700">
        <div className="space-y-4 py-6">
          <div className="px-5">
            <h2 className="mb-4 text-lg font-semibold tracking-wide text-gray-300">Navigation</h2>
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-700 hover:text-white"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 transition-all duration-200 group-hover:text-white" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
