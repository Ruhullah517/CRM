import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import RemindersWidget from '../components/RemindersWidget';
import RecentActivityWidget from '../components/RecentActivityWidget';
import {
  CalendarDaysIcon,
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const summary = [
  { label: 'Upcoming Training Events', value: 2, icon: CalendarDaysIcon, color: 'bg-green-100', iconColor: 'text-green-700' },
  { label: 'Active Support Cases', value: 5, icon: UserGroupIcon, color: 'bg-blue-100', iconColor: 'text-blue-700' },
  { label: 'Sales Pipeline', value: 3, icon: BriefcaseIcon, color: 'bg-yellow-100', iconColor: 'text-yellow-700' },
  { label: 'Contracts in Progress', value: 4, icon: DocumentTextIcon, color: 'bg-purple-100', iconColor: 'text-purple-700' },
];

const mockEvents = [
  { date: '2024-07-01', title: 'Foster Carer Training' },
  { date: '2024-07-05', title: 'Mentor Workshop' },
];

const mockChart = [
  { label: 'Leads', value: 10, color: '#22c55e' }, // green-500
  { label: 'In Progress', value: 5, color: '#eab308' }, // yellow-500
  { label: 'Closed', value: 3, color: '#3b82f6' }, // blue-500
];

function getPieChartSegments(data, radius = 60, cx = 80, cy = 80) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  return data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    const endAngle = ((cumulative + d.value) / total) * 2 * Math.PI;
    cumulative += d.value;
    const x1 = cx + radius * Math.sin(startAngle);
    const y1 = cy - radius * Math.cos(startAngle);
    const x2 = cx + radius * Math.sin(endAngle);
    const y2 = cy - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
    return (
      <path key={d.label} d={pathData} fill={d.color} />
    );
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="mb-8 text-lg">Welcome, <span className="font-semibold">{user?.email}</span> ({user?.role})</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summary.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`flex-1 min-w-[180px] rounded-lg shadow p-6 flex items-center gap-4 ${s.color}`}>
              <div className={`rounded-full p-2 ${s.iconColor} bg-white shadow`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{s.value}</div>
                <div className="text-gray-700 font-semibold text-sm">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <RemindersWidget />
        </div>
        <div className="flex-1">
          <RecentActivityWidget />
        </div>
      </div>
      {/* Mocked Pie Chart Widget */}
      <div className="mb-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Sales Pipeline Overview</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {getPieChartSegments(mockChart)}
          </svg>
          <div>
            {mockChart.map((bar) => (
              <div key={bar.label} className="flex items-center mb-2">
                <span className="inline-block w-4 h-4 rounded mr-2" style={{ background: bar.color }}></span>
                <span className="font-semibold mr-2">{bar.label}</span>
                <span className="text-gray-500">{bar.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Mocked Calendar Widget */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Training Events</h2>
        <ul>
          {mockEvents.map((event, i) => (
            <li key={i} className="mb-2 flex items-center">
              <span className="mr-3 text-green-700">📅</span>
              <span className="font-semibold mr-2">{event.date}</span>
              <span>{event.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
