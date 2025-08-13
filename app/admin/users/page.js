'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../lib/AuthContext';
import { promoteCurrentUserToAdmin, ensureCurrentUserExists } from '../../../lib/promoteToAdmin';

function UserModal({ open, onClose, onSave, user, mode = 'add' }) {
  const isPreview = mode === 'preview';
  const [form, setForm] = useState(
    user || { name: '', email: '', role: 'user', status: 'active', avatar: '' }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(user);
    } else {
      setForm({ name: '', email: '', role: 'user', status: 'active', avatar: '' });
    }
  }, [user]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    if (isPreview) return;
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn relative max-h-[95vh] overflow-y-auto">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-200 rounded-t-2xl border-b sticky top-0 z-10">
          <EyeIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-700 flex-1">
            {isPreview ? 'User Preview' : user ? 'Edit User' : 'Add User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1"><PlusIcon className="h-5 w-5" /></button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-4 sm:px-6 py-4 sm:py-6"
        >
          <div className="flex flex-col items-center gap-4">
            <img
              src={form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name || 'User')}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-2"
            />
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              placeholder="Avatar URL"
              value={form.avatar}
              onChange={e => setForm({ ...form, avatar: e.target.value })}
              disabled={isPreview}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              readOnly={isPreview}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              readOnly={isPreview}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-semibold">Role</label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                disabled={isPreview}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-semibold">Status</label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                disabled={isPreview}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            {!isPreview && (
              <>
                <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition text-sm" disabled={loading}>Cancel</button>
                <button type="submit" className="group flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all font-semibold text-sm transform hover:scale-110 duration-200" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <PlusIcon className="h-5 w-5 group-hover:animate-spin" />
                  )}
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
            {isPreview && (
              <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition text-sm">Close</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Mobile User Card Component
function UserCard({ user, onEdit, onDelete, onPreview }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow user-card">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}`} 
            alt={user.name || user.email} 
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-200" 
          />
        </div>

        {/* User Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 break-words user-name" title={user.name || 'N/A'}>
                {user.name || 'N/A'}
              </h3>
              <p className="text-sm text-gray-600 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
            <div className="flex flex-col gap-1 ml-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-3">
            Created: {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview && onPreview(user)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <EyeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => onEdit && onEdit(user)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => onDelete && onDelete(user)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserTable({ users, onEdit, onDelete, onPreview, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">Avatar</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}`} 
                    alt={user.name || user.email} 
                    className="w-10 h-10 object-cover rounded-full border" 
                  />
                </td>
                <td className="p-3 font-medium">{user.name || 'N/A'}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-3 space-x-2 flex items-center">
                  <button
                    onClick={() => onPreview && onPreview(user)}
                    className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    title="Preview"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(user)}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    title="Edit"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(user)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [previewUser, setPreviewUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugLoading, setDebugLoading] = useState(false);
  const { user: currentUser, userRole } = useAuth();

  // Fetch users from Firestore
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        const userRef = doc(db, 'users', editingUser.id);
        await updateDoc(userRef, {
          ...userData,
          updatedAt: new Date()
        });
      } else {
        // Add new user
        await addDoc(collection(db, 'users'), {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.uid) {
      alert('You cannot delete your own account!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', user.id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleCreateCurrentUser = async () => {
    setDebugLoading(true);
    try {
      await ensureCurrentUserExists();
      alert('User document created successfully!');
    } catch (error) {
      console.error('Error creating user document:', error);
      alert('Error creating user document: ' + error.message);
    } finally {
      setDebugLoading(false);
    }
  };

  const handlePromoteToAdmin = async () => {
    setDebugLoading(true);
    try {
      await promoteCurrentUserToAdmin();
      alert('You have been promoted to admin! Please refresh the page.');
    } catch (error) {
      console.error('Error promoting to admin:', error);
      alert('Error promoting to admin: ' + error.message);
    } finally {
      setDebugLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    (u.name?.toLowerCase().includes(search.toLowerCase()) || 
     u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (filter ? u.role === filter : true)
  );

  const roles = Array.from(new Set(users.map(u => u.role)));

  return (
    <div className="p-4 sm:p-8 bg-white rounded-xl shadow min-h-[300px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-gray-800">User Management</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage your users below. Total users: {users.length}</p>
        </div>
        <button
          onClick={() => { setModalOpen(true); setEditingUser(null); }}
          className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all text-sm sm:text-base font-semibold transform hover:scale-110 duration-200"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-spin" />
          Add User
        </button>
      </div>

      

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="border p-3 rounded-lg w-full sm:w-1/2 lg:w-1/3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border p-3 rounded-lg w-full sm:w-1/2 lg:w-1/4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <UserTable 
        users={filteredUsers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onPreview={setPreviewUser}
        loading={loading}
      />
      <UserModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingUser(null); }}
        onSave={handleSave}
        user={editingUser}
        mode={editingUser ? 'edit' : 'add'}
      />
      <UserModal
        open={!!previewUser}
        onClose={() => setPreviewUser(null)}
        user={previewUser}
        mode="preview"
      />
    </div>
  );
} 