import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  Search, Clock, Users, Trophy, BookOpen, Lock, CheckCircle,
  Filter, ChevronRight, Calendar,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Practice: 'bg-green-100 text-green-700',
  Midterm: 'bg-blue-100 text-blue-700',
  Final: 'bg-purple-100 text-purple-700',
  Quiz: 'bg-orange-100 text-orange-700',
};

const STATUS_BADGE: Record<string, string> = {
  free: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-amber-100 text-amber-700',
};

export function DashboardPage() {
  const { exams, user, getResultForExam } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const categories = ['All', 'Practice', 'Quiz', 'Midterm', 'Final'];
  const statuses = ['All', 'free', 'scheduled'];

  const filtered = exams.filter((exam) => {
    const matchSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.subject.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || exam.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || exam.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const freeExams = filtered.filter((e) => e.status === 'free');
  const scheduledExams = filtered.filter((e) => e.status === 'scheduled');

  const formatScheduled = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const ExamCard = ({ exam }: { exam: (typeof exams)[0] }) => {
    const result = getResultForExam(exam.id);
    const isCompleted = !!result;

    const handleStart = () => {
      if (isCompleted) navigate(`/results/${exam.id}`);
      else navigate(`/exam/${exam.id}`);
    };

    return (
      <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all group ${isCompleted ? 'border-green-200' : 'border-gray-200'}`}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-full ${CATEGORY_COLORS[exam.category]}`} style={{ fontWeight: 600 }}>
                {exam.category}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_BADGE[exam.status]}`} style={{ fontWeight: 600 }}>
                {exam.status === 'free' ? '🔓 Free Access' : '🔒 Scheduled'}
              </span>
              {isCompleted && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1" style={{ fontWeight: 600 }}>
                  <CheckCircle className="w-3 h-3" /> Done
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 shrink-0">{exam.subject}</span>
          </div>

          {/* Title */}
          <h3 className="text-gray-900 mb-1 group-hover:text-[#9F1239] transition-colors" style={{ fontWeight: 600 }}>
            {exam.title}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{exam.description}</p>

          {/* Scheduled time */}
          {exam.status === 'scheduled' && exam.scheduledTime && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatScheduled(exam.scheduledTime)}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {exam.duration} min
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              {exam.questions.length} questions
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {exam.totalParticipants}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Avg {exam.averageScore}/10
            </span>
          </div>

          {/* Score bar (if completed) */}
          {isCompleted && result && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Your score</span>
                <span style={{ fontWeight: 700 }} className="text-[#C8102E]">{result.score}/10</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${result.score >= 8 ? 'bg-green-500' : result.score >= 6 ? 'bg-blue-500' : result.score >= 4 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${result.score * 10}%` }}
                />
              </div>
            </div>
          )}

          {/* Action */}
          <button
            onClick={handleStart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${
              isCompleted
                ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                : exam.status === 'scheduled'
                ? 'bg-[#9F1239] hover:bg-[#7D0F30] text-white'
                : 'bg-[#C8102E] hover:bg-[#a00d24] text-white'
            }`}
            style={{ fontWeight: 600 }}
          >
            {isCompleted ? (
              <><CheckCircle className="w-4 h-4" /> View Results</>
            ) : exam.status === 'scheduled' ? (
              <><Lock className="w-4 h-4" /> Enter Exam</>
            ) : (
              <>Start Exam <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#9F1239] to-[#BE123C] rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-white mb-1" style={{ fontWeight: 700 }}>
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-rose-200 text-sm">
          {user?.studentId && <span className="mr-2">Student ID: <strong>{user.studentId}</strong></span>}
          Ready to test your knowledge today?
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by name or subject..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20 bg-gray-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
          >
            {statuses.map((s) => <option key={s}>{s === 'All' ? 'All Status' : s === 'free' ? 'Free Access' : 'Scheduled'}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No exams found matching your search.</p>
        </div>
      ) : (
        <>
          {/* Free exams */}
          {freeExams.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#C8102E] rounded-full" />
                <h2 className="text-gray-800" style={{ fontWeight: 700 }}>Free Access Exams</h2>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{freeExams.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {freeExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
              </div>
            </section>
          )}

          {/* Scheduled exams */}
          {scheduledExams.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#9F1239] rounded-full" />
                <h2 className="text-gray-800" style={{ fontWeight: 700 }}>Scheduled Exams</h2>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{scheduledExams.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {scheduledExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}