import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export function ExamPage() {
  const { id } = useParams<{ id: string }>();
  const { exams, user, addResult, getResultForExam } = useAuth();
  const navigate = useNavigate();

  const exam = exams.find((e) => e.id === id);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);

  useEffect(() => {
    if (!exam) return;
    // Redirect if already submitted
    const existing = getResultForExam(exam.id);
    if (existing) {
      navigate(`/results/${exam.id}`, { replace: true });
      return;
    }
    setAnswers(new Array(exam.questions.length).fill(null));
    setTimeLeft(exam.duration * 60);
  }, [exam?.id]);

  const submitExam = useCallback(
    (timedOut = false) => {
      if (!exam || !user || submitted) return;
      setSubmitted(true);
      const correct = answers.filter((a, i) => a === exam.questions[i].correctAnswer).length;
      const score = Math.round((correct / exam.questions.length) * 100) / 10;
      const timeSpent = exam.duration * 60 - timeLeft;
      addResult({
        id: `r_${Date.now()}`,
        examId: exam.id,
        userId: user.id,
        answers,
        score,
        totalQuestions: exam.questions.length,
        correctAnswers: correct,
        completedAt: new Date().toISOString(),
        timeSpent,
        status: timedOut ? 'incomplete' : 'completed',
      });
      if (timedOut) {
        setShowTimeUp(true);
        setTimeout(() => navigate(`/results/${exam.id}`), 3000);
      } else {
        navigate(`/results/${exam.id}`);
      }
    },
    [exam, user, answers, timeLeft, submitted, addResult, navigate]
  );

  // Timer
  useEffect(() => {
    if (!started || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, submitExam]);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Exam not found.</p>
          <button onClick={() => navigate('/dashboard')} className="bg-[#C8102E] text-white px-4 py-2 rounded-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timePercent = (timeLeft / (exam.duration * 60)) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  // Pre-exam start screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
          <div className="bg-[#9F1239] rounded-xl p-4 mb-6 text-white text-center">
            <h1 className="text-white mb-1" style={{ fontWeight: 700 }}>{exam.title}</h1>
            <p className="text-rose-200 text-sm">{exam.subject}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-[#C8102E]" style={{ fontWeight: 700, fontSize: '1.5rem' }}>{exam.questions.length}</div>
              <div className="text-gray-500 text-xs">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-[#C8102E]" style={{ fontWeight: 700, fontSize: '1.5rem' }}>{exam.duration}</div>
              <div className="text-gray-500 text-xs">Minutes</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-[#C8102E]" style={{ fontWeight: 700, fontSize: '1.5rem' }}>10</div>
              <div className="text-gray-500 text-xs">Max Score</div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span style={{ fontWeight: 600 }} className="text-sm">Instructions</span>
            </div>
            <ul className="text-amber-700 text-xs space-y-1.5 list-disc list-inside">
              <li>The exam timer starts when you click "Start Exam".</li>
              <li>Each question has one correct answer.</li>
              <li>You can navigate between questions freely.</li>
              <li>The exam auto-submits when time runs out.</li>
              <li>You cannot retake the exam after submission.</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 mb-6">{exam.description}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 600 }}>
              Back
            </button>
            <button
              onClick={() => setStarted(true)}
              className="flex-1 bg-[#C8102E] hover:bg-[#a00d24] text-white py-3 rounded-xl transition-colors text-sm"
              style={{ fontWeight: 600 }}
            >
              Start Exam →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Time up notification overlay
  if (showTimeUp) {
    return (
      <div className="min-h-screen bg-gray-900/80 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700 }}>Time's Up!</h2>
          <p className="text-gray-500 text-sm">Your exam has been submitted automatically. Redirecting to results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#9F1239] text-white px-4 py-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-sm" style={{ fontWeight: 700 }}>{exam.title}</h1>
            <p className="text-rose-200 text-xs">{answeredCount}/{exam.questions.length} answered</p>
          </div>
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 300 ? 'bg-red-600 animate-pulse' : 'bg-[#C8102E]'}`}>
            <Clock className="w-4 h-4" />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>
        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="h-1 bg-white/20 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${timeLeft < 300 ? 'bg-red-300' : 'bg-[#FFB81C]'}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Questions */}
        <div className="flex-1 space-y-6">
          {exam.questions.map((q, qi) => (
            <div key={q.id} id={`q${qi}`} className={`bg-white rounded-xl border p-6 scroll-mt-24 transition-all ${answers[qi] !== null ? 'border-green-200' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${answers[qi] !== null ? 'bg-green-500 text-white' : 'bg-[#9F1239] text-white'}`} style={{ fontWeight: 700 }}>
                  {answers[qi] !== null ? <CheckCircle className="w-4 h-4" /> : qi + 1}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed" style={{ fontWeight: 500 }}>{q.text}</p>
              </div>
              <div className="space-y-2 ml-11">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      answers[qi] === oi
                        ? 'bg-[#9F1239] border-[#9F1239] text-white'
                        : 'border-gray-100 hover:border-[#9F1239]/30 hover:bg-[#9F1239]/5'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[qi] === oi ? 'border-white bg-white' : 'border-gray-300'}`}>
                      {answers[qi] === oi && <div className="w-2.5 h-2.5 rounded-full bg-[#9F1239]" />}
                    </div>
                    <input type="radio" className="hidden" checked={answers[qi] === oi} onChange={() => {
                      const updated = [...answers];
                      updated[qi] = oi;
                      setAnswers(updated);
                    }} />
                    <span className="text-sm">{String.fromCharCode(65 + oi)}. {opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom submit */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <span style={{ fontWeight: 600 }}>{answeredCount}</span> of {exam.questions.length} questions answered
              {answeredCount < exam.questions.length && (
                <span className="text-amber-500 ml-2">({exam.questions.length - answeredCount} unanswered)</span>
              )}
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-[#C8102E] hover:bg-[#a00d24] text-white px-8 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <Send className="w-4 h-4" /> Submit Exam
            </button>
          </div>
        </div>

        {/* Sidebar: Question navigator */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
            <h3 className="text-gray-700 text-sm mb-3" style={{ fontWeight: 600 }}>Question Navigator</h3>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {exam.questions.map((_, qi) => (
                <a
                  key={qi}
                  href={`#q${qi}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                    answers[qi] !== null
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-[#9F1239]/10'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {qi + 1}
                </a>
              ))}
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <span className="text-gray-500">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gray-200" />
                <span className="text-gray-500">Unanswered ({exam.questions.length - answeredCount})</span>
              </div>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full mt-4 bg-[#C8102E] hover:bg-[#a00d24] text-white py-2 rounded-lg text-xs transition-colors"
              style={{ fontWeight: 600 }}
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 rounded-full p-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-gray-800" style={{ fontWeight: 700 }}>Submit Exam?</h3>
            </div>
            <p className="text-gray-500 text-sm mb-2">
              You have answered <strong className="text-gray-800">{answeredCount}</strong> out of <strong className="text-gray-800">{exam.questions.length}</strong> questions.
            </p>
            {answeredCount < exam.questions.length && (
              <p className="text-amber-600 text-sm mb-4">
                ⚠️ {exam.questions.length - answeredCount} question(s) are unanswered. Unanswered questions will be marked incorrect.
              </p>
            )}
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Continue Exam
              </button>
              <button
                onClick={() => { setShowConfirm(false); submitExam(false); }}
                className="flex-1 bg-[#C8102E] hover:bg-[#a00d24] text-white py-2.5 rounded-xl transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}