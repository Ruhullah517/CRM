import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const initialContracts = [
  {
    id: 1,
    role: 'Trainer',
    status: 'Signed',
    freelancer: 'Anna White',
    template: 'Trainer Agreement',
    rate: '£30/hr',
    signedBy: 'Anna White',
    signedDate: '2024-06-10',
    files: ['trainer_agreement.pdf'],
  },
  {
    id: 2,
    role: 'Mentor',
    status: 'Pending',
    freelancer: 'James Black',
    template: 'Mentor Contract',
    rate: '£25/hr',
    signedBy: '',
    signedDate: '',
    files: [],
  },
];

const statuses = ['Signed', 'Pending', 'Expired'];
const roles = ['Trainer', 'Mentor'];
const freelancers = ['Anna White', 'James Black'];
const templates = ['Trainer Agreement', 'Mentor Contract'];

const statusColors = {
  Signed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Expired: 'bg-red-100 text-red-800',
};

export default function Contracts() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
  const [contracts, setContracts] = useState(initialContracts);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // contract object
  const [form, setForm] = useState({
    id: null, role: roles[0], status: statuses[0], freelancer: freelancers[0], template: templates[0], rate: '', signedBy: '', signedDate: '', files: []
  });

  function openAdd() {
    setForm({ id: null, role: roles[0], status: statuses[0], freelancer: freelancers[0], template: templates[0], rate: '', signedBy: '', signedDate: '', files: [] });
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
      setContracts(cs => cs.map(c => c.id === form.id ? { ...form } : c));
    } else {
      setContracts(cs => [...cs, { ...form, id: Date.now() }]);
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
    <div className="max-w-4xl w-full mx-auto mt-6 bg-white rounded shadow p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Contracts</h1>
      {isAdminOrStaff && (
        <button
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 shadow flex items-center gap-2"
          onClick={openAdd}
        >
          <PlusIcon className="w-5 h-5" /> Add Contract
        </button>
      )}
      <div className="overflow-x-auto rounded">
        <table className="min-w-full bg-white rounded shadow mb-8">
          <thead>
            <tr className="bg-green-50">
              <th className="px-4 py-2 text-left font-semibold text-green-900">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Role</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Freelancer</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} className="border-t hover:bg-green-50 transition">
                <td className="px-4 py-2 font-semibold">{c.name}</td>
                <td className="px-4 py-2">{c.role}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <UserCircleIcon className="w-7 h-7 text-blue-700 bg-blue-100 rounded-full p-1" />
                  {c.freelancer}
                </td>
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded shadow-lg p-4 sm:p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={closeDetail}><XMarkIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-lg">{showDetail.name[0]}</span>
              {showDetail.name}
            </h2>
            <div className="mb-2"><b>Role:</b> {showDetail.role}</div>
            <div className="mb-2"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[showDetail.status]}`}>{showDetail.status}</span></div>
            <div className="mb-2 flex items-center gap-2"><b>Freelancer:</b> <UserCircleIcon className="w-7 h-7 text-blue-700 bg-blue-100 rounded-full p-1" /> {showDetail.freelancer}</div>
            <div className="mb-2"><b>Files:</b> {showDetail.files && showDetail.files.length > 0 ? showDetail.files.join(', ') : 'None'}</div>
            <div className="mb-2"><b>Notes:</b> {showDetail.notes}</div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded shadow-lg p-4 sm:p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={() => setShowForm(false)}><XMarkIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Contract</h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Contract Name"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="role"
                value={form.role}
                onChange={handleFormChange}
                placeholder="Role"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                name="freelancer"
                value={form.freelancer}
                onChange={handleFormChange}
                placeholder="Freelancer"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="files"
                value={form.files}
                onChange={handleFormChange}
                placeholder="Files (comma separated)"
                className="w-full px-4 py-2 border rounded"
              />
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                placeholder="Notes"
                className="w-full px-4 py-2 border rounded min-h-[80px]"
              />
              <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 shadow">{form.id ? 'Update' : 'Add'} Contract</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
