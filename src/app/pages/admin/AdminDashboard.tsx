import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router';
import {
  Users, BookOpen, BarChart3, CheckCircle, TrendingUp,
  Clock, PlusCircle, ArrowRight, Trophy,
} from 'lucide-react';

export function AdminDashboard() {
  const { users, exams, results } = useAuth();

  const students = users.filter((u) => u.role === 'student');
  const totalAttempts = results.length;
  const completedResults = results.filter((r) => r.status === 'completed');
  const completionRate = totalAttempts > 0 ? Math.round((completedResults.length / totalAttempts) * 100) : 0;
  const avgScore = results.length > 0
    ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)
    : '0.0';

  const recentResults = [...results]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 8);

  const getUser = (userId: string) => users.find((u) => u.id === userId);
  const getExam = (examId: string) => exams.find((e) => e.id === examId);

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Exams', value: exams.length, icon: BookOpen, color: 'bg-[#C8102E]', bg: 'bg-red-50', text: 'text-[#C8102E]' },
    { label: 'Exam Attempts', value: totalAttempts, icon: TrendingUp, color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle, color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-600' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700 }}>Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of the PTIT Online Test System</p>
        </div>
        <Link
          to="/admin/exams/create"
          className="flex items-center gap-2 bg-[#C8102E] hover:bg-[#a00d24] text-white px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ fontWeight: 600 }}
        >
          <PlusCircle className="w-4 h-4" /> New Exam
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bg} rounded-lg p-2.5`}>
                <stat.icon className={`w-5 h-5 ${stat.text}`} />
              </div>
            </div>
            <div className={`text-2xl ${stat.text} mb-0.5`} style={{ fontWeight: 700 }}>{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Exam list summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800" style={{ fontWeight: 600 }}>Exams Overview</h3>
            <Link to="/admin/exams" className="text-[#C8102E] text-xs hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {exams.slice(0, 5).map((exam) => {
              const examResults = results.filter((r) => r.examId === exam.id);
              const avgScoreExam = examResults.length > 0
                ? (examResults.reduce((s, r) => s + r.score, 0) / examResults.length).toFixed(1)
                : '—';
              return (
                <div key={exam.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${exam.status === 'free' ? 'bg-green-400' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate" style={{ fontWeight: 500 }}>{exam.title}</p>
                    <p className="text-xs text-gray-400">{exam.category} • {examResults.length} attempts</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{avgScoreExam !== '—' ? `${avgScoreExam}/10` : '—'}</div>
                    <div className="text-xs text-gray-400">avg</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Overall Average Score</span>
                <span className="text-gray-800" style={{ fontWeight: 600 }}>{avgScore}/10</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-[#C8102E] rounded-full" style={{ width: `${parseFloat(avgScore) * 10}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Completion Rate</span>
                <span className="text-gray-800" style={{ fontWeight: 600 }}>{completionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <div className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>{avgScore}</div>
                <div className="text-gray-400 text-xs">Avg Score</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <div className="text-gray-800 text-lg" style={{ fontWeight: 700 }}>
                  {results.length > 0 ? Math.round(results.reduce((s, r) => s + r.timeSpent, 0) / results.length / 60) : 0}m
                </div>
                <div className="text-gray-400 text-xs">Avg Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800" style={{ fontWeight: 600 }}>Recent Activity</h3>
          <Link to="/admin/students" className="text-[#C8102E] text-xs hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 pb-2 pr-4" style={{ fontWeight: 600 }}>Student</th>
                <th className="text-left text-xs text-gray-400 pb-2 pr-4" style={{ fontWeight: 600 }}>Exam</th>
                <th className="text-left text-xs text-gray-400 pb-2 pr-4" style={{ fontWeight: 600 }}>Score</th>
                <th className="text-left text-xs text-gray-400 pb-2 pr-4" style={{ fontWeight: 600 }}>Status</th>
                <th className="text-left text-xs text-gray-400 pb-2" style={{ fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((r) => {
                const student = getUser(r.userId);
                const exam = getExam(r.examId);
                return (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="text-gray-800" style={{ fontWeight: 500 }}>{student?.fullName || 'Unknown'}</div>
                      <div className="text-gray-400 text-xs">{student?.studentId}</div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="text-gray-700 text-xs max-w-32 truncate">{exam?.title || 'Unknown'}</div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-sm ${r.score >= 7 ? 'text-green-600' : r.score >= 5 ? 'text-amber-600' : 'text-red-500'}`} style={{ fontWeight: 700 }}>
                        {r.score}/10
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`} style={{ fontWeight: 600 }}>
                        {r.status === 'completed' ? 'Completed' : 'Auto-submitted'}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">
                      {new Date(r.completedAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
