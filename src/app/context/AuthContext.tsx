import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_USERS, MOCK_EXAMS, MOCK_RESULTS, User, Exam, ExamResult } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  users: User[];
  exams: Exam[];
  results: ExamResult[];
  login: (username: string, password: string) => { success: boolean; message: string };
  register: (username: string, email: string, password: string, fullName: string) => { success: boolean; message: string };
  logout: () => void;
  addExam: (exam: Exam) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  addResult: (result: ExamResult) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  getResultForExam: (examId: string) => ExamResult | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'ptit_current_user',
  USERS: 'ptit_users',
  EXAMS: 'ptit_exams',
  RESULTS: 'ptit_results',
  INITIALIZED: 'ptit_initialized',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    // Initialize localStorage with mock data on first load
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(MOCK_EXAMS));
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(MOCK_RESULTS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }

    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const storedExams = localStorage.getItem(STORAGE_KEYS.EXAMS);
    const storedResults = localStorage.getItem(STORAGE_KEYS.RESULTS);

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedExams) setExams(JSON.parse(storedExams));
    if (storedResults) setResults(JSON.parse(storedResults));
  }, []);

  const login = (username: string, password: string) => {
    const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const found = allUsers.find((u) => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid username or password.' };
  };

  const register = (username: string, email: string, password: string, fullName: string) => {
    const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (allUsers.find((u) => u.username === username)) {
      return { success: false, message: 'Username already exists.' };
    }
    if (allUsers.find((u) => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      email,
      password,
      role: 'student',
      fullName,
      studentId: `B24DCCN${String(allUsers.length).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...allUsers, newUser];
    setUsers(updated);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return { success: true, message: 'Registration successful' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const addExam = (exam: Exam) => {
    const updated = [...exams, exam];
    setExams(updated);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  };

  const updateExam = (exam: Exam) => {
    const updated = exams.map((e) => (e.id === exam.id ? exam : e));
    setExams(updated);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  };

  const deleteExam = (examId: string) => {
    const updated = exams.filter((e) => e.id !== examId);
    setExams(updated);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  };

  const addResult = (result: ExamResult) => {
    const updated = [...results, result];
    setResults(updated);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
  };

  const addUser = (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  };

  const updateUser = (updatedUser: User) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  };

  const deleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
  };

  const getResultForExam = (examId: string) => {
    if (!user) return undefined;
    const allResults: ExamResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
    return allResults.find((r) => r.examId === examId && r.userId === user.id);
  };

  return (
    <AuthContext.Provider
      value={{ user, users, exams, results, login, register, logout, addExam, updateExam, deleteExam, addResult, addUser, updateUser, deleteUser, getResultForExam }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
