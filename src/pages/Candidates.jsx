import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  EyeIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const initialCandidates = [
  {
    id: 1,
    name: 'Alice Johnson',
    stage: 'Assessment',
    status: 'Active',
    mentor: 'John Doe',
    email: 'alice@example.com',
    notes: 'Strong candidate.',
    documents: [],
    deadline: '2024-07-01',
  },
  {
    id: 2,
    name: 'Bob Smith',
    stage: 'Application',
    status: 'New',
    mentor: 'Jane Lee',
    email: 'bob@example.com',
    notes: '',
    documents: [],
    deadline: '2024-07-10',
  },
];

const stages = ['Inquiry', 'Application', 'Assessment', 'Mentoring', 'Final Approval'];
const statuses = ['New', 'Active', 'Paused', 'Completed'];
const mentors = ['John Doe', 'Jane Lee', 'Sarah Brown'];

const statusColors = {
  New: 'bg-gray-200 text-gray-800',
  Active: 'bg-green-100 text-green-800',
  Paused: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-blue-100 text-blue-800',
};
const stageColors = {
  Inquiry: 'bg-gray-100 text-gray-700',
  Application: 'bg-yellow-100 text-yellow-700',
  Assessment: 'bg-blue-100 text-blue-700',
  Mentoring: 'bg-purple-100 text-purple-700',
  'Final Approval': 'bg-green-100 text-green-700',
};

export default function Candidates() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
  const [candidates, setCandidates] = useState(initialCandidates);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // candidate object
  const [form, setForm] = useState({
    id: null, name: '', stage: stages[0], status: statuses[0], mentor: mentors[0], email: '', notes: '', documents: [], deadline: ''
  });

  function openAdd() {
    setForm({ id: null, name: '', stage: stages[0], status: statuses[0], mentor: mentors[0], email: '', notes: '', documents: [], deadline: '' });
    setShowForm(true);
  }
  function openEdit(candidate) {
    setForm(candidate);
    setShowForm(true);
  }
  function handleFormChange(e) {
    const { name, value, files } = e.target;
    if (name === 'documents') {
      setForm(f => ({ ...f, documents: files ? Array.from(files).map(f => f.name) : [] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    if (form.id) {
      setCandidates(cands => cands.map(c => c.id === form.id ? { ...form } : c));
    } else {
      setCandidates(cands => [...cands, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  }
  function openDetail(candidate) {
    setShowDetail(candidate);
  }
  function closeDetail() {
    setShowDetail(null);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Candidates</h1>
      {isAdminOrStaff && (
        <button
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 shadow"
          onClick={openAdd}
        >
          <span className="mr-2">➕</span>Add Candidate
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-lg">
          <thead>
            <tr className="bg-green-50">
              <th className="px-4 py-2 text-left font-semibold text-green-900">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Stage</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Mentor</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Deadline</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-t hover:bg-green-50 transition">
                <td className="px-4 py-2 cursor-pointer flex items-center gap-2" onClick={() => openDetail(c)}>
                  <span className="inline-block w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">
                    {c.name[0]}
                  </span>
                  {c.name}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${stageColors[c.stage]}`}>{c.stage}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <UserCircleIcon className="w-7 h-7 text-blue-700 bg-blue-100 rounded-full p-1" />
                  {c.mentor}
                </td>
                <td className="px-4 py-2">{c.deadline}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2 flex items-center gap-1" onClick={() => openDetail(c)}>
                    <EyeIcon className="w-5 h-5" /> View
                  </button>
                  {isAdminOrStaff && (
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
              <span className="inline-block w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-lg">{showDetail.name[0]}</span>
              {showDetail.name}
            </h2>
            <div className="mb-2"><b>Email:</b> {showDetail.email}</div>
            <div className="mb-2"><b>Stage:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${stageColors[showDetail.stage]}`}>{showDetail.stage}</span></div>
            <div className="mb-2"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[showDetail.status]}`}>{showDetail.status}</span></div>
            <div className="mb-2 flex items-center gap-2"><b>Mentor:</b> <UserCircleIcon className="w-7 h-7 text-blue-700 bg-blue-100 rounded-full p-1" /> {showDetail.mentor}</div>
            <div className="mb-2"><b>Deadline:</b> {showDetail.deadline}</div>
            <div className="mb-2"><b>Notes:</b> {showDetail.notes}</div>
            <div className="mb-2"><b>Documents:</b> {showDetail.documents && showDetail.documents.length > 0 ? showDetail.documents.join(', ') : 'None'}</div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={() => setShowForm(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Candidate</h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Name"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <select name="stage" value={form.stage} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select name="mentor" value={form.mentor} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {mentors.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                placeholder="Notes"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                name="documents"
                type="file"
                multiple
                onChange={handleFormChange}
                className="w-full"
              />
              <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 shadow">{form.id ? 'Update' : 'Add'} Candidate</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
