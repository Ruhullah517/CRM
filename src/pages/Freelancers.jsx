import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  EyeIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const initialFreelancers = [
  {
    id: 1,
    name: 'Anna White',
    role: 'Trainer',
    status: 'Active',
    availability: 'Available',
    email: 'anna@example.com',
    skills: 'Training, Mentoring',
    complianceDocs: ['dbs.pdf', 'id.pdf'],
    assignments: ['Case 1'],
  },
  {
    id: 2,
    name: 'James Black',
    role: 'Mentor',
    status: 'Inactive',
    availability: 'Unavailable',
    email: 'james@example.com',
    skills: 'Mentoring',
    complianceDocs: [],
    assignments: [],
  },
];

const roles = ['Trainer', 'Mentor'];
const statuses = ['Active', 'Inactive'];
const availabilities = ['Available', 'Unavailable'];

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-200 text-gray-800',
};
const availabilityColors = {
  Available: 'bg-blue-100 text-blue-800',
  Unavailable: 'bg-yellow-100 text-yellow-800',
};

export default function Freelancers() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
  const isFreelancer = user?.role === 'freelancer';
  const [freelancers, setFreelancers] = useState(initialFreelancers);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // freelancer object
  const [form, setForm] = useState({
    id: null, name: '', role: roles[0], status: statuses[0], availability: availabilities[0], email: '', skills: '', complianceDocs: [], assignments: []
  });

  function openAdd() {
    setForm({ id: null, name: '', role: roles[0], status: statuses[0], availability: availabilities[0], email: '', skills: '', complianceDocs: [], assignments: [] });
    setShowForm(true);
  }
  function openEdit(f) {
    setForm(f);
    setShowForm(true);
  }
  function handleFormChange(e) {
    const { name, value, files } = e.target;
    if (name === 'complianceDocs') {
      setForm(f => ({ ...f, complianceDocs: files ? Array.from(files).map(f => f.name) : [] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    if (form.id) {
      setFreelancers(fs => fs.map(f => f.id === form.id ? { ...form } : f));
    } else {
      setFreelancers(fs => [...fs, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  }
  function openDetail(f) {
    setShowDetail(f);
  }
  function closeDetail() {
    setShowDetail(null);
  }

  // Freelancers can only edit their own profile
  const canEdit = (freelancer) => {
    if (isAdminOrStaff) return true;
    if (isFreelancer && user.email === freelancer.email) return true;
    return false;
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Freelancers</h1>
      {isAdminOrStaff && (
        <button
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 shadow"
          onClick={openAdd}
        >
          <span className="mr-2">➕</span>Add Freelancer
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-lg">
          <thead>
            <tr className="bg-green-50">
              <th className="px-4 py-2 text-left font-semibold text-green-900">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Role</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Availability</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Email</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {freelancers.map((f) => (
              <tr key={f.id} className="border-t hover:bg-green-50 transition">
                <td className="px-4 py-2 cursor-pointer flex items-center gap-2" onClick={() => openDetail(f)}>
                  <span className="inline-block w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">
                    {f.name[0]}
                  </span>
                  {f.name}
                </td>
                <td className="px-4 py-2">{f.role}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[f.status]}`}>{f.status}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${availabilityColors[f.availability]}`}>{f.availability}</span>
                </td>
                <td className="px-4 py-2">{f.email}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2 flex items-center gap-1" onClick={() => openDetail(f)}>
                    <EyeIcon className="w-5 h-5" /> View
                  </button>
                  {canEdit(f) && (
                    <button className="text-green-700 hover:underline flex items-center gap-1" onClick={() => openEdit(f)}>
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
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={closeDetail}>
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-lg">
                {showDetail.name[0]}
              </span>
              {showDetail.name}
            </h2>
            <div className="mb-2"><b>Email:</b> {showDetail.email}</div>
            <div className="mb-2"><b>Role:</b> {showDetail.role}</div>
            <div className="mb-2"><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[showDetail.status]}`}>{showDetail.status}</span></div>
            <div className="mb-2"><b>Availability:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${availabilityColors[showDetail.availability]}`}>{showDetail.availability}</span></div>
            <div className="mb-2"><b>Skills:</b> {showDetail.skills}</div>
            <div className="mb-2"><b>Compliance Docs:</b> {showDetail.complianceDocs && showDetail.complianceDocs.length > 0 ? showDetail.complianceDocs.join(', ') : 'None'}</div>
            <div className="mb-2"><b>Assignments:</b> {showDetail.assignments && showDetail.assignments.length > 0 ? showDetail.assignments.join(', ') : 'None'}</div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={() => setShowForm(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Freelancer</h2>
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
              <select name="role" value={form.role} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select name="availability" value={form.availability} onChange={handleFormChange} className="w-full px-4 py-2 border rounded">
                {availabilities.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <input
                name="skills"
                value={form.skills}
                onChange={handleFormChange}
                placeholder="Skills"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                name="complianceDocs"
                type="file"
                multiple
                onChange={handleFormChange}
                className="w-full"
              />
              <input
                name="assignments"
                value={form.assignments}
                onChange={e => setForm(f => ({ ...f, assignments: e.target.value.split(',').map(s => s.trim()) }))}
                placeholder="Assignments (comma separated)"
                className="w-full px-4 py-2 border rounded"
              />
              <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 shadow">{form.id ? 'Update' : 'Add'} Freelancer</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
