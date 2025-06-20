import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  EyeIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const initialCases = [
  {
    id: 1,
    subject: 'Support for Foster Carer',
    status: 'Open',
    caseworker: 'Sarah Brown',
    individual: 'Alice Johnson',
    activityLog: [
      { action: 'Case created', timestamp: '2024-06-01' },
      { action: 'Initial meeting', timestamp: '2024-06-03' },
    ],
    files: [],
    followUp: '2024-07-01',
  },
  {
    id: 2,
    subject: 'Child Advocacy',
    status: 'In Progress',
    caseworker: 'Mike Green',
    individual: 'Bob Smith',
    activityLog: [
      { action: 'Case created', timestamp: '2024-06-10' },
    ],
    files: [],
    followUp: '2024-07-15',
  },
];

const statuses = ['Open', 'In Progress', 'Closed'];
const caseworkers = ['Sarah Brown', 'Mike Green', 'Jane Lee'];
const individuals = ['Alice Johnson', 'Bob Smith'];

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Closed': 'bg-blue-100 text-blue-800',
};

export default function Cases() {
  const { user } = useAuth();
  const isAdminStaffCaseworker = ['admin', 'staff', 'caseworker'].includes(user?.role);
  const [cases, setCases] = useState(initialCases);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // case object
  const [form, setForm] = useState({
    id: null, subject: '', status: statuses[0], caseworker: caseworkers[0], individual: individuals[0], activityLog: [], files: [], followUp: ''
  });

  function openAdd() {
    setForm({ id: null, subject: '', status: statuses[0], caseworker: caseworkers[0], individual: individuals[0], activityLog: [], files: [], followUp: '' });
    setShowForm(true);
  }
  function openEdit(c) {
    setForm(c);
    setShowForm(true);
  }
  function handleFormChange(e) {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setForm(f => ({ ...f, files: files ? Array.from(files).map(f => f.name) : [] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    if (form.id) {
      setCases(cs => cs.map(c => c.id === form.id ? { ...form } : c));
    } else {
      setCases(cs => [...cs, { ...form, id: Date.now(), activityLog: [{ action: 'Case created', timestamp: new Date().toISOString().slice(0, 10) }] }]);
    }
    setShowForm(false);
  }
  function openDetail(c) {
    setShowDetail(c);
  }
  function closeDetail() {
    setShowDetail(null);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Cases</h1>
      {isAdminStaffCaseworker && (
        <button
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 shadow"
          onClick={openAdd}
        >
          <span className="mr-2">➕</span>Add Case
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-lg">
          <thead>
            <tr className="bg-green-50">
              <th className="px-4 py-2 text-left font-semibold text-green-900">Case ID</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Subject</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Caseworker</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Individual</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Follow-up</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="border-t hover:bg-green-50 transition">
                <td className="px-4 py-2 cursor-pointer" onClick={() => openDetail(c)}>{c.id}</td>
                <td className="px-4 py-2">{c.subject}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <UserCircleIcon className="w-7 h-7 text-blue-700 bg-blue-100 rounded-full p-1" />
                  {c.caseworker}
                </td>
                <td className="px-4 py-2">{c.individual}</td>
                <td className="px-4 py-2">{c.followUp}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2 flex items-center gap-1" onClick={() => openDetail(c)}>
                    <EyeIcon className="w-5 h-5" /> View
                  </button>
                  {isAdminStaffCaseworker && (
                    <button className="text-green-700 hover:underline flex items-center gap-1" onClick={() => openEdit(c)}>
                      <PencilSquareIcon className="w-5 h-5" /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={closeDetail}><XMarkIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg"><UserCircleIcon className="w-7 h-7" /></span>
              Case #{showDetail.id}
            </h2>
            <div className="mb-2"><b>Subject:</b> {showDetail.subject}</div>
            <div className="mb-2"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[showDetail.status]}`}>{showDetail.status}</span></div>
            <div className="mb-2 flex items-center gap-2"><b>Caseworker:</b> <UserCircleIcon className="w-7 h-7 text-blue-700 bg-blue-100 rounded-full p-1" /> {showDetail.caseworker}</div>
            <div className="mb-2"><b>Individual:</b> {showDetail.individual}</div>
            <div className="mb-2"><b>Follow-up:</b> {showDetail.followUp}</div>
            <div className="mb-2"><b>Files:</b> {showDetail.files && showDetail.files.length > 0 ? showDetail.files.join(', ') : 'None'}</div>
            <div className="mb-2"><b>Activity Log:</b>
              <ul className="list-disc ml-6">
                {showDetail.activityLog.map((log, i) => (
                  <li key={i} className="mb-1 text-gray-700"><ClockIcon className="w-4 h-4 inline-block mr-1" />{log.action} <span className="text-xs text-gray-500">({log.timestamp})</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={() => setShowForm(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Case</h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <input
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
                placeholder="Subject"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select name="caseworker" value={form.caseworker} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {caseworkers.map(cw => <option key={cw} value={cw}>{cw}</option>)}
              </select>
              <select name="individual" value={form.individual} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {individuals.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <input
                name="followUp"
                type="date"
                value={form.followUp}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="files"
                type="file"
                multiple
                onChange={handleFormChange}
                className="w-full"
              />
              <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 shadow">{form.id ? 'Update' : 'Add'} Case</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
