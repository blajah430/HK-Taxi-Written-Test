import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Trophy, 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Home,
  AlertCircle,
  MapPin,
  FileText,
  Navigation,
  ShieldCheck,
  History,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Question, ExamState, Category } from './types';
import { ALL_QUESTIONS, TAXI_REGULATIONS, PLACES, ROUTES, ROAD_CODE } from './data/questions';

const EXAM_TIME_LIMIT = 45 * 60; // 45 minutes in seconds
const MISTAKES_STORAGE_KEY = 'taxi_exam_mistakes';
const CORRECT_STORAGE_KEY = 'taxi_exam_correct';

export default function App() {
  const [view, setView] = useState<'home' | 'exam' | 'result' | 'review' | 'mistakes_review'>('home');
  const [mode, setMode] = useState<'mock' | 'practice'>('mock');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean, title: string, message: string, onConfirm: () => void } | null>(null);
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isFinished: false,
    startTime: null,
    endTime: null,
  });
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_LIMIT);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState<{ isCorrect: boolean | null, selectedIdxs: number[] }>({ isCorrect: null, selectedIdxs: [] });
  const [visitCount, setVisitCount] = useState<number | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    const savedMistakes = localStorage.getItem(MISTAKES_STORAGE_KEY);
    const savedCorrect = localStorage.getItem(CORRECT_STORAGE_KEY);
    if (savedMistakes) {
      try { setMistakeIds(JSON.parse(savedMistakes)); } catch (e) { console.error(e); }
    }
    if (savedCorrect) {
      try { setCorrectIds(JSON.parse(savedCorrect)); } catch (e) { console.error(e); }
    }
  }, []);

  // Fetch visit count
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/taxi1takepass/visits/up')
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          setVisitCount(data.count);
        }
      })
      .catch(err => console.error('Failed to fetch visit count:', err));
  }, []);

  // Save progress to localStorage
  const addMistake = (id: string) => {
    setMistakeIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    // Remove from correct if it was there
    setCorrectIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter(i => i !== id);
      localStorage.setItem(CORRECT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addCorrect = (id: string) => {
    setCorrectIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(CORRECT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    // Remove from mistakes if it was there
    setMistakeIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter(i => i !== id);
      localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearMistakes = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setConfirmModal({
      show: true,
      title: '確定要清除所有錯題記錄嗎？',
      message: '此操作將永久刪除你所有的錯題記錄，且無法恢復。',
      onConfirm: () => {
        setMistakeIds([]);
        localStorage.removeItem(MISTAKES_STORAGE_KEY);
        setConfirmModal(null);
      }
    });
  };

  const clearProgress = () => {
    setConfirmModal({
      show: true,
      title: '確定要清除所有學習進度嗎？',
      message: '此操作將重置你所有的學習數據，包括已掌握題目和錯題記錄。',
      onConfirm: () => {
        setMistakeIds([]);
        setCorrectIds([]);
        localStorage.removeItem(MISTAKES_STORAGE_KEY);
        localStorage.removeItem(CORRECT_STORAGE_KEY);
        setConfirmModal(null);
      }
    });
  };

  const downloadProgress = () => {
    const data = {
      mistakeIds,
      correctIds,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxi_exam_progress_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.mistakeIds && Array.isArray(data.mistakeIds) && data.correctIds && Array.isArray(data.correctIds)) {
          if (window.confirm('導入進度將覆蓋目前的學習記錄，確定要繼續嗎？')) {
            setMistakeIds(data.mistakeIds);
            setCorrectIds(data.correctIds);
            localStorage.setItem(MISTAKES_STORAGE_KEY, JSON.stringify(data.mistakeIds));
            localStorage.setItem(CORRECT_STORAGE_KEY, JSON.stringify(data.correctIds));
            alert('進度導入成功！');
          }
        } else {
          alert('無效的進度文件格式。');
        }
      } catch (err) {
        console.error(err);
        alert('讀取文件時出錯。');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Timer logic
  useEffect(() => {
    let timer: number;
    if (view === 'exam' && mode === 'mock' && !examState.isFinished) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, mode, examState.isFinished]);

  const startExam = (examMode: 'mock' | 'practice', category: Category | 'ALL' = 'ALL') => {
    const shuffle = <T,>(array: T[]): T[] => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const prioritizeQuestions = (pool: Question[]) => {
      const neverAnswered = pool.filter(q => !mistakeIds.includes(q.id) && !correctIds.includes(q.id));
      const mistakes = pool.filter(q => mistakeIds.includes(q.id));
      const correct = pool.filter(q => correctIds.includes(q.id));
      
      const shuffledPool = [
        ...shuffle(neverAnswered),
        ...shuffle(mistakes),
        ...shuffle(correct)
      ];

      // Shuffle options for each question
      return shuffledPool.map(q => {
        const originalAnswer = q.options[q.answer];
        const shuffledOptions = shuffle(q.options);
        const newAnswerIdx = shuffledOptions.indexOf(originalAnswer);
        return {
          ...q,
          options: shuffledOptions,
          answer: newAnswerIdx
        };
      });
    };

    let questions: Question[] = [];
    if (examMode === 'mock') {
      // Official mock test: 40 Part A (30 Reg, 9 Places, 1 Route), 35 Part B (Road Code)
      const regs = prioritizeQuestions(TAXI_REGULATIONS).slice(0, 30);
      const places = prioritizeQuestions(PLACES).slice(0, 9);
      const routes = prioritizeQuestions(ROUTES).slice(0, 1);
      const roadCode = prioritizeQuestions(ROAD_CODE).slice(0, 35);
      // Shuffle the final set of questions to ensure variety in order
      questions = shuffle([...regs, ...places, ...routes, ...roadCode]);
    } else {
      // Practice mode: filter by category
      const pool = category === 'ALL' 
        ? [...ALL_QUESTIONS]
        : ALL_QUESTIONS.filter(q => q.category === category);
      
      questions = prioritizeQuestions(pool);
    }

    setExamState({
      questions,
      currentQuestionIndex: 0,
      userAnswers: new Array(questions.length).fill(null),
      isFinished: false,
      startTime: Date.now(),
      endTime: null,
    });
    setMode(examMode);
    setView('exam');
    setTimeLeft(EXAM_TIME_LIMIT);
    setPracticeFeedback({ isCorrect: null, selectedIdxs: [] });
  };

  const startMistakesReview = () => {
    const questions = ALL_QUESTIONS.filter(q => mistakeIds.includes(q.id));
    if (questions.length === 0) {
      alert('目前沒有錯題記錄！');
      return;
    }
    setExamState({
      questions,
      currentQuestionIndex: 0,
      userAnswers: new Array(questions.length).fill(null),
      isFinished: false,
      startTime: Date.now(),
      endTime: null,
    });
    setMode('practice');
    setView('exam');
    setPracticeFeedback({ isCorrect: null, selectedIdxs: [] });
  };

  const handleAnswer = (optionIndex: number) => {
    const currentQuestion = examState.questions[examState.currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.answer;

    if (mode === 'practice') {
      setPracticeFeedback(prev => ({ isCorrect, selectedIdxs: [...(prev.selectedIdxs || []), optionIndex] }));
      if (!isCorrect) {
        addMistake(currentQuestion.id);
      } else {
        addCorrect(currentQuestion.id);
        const newUserAnswers = [...examState.userAnswers];
        newUserAnswers[examState.currentQuestionIndex] = optionIndex;
        setExamState({ ...examState, userAnswers: newUserAnswers });
      }
    } else {
      const newUserAnswers = [...examState.userAnswers];
      newUserAnswers[examState.currentQuestionIndex] = optionIndex;
      setExamState({ ...examState, userAnswers: newUserAnswers });
      if (!isCorrect) {
        addMistake(currentQuestion.id);
      } else {
        addCorrect(currentQuestion.id);
      }
    }
  };

  const nextQuestion = () => {
    if (examState.currentQuestionIndex < examState.questions.length - 1) {
      setExamState({ ...examState, currentQuestionIndex: examState.currentQuestionIndex + 1 });
      setPracticeFeedback({ isCorrect: null, selectedIdxs: [] });
    }
  };

  const prevQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState({ ...examState, currentQuestionIndex: examState.currentQuestionIndex - 1 });
      setPracticeFeedback({ isCorrect: null, selectedIdxs: [] });
    }
  };

  const finishExam = () => {
    setExamState({ ...examState, isFinished: true, endTime: Date.now() });
    setView('result');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const extractLocation = (question: string, options: string[], answerIdx: number) => {
    // Remove common question patterns to get the landmark
    let location = question
      .replace('位於哪裡？', '')
      .replace('位於哪條街道？', '')
      .replace('位於哪？', '')
      .replace('下列哪一個地方位於', '')
      .replace('區？', '')
      .trim();
    
    // If the question was "Which of these is in X?", the location is the correct option
    if (question.includes('下列哪一個地方')) {
      return options[answerIdx];
    }
    
    return location;
  };

  const extractRoutePoints = (question: string) => {
    // Pattern: "由 [Start] 駛至 [End]"
    const match = question.match(/(?:若)?由\s*(.+?)\s*駛至\s*(.+?)(?:，|？|$)/);
    if (match) {
      return { 
        start: match[1].trim() + ' 香港', 
        end: match[2].trim() + ' 香港' 
      };
    }
    return null;
  };

  const stats = useMemo(() => {
    if (!examState.isFinished) return null;
    
    const partA = examState.questions.filter(q => q.category !== 'ROAD_CODE');
    const partB = examState.questions.filter(q => q.category === 'ROAD_CODE');

    const partACorrect = partA.filter((q) => {
      const globalIdx = examState.questions.indexOf(q);
      return examState.userAnswers[globalIdx] === q.answer;
    }).length;

    const partBCorrect = partB.filter((q) => {
      const globalIdx = examState.questions.indexOf(q);
      return examState.userAnswers[globalIdx] === q.answer;
    }).length;

    const partAMistakes = partA.length - partACorrect;
    const partBMistakes = partB.length - partBCorrect;

    // Passing criteria: Part A mistakes <= 6, Part B mistakes <= 5
    const isPass = partAMistakes <= 6 && partBMistakes <= 5;

    return {
      total: examState.questions.length,
      correct: partACorrect + partBCorrect,
      partA: { total: partA.length, correct: partACorrect, mistakes: partAMistakes },
      partB: { total: partB.length, correct: partBCorrect, mistakes: partBMistakes },
      isPass
    };
  }, [examState]);

  return (
    <div className="h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-red-100 overflow-hidden">
      {/* Header */}
      {view !== 'home' && (
        <header className="shrink-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowExitConfirm(true)}>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">的士筆試 1 Take Pass</h1>
          </div>
          {view === 'exam' && mode === 'mock' && (
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-stone-100 text-stone-600'}`}>
                <Timer size={16} />
                {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </header>
      )}

      <main className={`flex-1 overflow-y-auto w-full transition-all duration-500 ${
        view === 'exam' ? 'overflow-hidden' : ''
      }`}>
        <div 
          className={`mx-auto px-6 py-2 min-h-full flex flex-col ${
            (view === 'exam' && (examState.questions[examState.currentQuestionIndex]?.category === 'PLACES' || examState.questions[examState.currentQuestionIndex]?.category === 'ROUTES') && practiceFeedback.isCorrect === true)
              ? 'max-w-[1600px]' 
              : 'max-w-screen-2xl'
          }`}
        >
          <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section - Split Layout Feel */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-6">
                <div className="space-y-4 text-left">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    2026 官方同步更新
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-stone-900">
                      的士筆試<br />
                      <span className="text-red-600 italic serif">1 Take Pass</span>
                    </h2>
                    <p className="text-stone-500 text-lg max-w-md leading-relaxed font-medium">
                      收錄全港 230+ 地方試題及最新路線規劃，<br />
                      以數據驅動的學習方式，助你高效溫習。
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startExam('mock')}
                      className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold shadow-xl shadow-stone-200 flex items-center gap-3 group"
                    >
                      開始模擬考試 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <div className="flex -space-x-3 items-center">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center overflow-hidden">
                          <img src={`https://picsum.photos/seed/driver${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      <div className="pl-6 text-xs font-bold text-stone-400 uppercase tracking-widest">
                        已有 {visitCount !== null ? visitCount.toLocaleString() : '12,400+'} 位考生使用
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bento Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-xs font-black text-stone-400 uppercase tracking-widest">當前進度</div>
                        <div className="text-4xl font-black text-stone-900">{Math.round(((correctIds.length + mistakeIds.length) / Math.max(1, ALL_QUESTIONS.length)) * 100)}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">穩定提升中</div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-stone-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((correctIds.length + mistakeIds.length) / Math.max(1, ALL_QUESTIONS.length)) * 100}%` }}
                        className="h-full bg-stone-900"
                      />
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100/50 space-y-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="text-2xl font-black text-emerald-900">{correctIds.length}</div>
                    <div className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest">已掌握</div>
                  </div>
                  <div className="bg-red-50/50 p-6 rounded-[2.5rem] border border-red-100/50 space-y-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                      <AlertCircle size={20} />
                    </div>
                    <div className="text-2xl font-black text-red-900">{mistakeIds.length}</div>
                    <div className="text-[10px] font-black text-red-700/60 uppercase tracking-widest">待溫習</div>
                  </div>
                </div>
              </section>

              {/* Practice Sections */}
              <section className="space-y-8">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">專項強化練習</h3>
                    <p className="text-stone-400 text-sm font-medium">針對薄弱環節進行集中訓練</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'REGULATIONS', label: '的士則例', desc: '法規、收費與責任', icon: <FileText size={24} />, color: 'bg-blue-500' },
                    { id: 'PLACES', label: '地方試題', desc: '全港地標位置記憶', icon: <MapPin size={24} />, color: 'bg-orange-500' },
                    { id: 'ROUTES', label: '路線規劃', desc: '最直接可行路徑', icon: <Navigation size={24} />, color: 'bg-purple-500' },
                    { id: 'ROAD_CODE', label: '道路守則', desc: '交通標誌與安全', icon: <ShieldCheck size={24} />, color: 'bg-emerald-500' },
                  ].map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ y: -4 }}
                      onClick={() => startExam('practice', cat.id as Category)}
                      className="group bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm text-left hover:border-stone-900 transition-all"
                    >
                      <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${cat.color.split('-')[1]}-100`}>
                        {cat.icon}
                      </div>
                      <h4 className="text-lg font-black text-stone-900">{cat.label}</h4>
                      <p className="text-stone-400 text-xs mt-1 font-medium">{cat.desc}</p>
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-300 group-hover:text-stone-900 transition-colors">
                        開始練習 <ChevronRight size={12} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Mistakes & Review Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between min-h-[240px] relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black">錯題溫習</h3>
                        <p className="text-stone-400 text-sm">針對性攻克所有難點</p>
                      </div>
                      <button 
                        onClick={clearMistakes}
                        className="p-2 text-stone-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="mt-8 flex items-baseline gap-2">
                      <span className="text-5xl font-black text-red-500">{mistakeIds.length}</span>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">個待解決問題</span>
                    </div>
                  </div>
                  <button 
                    onClick={startMistakesReview}
                    disabled={mistakeIds.length === 0}
                    className="relative z-10 w-full py-4 bg-white text-stone-900 rounded-2xl font-black hover:bg-stone-100 transition-colors disabled:opacity-30"
                  >
                    立即重溫
                  </button>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
                </div>

                <div className="bg-stone-100 p-8 rounded-[2.5rem] flex flex-col justify-between min-h-[240px]">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-stone-900">學習數據</h3>
                    <p className="text-stone-500 text-sm font-medium">你的進步一目了然</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">已掌握</div>
                      <div className="text-2xl font-black text-stone-900">{correctIds.length}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">總題數</div>
                      <div className="text-2xl font-black text-stone-900">{ALL_QUESTIONS.length}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={downloadProgress}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-xl text-[10px] font-black text-stone-600 hover:bg-stone-50 transition-colors uppercase tracking-widest"
                    >
                      <Download size={12} /> 下載進度
                    </button>
                    <label 
                      htmlFor="import-progress"
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-xl text-[10px] font-black text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer uppercase tracking-widest"
                    >
                      <Upload size={12} /> 導入進度
                      <input
                        type="file"
                        id="import-progress"
                        className="hidden"
                        accept=".json"
                        onChange={importProgress}
                      />
                    </label>
                    <button 
                      onClick={clearProgress}
                      className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-stone-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                    >
                      <RotateCcw size={12} /> 重設
                    </button>
                  </div>
                </div>
              </section>

              {/* Exam Introduction Section */}
              <section className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="text-xl font-black text-stone-900">的士筆試簡介</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-stone-600 leading-relaxed">
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-[10px]">甲</span>
                      甲部：的士營運 (40題)
                    </h4>
                    <p>
                      包含的士則例 (30題)、地方試題 (9題) 及路線試題 (1題)。
                      考生須於四個選項中選擇一個最恰當的答案。
                      <span className="block mt-2 font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg inline-block">及格標準：不可答錯多於 6 題</span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-[10px]">乙</span>
                      乙部：道路使用者守則 (35題)
                    </h4>
                    <p>
                      考生須於三個選項中選擇一個最恰當的答案。
                      <span className="block mt-2 font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg inline-block">及格標準：不可答錯多於 5 題</span>
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-stone-500 font-medium text-center sm:text-left">
                    考生需於上述兩個部分均達到及格標準，其總成績才會被視為及格。
                  </p>
                  <a 
                    href="https://www.td.gov.hk/tc/publications_and_press_releases/publications/free_publications/index_categoryid_8.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-black text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest"
                  >
                    運輸署官方溫習資料 <ChevronRight size={14} />
                  </a>
                </div>
              </section>

              {/* Buy me a 罐罐 Section */}
              <section className="mt-16 bg-stone-900 text-white rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                <div className="relative z-10 space-y-4 max-w-md">
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight">Buy me a 罐罐 🐱</h3>
                  <p className="text-stone-400 font-medium leading-relaxed">
                    如果你覺得呢個網有用，歡迎Payme投餵小金金，讓金金實現罐罐自由！
                  </p>
                  <a 
                    href="https://payme.hsbc/0fb7da876a08476b89013125af211394" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E52443] hover:bg-[#c41e38] text-white rounded-xl font-black transition-colors shadow-lg shadow-red-900/20"
                  >
                    PayMe 贊助 <ChevronRight size={18} />
                  </a>
                </div>
                <div className="relative z-10 w-full max-w-[240px] aspect-square rounded-3xl overflow-hidden border-4 border-stone-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* Note: Please upload your cat image to the public folder and name it cat.jpg */}
                  <img 
                    src="public/Cat.png" 
                    alt="Cat" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-stone-800 rounded-full blur-3xl opacity-50 pointer-events-none" />
              </section>
            </motion.div>
          )}

          {view === 'exam' && (
            <motion.div 
              key="exam"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full space-y-3"
            >
              {/* Exam Header & Progress */}
              <header className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowExitConfirm(true)}
                        className="flex items-center gap-1 text-stone-400 hover:text-stone-900 transition-colors mr-2"
                      >
                        <ChevronLeft size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">退出</span>
                      </button>
                      <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-white text-[9px] font-black uppercase tracking-widest">
                        {mode === 'mock' ? '模擬考試' : '專項練習'}
                      </span>
                      {mode === 'mock' && (
                        <div className="flex items-center gap-1 text-stone-900 font-black text-xs">
                          <Timer size={14} className={timeLeft < 300 ? 'text-red-600 animate-pulse' : ''} />
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>
                    <h2 className="text-base font-black text-stone-900">
                      題目 {examState.currentQuestionIndex + 1} <span className="text-stone-300">/ {examState.questions.length}</span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">完成進度</div>
                    <div className="text-base font-black text-stone-900">{Math.round(((examState.currentQuestionIndex + 1) / examState.questions.length) * 100)}%</div>
                  </div>
                </div>
                <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-stone-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${((examState.currentQuestionIndex + 1) / examState.questions.length) * 100}%` }}
                  />
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 overflow-hidden">
                {/* Question Card */}
                <div className={`${(examState.questions[examState.currentQuestionIndex].category === 'PLACES' || examState.questions[examState.currentQuestionIndex].category === 'ROUTES') && practiceFeedback.isCorrect === true ? 'lg:col-span-5' : 'lg:col-span-12 max-w-2xl mx-auto w-full'} bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm space-y-4 transition-all h-full flex flex-col overflow-y-auto`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-stone-50 text-stone-400 text-[10px] font-black uppercase tracking-widest border border-stone-100">
                        {examState.questions[examState.currentQuestionIndex].category === 'REGULATIONS' && '的士則例'}
                        {examState.questions[examState.currentQuestionIndex].category === 'PLACES' && '地方試題'}
                        {examState.questions[examState.currentQuestionIndex].category === 'ROUTES' && '路線規劃'}
                        {examState.questions[examState.currentQuestionIndex].category === 'ROAD_CODE' && '道路守則'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-stone-900 leading-tight tracking-tight">
                      {examState.questions[examState.currentQuestionIndex].question}
                    </h3>
                  </div>

                  <div className="space-y-2 flex-1">
                    {examState.questions[examState.currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = examState.userAnswers[examState.currentQuestionIndex] === idx;
                      const isPracticeSelected = practiceFeedback.selectedIdxs?.includes(idx);
                      const isCorrect = idx === examState.questions[examState.currentQuestionIndex].answer;
                      
                      let buttonClass = 'border-stone-50 hover:border-stone-200 bg-stone-50/50 text-stone-600';
                      if (mode === 'practice') {
                        if (isPracticeSelected) {
                          if (isCorrect) {
                            buttonClass = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                          } else {
                            buttonClass = 'border-red-500 bg-red-50 text-red-900';
                          }
                        }
                      } else {
                        if (isSelected) buttonClass = 'border-stone-900 bg-stone-900 text-white';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={mode === 'practice' && practiceFeedback.isCorrect === true}
                          className={`w-full p-3.5 rounded-xl text-left transition-all border-2 flex items-center justify-between group font-bold ${buttonClass}`}
                        >
                          <span className="text-sm">{option}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                            ${(isPracticeSelected && isCorrect) ? 'border-emerald-500 bg-emerald-500 text-white' : 
                              (isSelected && mode !== 'practice') ? 'border-white bg-white text-stone-900' :
                              (isPracticeSelected && !isCorrect) ? 'border-red-500 bg-red-500 text-white' : 'border-stone-200 bg-white'}`}>
                            {(isSelected || (isPracticeSelected && isCorrect)) && <CheckCircle2 size={12} />}
                            {(isPracticeSelected && !isCorrect) && <XCircle size={12} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {mode === 'practice' && practiceFeedback.isCorrect === false && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 rounded-xl text-red-800 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      <AlertCircle size={16} />
                      答案錯誤，請再試一次
                    </motion.div>
                  )}

                  {mode === 'practice' && practiceFeedback.isCorrect === true && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-50 rounded-xl text-emerald-800 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      <CheckCircle2 size={16} />
                      回答正確！
                    </motion.div>
                  )}
                </div>

                {/* Map Block */}
                {(examState.questions[examState.currentQuestionIndex].category === 'PLACES' || examState.questions[examState.currentQuestionIndex].category === 'ROUTES') && practiceFeedback.isCorrect === true && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className="lg:col-span-7 h-full overflow-hidden"
                  >
                    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-4 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-stone-900 font-black uppercase text-[10px] tracking-widest">
                          {examState.questions[examState.currentQuestionIndex].category === 'PLACES' ? <MapPin size={18} className="text-orange-500" /> : <Navigation size={18} className="text-purple-500" />}
                          {examState.questions[examState.currentQuestionIndex].category === 'PLACES' ? '地點位置參考' : '路線規劃參考'}
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                          視覺化記憶
                        </span>
                      </div>
                      
                      <div className="flex-1 w-full rounded-2xl overflow-hidden border border-stone-50 shadow-inner bg-stone-50">
                        {examState.questions[examState.currentQuestionIndex].category === 'PLACES' ? (
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(extractLocation(examState.questions[examState.currentQuestionIndex].question, examState.questions[examState.currentQuestionIndex].options, examState.questions[examState.currentQuestionIndex].answer) + ' 香港')}&output=embed`}
                            allowFullScreen
                          />
                        ) : (
                          (() => {
                            const points = extractRoutePoints(examState.questions[examState.currentQuestionIndex].question);
                            if (points) {
                              return (
                                <iframe
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  style={{ border: 0 }}
                                  src={`https://maps.google.com/maps?saddr=${encodeURIComponent(points.start)}&daddr=${encodeURIComponent(points.end)}&dirflg=d&output=embed`}
                                  allowFullScreen
                                />
                              );
                            }
                            return <div className="flex items-center justify-center h-full text-stone-400 font-bold">無法解析路線地點</div>;
                          })()
                        )}
                      </div>
                      
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-stone-400 leading-relaxed font-medium">
                          {examState.questions[examState.currentQuestionIndex].category === 'PLACES' 
                            ? '提示：觀察地點在香港地圖上的相對位置，有助於在考試時快速聯想正確答案。'
                            : '提示：查看起點與終點的地理關係。注意題目要求的「最直接可行」路線通常與地圖顯示的主幹道一致。'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <footer className="flex justify-between items-center py-4 border-t border-stone-100">
                <button
                  onClick={prevQuestion}
                  disabled={examState.currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-stone-400 hover:text-stone-900 disabled:opacity-30 transition-colors uppercase tracking-widest text-[10px]"
                >
                  <ChevronLeft size={18} /> 上一題
                </button>
                
                {examState.currentQuestionIndex === examState.questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={finishExam}
                    disabled={mode === 'practice' && practiceFeedback.isCorrect !== true}
                    className="px-8 py-3 rounded-xl bg-stone-900 text-white font-black shadow-xl shadow-stone-200 hover:bg-black transition-all disabled:opacity-30 uppercase tracking-widest text-[10px]"
                  >
                    提交卷宗
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    disabled={mode === 'practice' && practiceFeedback.isCorrect !== true}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-stone-900 text-white font-black shadow-xl shadow-stone-200 hover:bg-black transition-all disabled:opacity-30 uppercase tracking-widest text-[10px]"
                  >
                    下一題 <ChevronRight size={18} />
                  </motion.button>
                )}
              </footer>
            </motion.div>
          )}

          {view === 'result' && stats && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Result Header */}
              <section className="text-center space-y-8 py-12">
                <motion.div 
                  initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className={`mx-auto w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-3
                    ${stats.isPass ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'}`}
                >
                  {stats.isPass ? <Trophy size={64} /> : <AlertCircle size={64} />}
                </motion.div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-stone-900">
                    {stats.isPass ? '考試及格' : '仍需努力'}
                  </h2>
                  <p className="text-stone-500 text-xl font-medium">
                    你在 {stats.total} 題中答對了 <span className="text-stone-900 font-black">{stats.correct}</span> 題
                  </p>
                </div>
              </section>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    title: '甲部：的士營運', 
                    data: stats.partA, 
                    limit: 6, 
                    desc: '包含則例、地方及路線',
                    icon: <Navigation size={20} className="text-blue-600" />,
                    bgColor: 'bg-blue-50/50',
                    borderColor: 'border-blue-100/50'
                  },
                  { 
                    title: '乙部：道路守則', 
                    data: stats.partB, 
                    limit: 5, 
                    desc: '包含交通標誌及安全守則',
                    icon: <ShieldCheck size={20} className="text-emerald-600" />,
                    bgColor: 'bg-emerald-50/50',
                    borderColor: 'border-emerald-100/50'
                  }
                ].map((part, idx) => (
                  <div key={idx} className={`p-8 rounded-[2.5rem] border ${part.borderColor} ${part.bgColor} space-y-6`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-stone-900 font-black uppercase text-xs tracking-widest">
                          {part.icon} {part.title}
                        </div>
                        <p className="text-stone-500 text-xs font-medium">{part.desc}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${part.data.mistakes <= part.limit ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {part.data.mistakes <= part.limit ? '及格' : '不及格'}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-black text-stone-900">
                          {part.data.correct} <span className="text-lg text-stone-400 font-bold">/ {part.data.total}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">錯誤數</div>
                          <div className={`text-lg font-black ${part.data.mistakes <= part.limit ? 'text-emerald-600' : 'text-red-600'}`}>
                            {part.data.mistakes}
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(part.data.correct / part.data.total) * 100}%` }}
                          className={`h-full ${part.data.mistakes <= part.limit ? 'bg-emerald-500' : 'bg-red-500'}`}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-stone-400 text-center uppercase tracking-widest">
                        及格要求：錯誤不多於 {part.limit} 題
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('review')}
                  className="flex-1 py-5 bg-stone-900 text-white rounded-[2rem] font-black shadow-xl shadow-stone-200 flex items-center justify-center gap-3"
                >
                  查看所有題目 <BookOpen size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('home')}
                  className="flex-1 py-5 bg-white text-stone-900 border border-stone-200 rounded-[2rem] font-black shadow-sm flex items-center justify-center gap-3"
                >
                  返回首頁 <RotateCcw size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black tracking-tight">試題回顧</h2>
                  <p className="text-stone-400 text-sm font-medium">檢視本次考試的所有題目及正確答案</p>
                </div>
                <button 
                  onClick={() => setView('result')} 
                  className="px-6 py-3 bg-stone-100 text-stone-900 rounded-2xl font-black hover:bg-stone-200 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> 返回結果
                </button>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto w-full">
                {examState.questions.map((q, i) => {
                  const isCorrect = examState.userAnswers[i] === q.answer;
                  return (
                    <div key={i} className={`p-8 rounded-[2.5rem] border ${isCorrect ? 'bg-white border-stone-100 shadow-sm' : 'bg-red-50/50 border-red-100/50'} space-y-6`}>
                      <div className="flex justify-between items-start gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">第 {i + 1} 題</span>
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[10px] font-black uppercase tracking-widest">
                              {q.category === 'REGULATIONS' && '的士則例'}
                              {q.category === 'PLACES' && '地方試題'}
                              {q.category === 'ROUTES' && '路線規劃'}
                              {q.category === 'ROAD_CODE' && '道路守則'}
                            </span>
                          </div>
                          <h4 className="font-black text-xl text-stone-900 leading-snug">{q.question}</h4>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isUserAnswer = examState.userAnswers[i] === optIdx;
                          const isCorrectAnswer = optIdx === q.answer;
                          
                          let itemClass = 'bg-stone-50 text-stone-500 border-transparent';
                          if (isCorrectAnswer) {
                            itemClass = 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold';
                          } else if (isUserAnswer) {
                            itemClass = 'bg-red-50 text-red-900 border-red-200';
                          }

                          return (
                            <div 
                              key={optIdx} 
                              className={`px-5 py-4 rounded-2xl text-sm border-2 transition-all flex items-center justify-between ${itemClass}`}
                            >
                              <span>{opt}</span>
                              {isCorrectAnswer && <CheckCircle2 size={16} className="text-emerald-600" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle size={16} className="text-red-600" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 pb-12">
                <button 
                  onClick={() => setView('home')}
                  className="w-full py-5 bg-stone-900 text-white rounded-[2rem] font-black shadow-xl shadow-stone-200 flex items-center justify-center gap-3"
                >
                  完成回顧並返回首頁 <RotateCcw size={20} />
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-auto border-t border-stone-100 py-4 px-6 text-center text-stone-400 text-sm">
            <p>© 2026 的士筆試 1 Take Pass | 根據運輸署官方資料編製</p>
          </footer>
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900">確定要退出嗎</h3>
                <p className="text-stone-500 font-medium leading-relaxed pb-4">  {/* pb-4 明顯空行 */}
                  目前的練習進度將不會被保存
                </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="py-4 rounded-2xl bg-stone-100 text-stone-600 font-black hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
                >
                  繼續練習
                </button>
                <button 
                  onClick={() => {
                    setShowExitConfirm(false);
                    setView('home');
                  }}
                  className="py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-colors shadow-lg shadow-red-100 uppercase tracking-widest text-xs"
                >
                  確定退出
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generic Confirmation Modal */}
      <AnimatePresence>
        {confirmModal?.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl space-y-8"
            >
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-stone-50 text-stone-900 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-stone-900">{confirmModal.title}</h3>
                  <p className="text-stone-500 font-medium">
                    {confirmModal.message}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="py-4 rounded-2xl bg-stone-100 text-stone-600 font-black hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs"
                >
                  取消
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="py-4 rounded-2xl bg-stone-900 text-white font-black hover:bg-stone-800 transition-colors shadow-lg shadow-stone-100 uppercase tracking-widest text-xs"
                >
                  確定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
