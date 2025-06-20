import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  EyeIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const initialContacts = [
  {
    id: 1,
    name: 'Foster Care Partner',
    email: 'partner@fostercare.com',
    phone: '01234 567890',
    tags: ['Partner', 'Training'],
    notes: 'Key partner for training events.',
  },
  {
    id: 2,
    name: 'Local Authority',
    email: 'la@council.gov.uk',
    phone: '09876 543210',
    tags: ['Client'],
    notes: '',
  },
];

const tagColors = {
  Partner: 'bg-blue-100 text-blue-800',
  Training: 'bg-green-100 text-green-800',
  Client: 'bg-yellow-100 text-yellow-800',
  Mentor: 'bg-purple-100 text-purple-800',
};

export default function Contacts() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // contact object
  const [form, setForm] = useState({
    id: null, name: '', email: '', phone: '', tags: [], notes: ''
  });
  const [tagInput, setTagInput] = useState('');

  function openAdd() {
    setForm({ id: null, name: '', email: '', phone: '', tags: [], notes: '' });
    setTagInput('');
    setShowForm(true);
  }
  function openEdit(contact) {
    setForm(contact);
    setTagInput('');
    setShowForm(true);
  }
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  function handleTagInput(e) {
    setTagInput(e.target.value);
  }
  function addTag(e) {
    e.preventDefault();
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput] }));
      setTagInput('');
    }
  }
  function removeTag(tag) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    if (form.id) {
      setContacts(cs => cs.map(c => c.id === form.id ? { ...form } : c));
    } else {
      setContacts(cs => [...cs, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  }
  function openDetail(contact) {
    setShowDetail(contact);
  }
  function closeDetail() {
    setShowDetail(null);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>
      {isAdminOrStaff && (
        <button
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 shadow"
          onClick={openAdd}
        >
          <span className="mr-2">➕</span>Add Contact
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-lg">
          <thead>
            <tr className="bg-green-50">
              <th className="px-4 py-2 text-left font-semibold text-green-900">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Email</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Phone</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Tags</th>
              <th className="px-4 py-2 text-left font-semibold text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t hover:bg-green-50 transition">
                <td className="px-4 py-2 cursor-pointer flex items-center gap-2" onClick={() => openDetail(c)}>
                  <span className="inline-block w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">
                    {c.name[0]}
                  </span>
                  {c.name}
                </td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2 flex flex-wrap gap-1">
                  {c.tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded text-xs font-semibold ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}>{tag}</span>
                  ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={closeDetail}><XMarkIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-lg">{showDetail.name[0]}</span>
              {showDetail.name}
            </h2>
            <div className="mb-2"><b>Email:</b> {showDetail.email}</div>
            <div className="mb-2"><b>Phone:</b> {showDetail.phone}</div>
            <div className="mb-2 flex flex-wrap gap-1"><b>Tags:</b> {showDetail.tags.map(tag => (
              <span key={tag} className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}>{tag}</span>
            ))}</div>
            <div className="mb-2"><b>Notes:</b> {showDetail.notes}</div>
          </div>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={() => setShowForm(false)}><XMarkIcon className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit' : 'Add'} Contact</h2>
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
              <input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded"
              />
              <div>
                <div className="mb-1 font-semibold">Tags</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded text-xs font-semibold ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}>
                      {tag}
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
                <form className="flex gap-2" onSubmit={addTag}>
                  <input
                    value={tagInput}
                    onChange={handleTagInput}
                    placeholder="Add tag"
                    className="px-2 py-1 border rounded"
                  />
                  <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Add</button>
                </form>
              </div>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                placeholder="Notes"
                className="w-full px-4 py-2 border rounded"
              />
              <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 shadow">{form.id ? 'Update' : 'Add'} Contact</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 