import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Trophy, Clock, BarChart2, Home, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { exams, getResultForExam } = useAuth();
  const navigate = useNavigate();

  const exam = exams.find((e) => e.id === id);
  const result = exam ? getResultForExam(exam.id) : undefined;

  if (!exam || !result) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No results found for this exam.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-[#C8102E] text-white px-4 py-2 rounded-lg text-sm">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const mins = Math.floor(result.timeSpent / 60);
  const secs = result.timeSpent % 60;

  const getGrade = (score: number) => {
    if (score >= 9) return { label: 'Outstanding', color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-200' };
    if (score >= 8) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-200' };
    if (score >= 7) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200' };
    if (score >= 5) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200' };
    return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200' };
  };

  const grade = getGrade(result.score);

  const chartData = [
    { label: 'Correct', value: result.correctAnswers, fill: '#22c55e' },
    { label: 'Incorrect', value: result.totalQuestions - result.correctAnswers, fill: '#ef4444' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9F1239] to-[#BE123C] rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-rose-300 text-sm mb-1">Exam Results</p>
            <h1 className="text-white" style={{ fontWeight: 700 }}>{exam.title}</h1>
            <p className="text-rose-200 text-sm">{exam.subject} • {exam.category}</p>
          </div>
          <div className={`${grade.bg} ${grade.ring} ring-2 rounded-xl px-5 py-3 text-center`}>
            <div className={`text-3xl ${grade.color}`} style={{ fontWeight: 800 }}>{result.score}/10</div>
            <div className={`text-sm ${grade.color}`} style={{ fontWeight: 600 }}>{grade.label}</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>{result.score}</div>
          <div className="text-xs text-gray-500">Score /10</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>{result.correctAnswers}</div>
          <div className="text-xs text-gray-500">Correct Answers</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <BarChart2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>{percentage}%</div>
          <div className="text-xs text-gray-500">Accuracy</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>{mins}:{String(secs).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">Time Spent</div>
        </div>
      </div>

      {/* Chart + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Answer Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Performance Summary</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Correct Answers</span>
                <span className="text-green-600" style={{ fontWeight: 600 }}>{result.correctAnswers}/{result.totalQuestions}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Wrong Answers</span>
                <span className="text-red-500" style={{ fontWeight: 600 }}>{result.totalQuestions - result.correctAnswers}/{result.totalQuestions}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${((result.totalQuestions - result.correctAnswers) / result.totalQuestions) * 100}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={result.status === 'completed' ? 'text-green-600' : 'text-amber-600'} style={{ fontWeight: 600 }}>
                  {result.status === 'completed' ? '✓ Completed' : '⏱ Auto-submitted'}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Submitted</span>
                <span className="text-gray-700">{new Date(result.completedAt).toLocaleString('en-GB')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question review */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Detailed Review</h3>
        <div className="space-y-4">
          {exam.questions.map((q, qi) => {
            const userAnswer = result.answers[qi];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm mb-3" style={{ fontWeight: 500 }}>
                      <span className="text-gray-400 mr-1">Q{qi + 1}.</span> {q.text}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const isUserChoice = userAnswer === oi;
                        const isCorrectOption = oi === q.correctAnswer;
                        let cls = 'border-gray-200 bg-white text-gray-600';
                        if (isCorrectOption) cls = 'border-green-400 bg-green-50 text-green-800';
                        if (isUserChoice && !isCorrectOption) cls = 'border-red-400 bg-red-50 text-red-800';
                        return (
                          <div key={oi} className={`text-xs rounded-lg border px-3 py-2 flex items-center gap-2 ${cls}`}>
                            <span style={{ fontWeight: 600 }}>{String.fromCharCode(65 + oi)}.</span>
                            <span>{opt}</span>
                            {isCorrectOption && <span className="ml-auto text-green-600">✓</span>}
                            {isUserChoice && !isCorrectOption && <span className="ml-auto text-red-500">✗</span>}
                          </div>
                        );
                      })}
                    </div>
                    {userAnswer === null && (
                      <p className="text-amber-600 text-xs mt-2">⚠️ Not answered — correct answer: {String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}</p>
                    )}
                    {q.explanation && (
                      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-[#9F1239] hover:bg-[#7D0F30] text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
          style={{ fontWeight: 600 }}
        >
          <Home className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}