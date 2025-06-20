import React from 'react';

const reminders = [
  { type: 'Candidate', name: 'Alice Johnson', due: '2024-07-01', task: 'Assessment Deadline' },
  { type: 'Case', name: 'Support for Foster Carer', due: '2024-07-01', task: 'Follow-up' },
  { type: 'Candidate', name: 'Bob Smith', due: '2024-07-10', task: 'Application Review' },
  { type: 'Case', name: 'Child Advocacy', due: '2024-07-15', task: 'Progress Check' },
];

const typeColors = {
  Candidate: 'bg-blue-100 text-blue-800',
  Case: 'bg-green-100 text-green-800',
};

export default function RemindersWidget() {
  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Upcoming Reminders</h2>
      <ul>
        {reminders.map((r, i) => (
          <li key={i} className="mb-3 flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${typeColors[r.type]}`}>{r.type}</span>
            <span className="font-semibold">{r.name}</span>
            <span className="text-gray-500">{r.task}</span>
            <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <span>⏰</span> {r.due}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 