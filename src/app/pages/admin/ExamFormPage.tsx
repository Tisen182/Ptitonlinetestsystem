import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Exam, Question } from '../../data/mockData';
import {
  PlusCircle, Trash2, ChevronUp, ChevronDown, Save,
  ArrowLeft, AlertCircle, CheckCircle, Upload,
} from 'lucide-react';

const emptyQuestion = (): Question => ({
  id: `q_${Date.now()}_${Math.random()}`,
  text: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
});

export function ExamFormPage() {
  const { id } = useParams<{ id: string }>();
  const { exams, addExam, updateExam } = useAuth();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    category: 'Practice' as Exam['category'],
    status: 'free' as Exam['status'],
    scheduledTime: '',
    endTime: '',
    duration: 30,
  });
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const exam = exams.find((e) => e.id === id);
      if (exam) {
        setForm({
          title: exam.title,
          description: exam.description,
          subject: exam.subject,
          category: exam.category,
          status: exam.status,
          scheduledTime: exam.scheduledTime || '',
          endTime: exam.endTime || '',
          duration: exam.duration,
        });
        setQuestions(exam.questions.map((q) => ({ ...q })));
      }
    }
  }, [id, exams]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.subject.trim()) e.subject = 'Subject code is required.';
    if (form.duration < 5) e.duration = 'Duration must be at least 5 minutes.';
    if (questions.length === 0) e.questions = 'At least one question is required.';
    questions.forEach((q, i) => {
      if (!q.text.trim()) e[`q_${i}_text`] = `Question ${i + 1}: text is required.`;
      q.options.forEach((opt, oi) => {
        if (!opt.trim()) e[`q_${i}_opt_${oi}`] = `Question ${i + 1}: Option ${String.fromCharCode(65 + oi)} is required.`;
      });
    });
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const examData: Exam = {
      id: isEdit ? id! : `exam_${Date.now()}`,
      title: form.title,
      description: form.description,
      subject: form.subject,
      category: form.category,
      status: form.status,
      scheduledTime: form.status === 'scheduled' ? form.scheduledTime : undefined,
      endTime: form.status === 'scheduled' ? form.endTime : undefined,
      duration: form.duration,
      questions,
      totalParticipants: isEdit ? (exams.find((e) => e.id === id)?.totalParticipants || 0) : 0,
      completionRate: isEdit ? (exams.find((e) => e.id === id)?.completionRate || 0) : 0,
      averageScore: isEdit ? (exams.find((e) => e.id === id)?.averageScore || 0) : 0,
      createdAt: isEdit ? (exams.find((e) => e.id === id)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    };

    if (isEdit) updateExam(examData);
    else addExam(examData);
    setSaved(true);
    setTimeout(() => navigate('/admin/exams'), 1500);
  };

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const arr = [...questions];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setQuestions(arr);
  };

  const updateQuestion = (idx: number, field: keyof Question, value: string | number | string[]) => {
    const arr = [...questions];
    (arr[idx] as Record<string, unknown>)[field] = value;
    setQuestions(arr);
  };

  const updateOption = (qi: number, oi: number, value: string) => {
    const arr = [...questions];
    const opts = [...arr[qi].options];
    opts[oi] = value;
    arr[qi] = { ...arr[qi], options: opts };
    setQuestions(arr);
  };

  if (saved) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-gray-800" style={{ fontWeight: 600 }}>{isEdit ? 'Exam updated!' : 'Exam created!'}</p>
          <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/exams')} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700 }}>{isEdit ? 'Edit Exam' : 'Create New Exam'}</h1>
          <p className="text-gray-500 text-sm">{isEdit ? 'Update exam details and questions' : 'Add a new exam to the system'}</p>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span style={{ fontWeight: 600 }} className="text-sm">Please fix the following errors:</span>
          </div>
          <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
            {Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Exam Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Exam Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Exam Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Introduction to Programming - Midterm"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of exam content and objectives"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Subject Code *</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g., CSE101"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 ${errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Duration (minutes)</label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
              min={5}
              max={240}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 ${errors.duration ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Exam['category'] })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
            >
              {['Practice', 'Quiz', 'Midterm', 'Final'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Access Type</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Exam['status'] })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
            >
              <option value="free">Free Access</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          {form.status === 'scheduled' && (
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>Start Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledTime}
                  onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>End Time</label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-800" style={{ fontWeight: 600 }}>Questions ({questions.length})</h2>
            <p className="text-gray-400 text-xs">Each question has 4 answer choices</p>
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors" style={{ fontWeight: 600 }}>
              <Upload className="w-3.5 h-3.5" />
              Import Excel
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={() => alert('Excel import demo: In production, this would parse questions from the uploaded file.')} />
            </label>
            <button
              onClick={addQuestion}
              className="flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#a00d24] text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ fontWeight: 600 }}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>
        </div>

        {errors.questions && (
          <p className="text-red-500 text-xs mb-3">{errors.questions}</p>
        )}

        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-[#00205B] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ fontWeight: 700 }}>
                    {qi + 1}
                  </div>
                  <span className="text-gray-500 text-xs">Question {qi + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveQuestion(qi, -1)} disabled={qi === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveQuestion(qi, 1)} disabled={qi === questions.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeQuestion(qi)} className="p-1 text-red-400 hover:text-red-600 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question text */}
              <textarea
                value={q.text}
                onChange={(e) => updateQuestion(qi, 'text', e.target.value)}
                placeholder="Enter question text..."
                rows={2}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 resize-none mb-3 ${errors[`q_${qi}_text`] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuestion(qi, 'correctAnswer', oi)}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        q.correctAnswer === oi ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {q.correctAnswer === oi && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </button>
                    <span className="text-xs text-gray-500 shrink-0" style={{ fontWeight: 600 }}>{String.fromCharCode(65 + oi)}.</span>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      className={`flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 ${
                        q.correctAnswer === oi ? 'border-green-300 bg-green-50' : errors[`q_${qi}_opt_${oi}`] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                ● Click a circle to mark the correct answer (currently: <strong className="text-green-600">{String.fromCharCode(65 + q.correctAnswer)}</strong>)
              </p>

              {/* Explanation */}
              <div className="mt-2">
                <input
                  value={q.explanation || ''}
                  onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                  placeholder="Explanation (optional) — shown to students after exam"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00205B]/20 bg-gray-50"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-[#C8102E]/50 text-gray-400 hover:text-[#C8102E] rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add Another Question
        </button>
      </div>

      {/* Save */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/admin/exams')}
          className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          style={{ fontWeight: 600 }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-[#C8102E] hover:bg-[#a00d24] text-white py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          <Save className="w-4 h-4" /> {isEdit ? 'Update Exam' : 'Create Exam'}
        </button>
      </div>
    </div>
  );
}
