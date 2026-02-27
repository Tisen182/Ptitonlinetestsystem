import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../data/mockData';
import { PlusCircle, Edit3, Trash2, Search, AlertTriangle, X, Save, User as UserIcon } from 'lucide-react';

export function UsersManagePage() {
  const { users, addUser, updateUser, deleteUser, results } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', studentId: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const students = users.filter((u) => u.role === 'student');

  const filtered = students.filter((u) => {
    const q = search.toLowerCase();
    return u.fullName.toLowerCase().includes(q) || (u.studentId || '').toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditingUser(null);
    setForm({ fullName: '', username: '', email: '', password: '', studentId: '' });
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ fullName: user.fullName, username: user.username, email: user.email, password: user.password, studentId: user.studentId || '' });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name required.';
    if (!form.username.trim()) e.username = 'Username required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.';
    if (!editingUser && form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSave = () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    if (editingUser) {
      updateUser({ ...editingUser, fullName: form.fullName, username: form.username, email: form.email, password: form.password || editingUser.password, studentId: form.studentId });
    } else {
      addUser({
        id: `u_${Date.now()}`,
        username: form.username,
        email: form.email,
        password: form.password,
        role: 'student',
        fullName: form.fullName,
        studentId: form.studentId,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    setDeleteId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700 }}>Manage Students</h1>
          <p className="text-gray-500 text-sm">{students.length} registered students</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#C8102E] hover:bg-[#a00d24] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ fontWeight: 600 }}
        >
          <PlusCircle className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, student ID, or username..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Student', 'Student ID', 'Email', 'Exams Taken', 'Avg Score', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student) => {
                const studentResults = results.filter((r) => r.userId === student.id);
                const avgScore = studentResults.length > 0
                  ? (studentResults.reduce((s, r) => s + r.score, 0) / studentResults.length).toFixed(1)
                  : '—';
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#00205B]/10 rounded-full w-8 h-8 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-[#00205B]" />
                        </div>
                        <div>
                          <div className="text-gray-800" style={{ fontWeight: 500 }}>{student.fullName}</div>
                          <div className="text-gray-400 text-xs">@{student.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{student.studentId || '—'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{student.email}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{studentResults.length}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${avgScore !== '—' ? (parseFloat(avgScore) >= 7 ? 'text-green-600' : parseFloat(avgScore) >= 5 ? 'text-amber-600' : 'text-red-500') : 'text-gray-400'}`} style={{ fontWeight: 600 }}>
                        {avgScore !== '—' ? `${avgScore}/10` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{student.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(student)}
                          className="flex items-center gap-1 bg-[#00205B]/10 hover:bg-[#00205B]/20 text-[#00205B] px-3 py-1.5 rounded-lg text-xs transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(student.id)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <UserIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No students found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800" style={{ fontWeight: 700 }}>{editingUser ? 'Edit Student' : 'Add Student'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', key: 'fullName', placeholder: 'Nguyễn Văn A' },
                { label: 'Username', key: 'username', placeholder: 'studentXX' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'student@ptit.edu.vn' },
                { label: editingUser ? 'Password (leave blank to keep)' : 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
                { label: 'Student ID', key: 'studentId', placeholder: 'B21DCCN001' },
              ].map(({ label, key, type = 'text', placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-700 mb-1" style={{ fontWeight: 600 }}>{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 ${formErrors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                  />
                  {formErrors[key] && <p className="text-red-500 text-xs mt-0.5">{formErrors[key]}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 bg-[#C8102E] hover:bg-[#a00d24] text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors" style={{ fontWeight: 600 }}>
                <Save className="w-4 h-4" /> {editingUser ? 'Update' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-gray-800" style={{ fontWeight: 700 }}>Delete Student?</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Delete "<strong>{users.find((u) => u.id === deleteId)?.fullName}</strong>"? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 text-sm" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm" style={{ fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
