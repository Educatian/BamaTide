export enum ViewState {
  LANDING = 'LANDING',
  LEARNING = 'LEARNING',
  CERTIFICATE = 'CERTIFICATE',
  CURRICULUM = 'CURRICULUM',
  INSTRUCTOR = 'INSTRUCTOR',
  QA = 'QA'
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
  content: string; // Markdown or text content
  completed?: boolean;
  bookmarked?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  image: string;
  progress: number; // 0-100
  isLocked?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorImage?: string;
  description: string;
  modules: Module[];
  faqs: FAQItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}