import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router';
import {
  PlusCircle, Edit3, Trash2, Search, Clock, Users,
  BookOpen, Lock, Unlock, AlertTriangle,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Practice: 'bg-green-100 text-green-700',
  Midterm: 'bg-blue-100 text-blue-700',
  Final: 'bg-purple-100 text-purple-700',
  Quiz: 'bg-orange-100 text-orange-700',
};

export function ExamManagePage() {
  const { exams, results, deleteExam } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = exams.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = e.title.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: string) => {
    deleteExam(id);
    setDeleteId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700 }}>Manage Exams</h1>
          <p className="text-gray-500 text-sm">{exams.length} total exams</p>
        </div>
        <Link
          to="/admin/exams/create"
          className="flex items-center gap-2 bg-[#C8102E] hover:bg-[#a00d24] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ fontWeight: 600 }}
        >
          <PlusCircle className="w-4 h-4" /> Add New Exam
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or subject..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00205B]/20"
        >
          {['All', 'Practice', 'Quiz', 'Midterm', 'Final'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Exam</th>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Category</th>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Access</th>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Questions</th>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Duration</th>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Attempts</th>
                <th className="text-left text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Avg Score</th>
                <th className="text-right text-xs text-gray-500 px-6 py-3" style={{ fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((exam) => {
                const examResults = results.filter((r) => r.examId === exam.id);
                const avgScore = examResults.length > 0
                  ? (examResults.reduce((s, r) => s + r.score, 0) / examResults.length).toFixed(1)
                  : '—';
                return (
                  <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-gray-800" style={{ fontWeight: 500 }}>{exam.title}</div>
                      <div className="text-gray-400 text-xs">{exam.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${CATEGORY_COLORS[exam.category]}`} style={{ fontWeight: 600 }}>
                        {exam.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${exam.status === 'free' ? 'text-green-600' : 'text-amber-600'}`} style={{ fontWeight: 600 }}>
                        {exam.status === 'free' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        {exam.status === 'free' ? 'Free' : 'Scheduled'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {exam.questions.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {exam.duration} min
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {examResults.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${avgScore !== '—' ? (parseFloat(avgScore) >= 7 ? 'text-green-600' : parseFloat(avgScore) >= 5 ? 'text-amber-600' : 'text-red-500') : 'text-gray-400'}`} style={{ fontWeight: 600 }}>
                        {avgScore !== '—' ? `${avgScore}/10` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/exams/${exam.id}/edit`}
                          className="flex items-center gap-1 bg-[#00205B]/10 hover:bg-[#00205B]/20 text-[#00205B] px-3 py-1.5 rounded-lg text-xs transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(exam.id)}
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
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No exams found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-gray-800" style={{ fontWeight: 700 }}>Delete Exam?</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete "<strong>{exams.find((e) => e.id === deleteId)?.title}</strong>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
