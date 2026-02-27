import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, ChevronDown, ChevronUp, Download, Trophy, Clock, CheckCircle, XCircle, User } from 'lucide-react';

export function StudentResultsPage() {
  const { users, results, exams } = useAuth();
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [examFilter, setExamFilter] = useState('all');

  const students = users.filter((u) => u.role === 'student');

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      (s.studentId || '').toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q)
    );
  });

  const getStudentResults = (userId: string) =>
    results.filter((r) => r.userId === userId && (examFilter === 'all' || r.examId === examFilter));

  const getExam = (examId: string) => exams.find((e) => e.id === examId);

  const handleExport = (studentId: string) => {
    alert(`Export results for student ${studentId} — In production, this would download a PDF/Excel report.`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700 }}>Student Results</h1>
          <p className="text-gray-500 text-sm">View and analyze individual student performance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, student ID, or username..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
          />
        </div>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
        >
          <option value="all">All Exams</option>
          {exams.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {/* Student list */}
      <div className="space-y-3">
        {filteredStudents.map((student) => {
          const studentResults = getStudentResults(student.id);
          const avgScore = studentResults.length > 0
            ? (studentResults.reduce((s, r) => s + r.score, 0) / studentResults.length).toFixed(1)
            : null;
          const isExpanded = expandedUser === student.id;

          return (
            <div key={student.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Student header row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedUser(isExpanded ? null : student.id)}
              >
                <div className="bg-[#00205B] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-800" style={{ fontWeight: 600 }}>{student.fullName}</span>
                    {student.studentId && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{student.studentId}</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">{student.email}</span>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-center">
                  <div>
                    <div className="text-gray-800 text-sm" style={{ fontWeight: 700 }}>{studentResults.length}</div>
                    <div className="text-gray-400 text-xs">Exams</div>
                  </div>
                  {avgScore && (
                    <div>
                      <div className={`text-sm ${parseFloat(avgScore) >= 7 ? 'text-green-600' : parseFloat(avgScore) >= 5 ? 'text-amber-600' : 'text-red-500'}`} style={{ fontWeight: 700 }}>
                        {avgScore}/10
                      </div>
                      <div className="text-gray-400 text-xs">Avg Score</div>
                    </div>
                  )}
                  {studentResults.length === 0 && (
                    <span className="text-gray-300 text-xs">No attempts yet</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {studentResults.length > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleExport(student.studentId || student.id); }}
                      className="p-1.5 text-gray-400 hover:text-[#00205B] hover:bg-[#00205B]/10 rounded-lg transition-colors"
                      title="Export results"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {/* Expanded results */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 pb-4">
                  {studentResults.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">No exam results found for this student.</p>
                  ) : (
                    <div className="space-y-2 pt-3">
                      {studentResults.map((r) => {
                        const exam = getExam(r.examId);
                        const isResultExpanded = expandedResult === r.id;
                        return (
                          <div key={r.id} className="border border-gray-100 rounded-xl overflow-hidden">
                            <div
                              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => setExpandedResult(isResultExpanded ? null : r.id)}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${r.score >= 8 ? 'bg-green-100' : r.score >= 5 ? 'bg-amber-100' : 'bg-red-100'}`}>
                                <Trophy className={`w-4 h-4 ${r.score >= 8 ? 'text-green-600' : r.score >= 5 ? 'text-amber-600' : 'text-red-500'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-800 text-sm truncate" style={{ fontWeight: 500 }}>{exam?.title || 'Unknown Exam'}</p>
                                <p className="text-gray-400 text-xs">{exam?.category} • {new Date(r.completedAt).toLocaleDateString('en-GB')}</p>
                              </div>
                              <div className="flex items-center gap-4 text-center shrink-0">
                                <div>
                                  <span className={`text-sm ${r.score >= 8 ? 'text-green-600' : r.score >= 5 ? 'text-amber-600' : 'text-red-500'}`} style={{ fontWeight: 700 }}>
                                    {r.score}/10
                                  </span>
                                </div>
                                <div className="hidden sm:block">
                                  <span className="text-gray-600 text-xs">{r.correctAnswers}/{r.totalQuestions}</span>
                                  <div className="text-gray-400 text-xs">correct</div>
                                </div>
                                <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`} style={{ fontWeight: 600 }}>
                                  {r.status === 'completed' ? 'Completed' : 'Partial'}
                                </span>
                                {isResultExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                              </div>
                            </div>

                            {/* Detailed answers */}
                            {isResultExpanded && exam && (
                              <div className="border-t border-gray-100 p-3 bg-gray-50/50">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Time: {Math.floor(r.timeSpent / 60)}m {r.timeSpent % 60}s</span>
                                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> {r.correctAnswers} correct</span>
                                  <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-400" /> {r.totalQuestions - r.correctAnswers} wrong</span>
                                </div>
                                <div className="space-y-2">
                                  {exam.questions.map((q, qi) => {
                                    const userAns = r.answers[qi];
                                    const correct = userAns === q.correctAnswer;
                                    return (
                                      <div key={q.id} className={`rounded-lg p-2.5 border text-xs ${correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                                        <div className="flex items-start gap-2">
                                          {correct
                                            ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                            : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                                          <div>
                                            <span className="text-gray-700">Q{qi + 1}: {q.text}</span>
                                            <div className="mt-1 flex gap-3 text-xs flex-wrap">
                                              <span className="text-gray-500">
                                                Student answered: <strong className={correct ? 'text-green-600' : 'text-red-500'}>
                                                  {userAns !== null ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}` : 'Not answered'}
                                                </strong>
                                              </span>
                                              {!correct && (
                                                <span className="text-gray-500">
                                                  Correct: <strong className="text-green-600">{String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}</strong>
                                                </span>
                                              )}
                                            </div>
                                            {q.explanation && (
                                              <p className="mt-1 text-blue-600 text-xs italic">💡 {q.explanation}</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
