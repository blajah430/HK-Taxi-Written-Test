export type Category = 'REGULATIONS' | 'PLACES' | 'ROUTES' | 'ROAD_CODE';

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  answer: number; // Index of options
  explanation?: string;
}

export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  practiceSelections: number[][];
  isFinished: boolean;
  startTime: number | null;
  endTime: number | null;
}
