import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  Squares2X2Icon,
  UserGroupIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  UserCircleIcon,
  IdentificationIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'staff', 'caseworker', 'freelancer'], icon: HomeIcon },
  { name: 'Recruitment Pipeline', path: '/pipeline', roles: ['admin', 'staff'], icon: Squares2X2Icon },
  { name: 'Candidates', path: '/candidates', roles: ['admin', 'staff'], icon: UserGroupIcon },
  { name: 'Cases', path: '/cases', roles: ['admin', 'staff', 'caseworker'], icon: FolderOpenIcon },
  { name: 'Contracts', path: '/contracts', roles: ['admin', 'staff'], icon: DocumentTextIcon },
  { name: 'Freelancers', path: '/freelancers', roles: ['admin', 'freelancer'], icon: UserCircleIcon },
  { name: 'Contacts', path: '/contacts', roles: ['admin', 'staff'], icon: IdentificationIcon },
  { name: 'Email Templates', path: '/email-templates', roles: ['admin', 'staff'], icon: EnvelopeIcon },
  { name: 'Contract Templates', path: '/contract-templates', roles: ['admin', 'staff'], icon: ClipboardDocumentListIcon },
  { name: 'Mentor Management', path: '/mentors', roles: ['admin', 'staff'], icon: AcademicCapIcon },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="h-screen w-20 md:w-56 bg-green-700 text-white flex flex-col py-6 px-2 md:px-4 transition-all duration-200">
      <div className="mb-8 text-2xl font-bold text-center hidden md:block">BFCA CRM</div>
      <nav className="flex flex-col gap-2">
        {navItems
          .filter(item => role && item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 justify-center md:justify-start ${isActive ? 'bg-green-800 font-semibold' : ''}`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline-block">{item.name}</span>
              </NavLink>
            );
          })}
      </nav>
    </aside>
  );
}
