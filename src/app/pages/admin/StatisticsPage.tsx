import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MONTHLY_STATS, SCORE_DISTRIBUTION } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Download, TrendingUp, Users, Trophy, CheckCircle, Filter } from 'lucide-react';

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

export function StatisticsPage() {
  const { exams, results, users } = useAuth();
  const [selectedExam, setSelectedExam] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const students = users.filter((u) => u.role === 'student');

  const filteredResults = results.filter((r) => {
    const matchExam = selectedExam === 'all' || r.examId === selectedExam;
    let matchDate = true;
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      matchDate = new Date(r.completedAt) >= cutoff;
    }
    return matchExam && matchDate;
  });

  const totalAttempts = filteredResults.length;
  const completedCount = filteredResults.filter((r) => r.status === 'completed').length;
  const completionRate = totalAttempts > 0 ? Math.round((completedCount / totalAttempts) * 100) : 0;
  const avgScore = totalAttempts > 0
    ? (filteredResults.reduce((s, r) => s + r.score, 0) / totalAttempts).toFixed(1)
    : '0.0';
  const highScorers = filteredResults.filter((r) => r.score >= 8).length;

  // Exam participation data for bar chart
  const examParticipation = exams.map((exam) => {
    const examResults = filteredResults.filter((r) => r.examId === exam.id);
    const avg = examResults.length > 0
      ? parseFloat((examResults.reduce((s, r) => s + r.score, 0) / examResults.length).toFixed(1))
      : 0;
    return {
      name: exam.title.length > 20 ? exam.title.substring(0, 20) + '…' : exam.title,
      participants: examResults.length,
      avgScore: avg,
    };
  }).filter((e) => e.participants > 0);

  // Completion pie data
  const completionPieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Auto-submitted', value: filteredResults.filter((r) => r.status === 'incomplete').length },
  ];

  // Score distribution
  const scoreDist = SCORE_DISTRIBUTION;

  const handleExport = (type: 'pdf' | 'excel') => {
    alert(`Export as ${type.toUpperCase()} — In production, this would generate and download the report.`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700 }}>Statistics & Analytics</h1>
          <p className="text-gray-500 text-sm">Comprehensive overview of exam performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-1.5 border border-green-300 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 border border-red-300 text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00205B]/20"
        >
          <option value="all">All Exams</option>
          {exams.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00205B]/20"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Attempts', value: totalAttempts, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Average Score', value: `${avgScore}/10`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'High Scorers (≥8)', value: highScorers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`${s.bg} rounded-lg p-2.5 w-10 h-10 flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-2xl ${s.color} mb-0.5`} style={{ fontWeight: 700 }}>{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly participation line chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Monthly Participation Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="participants" stroke="#C8102E" strokeWidth={2.5} dot={{ r: 4, fill: '#C8102E' }} name="Participants" />
              <Line type="monotone" dataKey="completionRate" stroke="#00205B" strokeWidth={2} dot={{ r: 3, fill: '#00205B' }} name="Completion %" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#C8102E] inline-block" /> Participants</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#00205B] inline-block" /> Completion %</span>
          </div>
        </div>

        {/* Completion pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Completion Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={completionPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {completionPieData.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val, name) => [val, 'Students']} />
              <Bar dataKey="count" fill="#C8102E" radius={[4, 4, 0, 0]} name="Students">
                {scoreDist.map((entry, index) => {
                  const colors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a', '#15803d', '#166534'];
                  return <Cell key={index} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-exam participation */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Exam Participation & Avg Score</h3>
          {examParticipation.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={examParticipation} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={100} />
                <Tooltip />
                <Bar dataKey="participants" fill="#00205B" radius={[0, 4, 4, 0]} name="Participants" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data for selected filters</div>
          )}
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800" style={{ fontWeight: 600 }}>Detailed Results Table</h3>
          <span className="text-gray-400 text-xs">{filteredResults.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Student', 'Student ID', 'Exam', 'Score', 'Correct', 'Time', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 pb-2 pr-4" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResults.slice(0, 15).map((r) => {
                const student = users.find((u) => u.id === r.userId);
                const exam = exams.find((e) => e.id === r.examId);
                return (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 pr-4 text-gray-800 text-xs" style={{ fontWeight: 500 }}>{student?.fullName || '—'}</td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">{student?.studentId || '—'}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600 max-w-28">
                      <span className="block truncate">{exam?.title || '—'}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-sm ${r.score >= 8 ? 'text-green-600' : r.score >= 5 ? 'text-amber-600' : 'text-red-500'}`} style={{ fontWeight: 700 }}>
                        {r.score}/10
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600 text-xs">{r.correctAnswers}/{r.totalQuestions}</td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">{Math.floor(r.timeSpent / 60)}m {r.timeSpent % 60}s</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`} style={{ fontWeight: 600 }}>
                        {r.status === 'completed' ? 'Done' : 'Partial'}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">{new Date(r.completedAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredResults.length > 15 && (
            <p className="text-center text-gray-400 text-xs pt-3">Showing 15 of {filteredResults.length} results. Export for full data.</p>
          )}
        </div>
      </div>
    </div>
  );
}
