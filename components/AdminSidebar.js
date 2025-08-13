'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBoxOpen, FaUsers, FaClipboardList, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../lib/AuthContext';

const links = [
  { href: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
  { href: '/admin/users', label: 'Users', icon: <FaUsers /> },
  { href: '/admin/orders', label: 'Orders', icon: <FaClipboardList /> },
  { href: '/admin/profile', label: 'Profile', icon: <FaUserCircle /> },
];

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-white via-gray-50 to-gray-200 p-4 lg:p-6 flex flex-col shadow-2xl min-h-screen border-r border-gray-200">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-red-400 rounded-full p-2 shadow-lg">
            <FaUserCircle className="text-white text-2xl" />
          </div>
          <span className="text-lg font-extrabold tracking-wide text-gray-800">ATV Parts Pro</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-tr from-blue-600 to-red-400 rounded-full p-2 shadow-lg">
          <FaUserCircle className="text-white text-3xl" />
        </div>
        <span className="text-xl font-extrabold tracking-wide text-gray-800">ATV Parts Pro</span>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1">
        <div className="text-xs text-gray-400 mb-2 font-semibold tracking-wider">MAIN MENU</div>
        <ul className="mb-4">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                className={`group py-3 px-3 rounded-xl mb-2 font-medium cursor-pointer flex items-center gap-3 transition-all text-base relative ${isActive ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
              >
                <span className={`text-lg transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>{link.icon}</span>
                <Link href={link.href} className="w-full block" onClick={handleLinkClick}>
                  {link.label}
                </Link>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-500 rounded-full"></span>}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account & Settings Section */}
      <div className="mt-auto">
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 text-red-500 text-base px-3 py-3 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors font-medium"
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
          >
            <FaSignOutAlt className="text-lg" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
} 