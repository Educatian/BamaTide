export enum ViewState {
  LANDING = 'LANDING',
  CATALOG = 'CATALOG',
  DASHBOARD = 'DASHBOARD', // Learner Dashboard
  ADMIN = 'ADMIN', // Instructor/Reviewer Dashboard
  MC_DETAIL = 'MC_DETAIL', // Microcredential Detail View
  LEARNING = 'LEARNING', // Existing Course Player
  CERTIFICATE = 'CERTIFICATE',
  CURRICULUM = 'CURRICULUM',
  INSTRUCTOR = 'INSTRUCTOR',
  QA = 'QA',
  SUBMISSION_EDITOR = 'SUBMISSION_EDITOR', // New: Student editing view
  SUBMISSION_REVIEW = 'SUBMISSION_REVIEW' // New: Instructor grading view
}

// --- Existing Course Types ---
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

// --- New Microcredential Platform Types ---

export interface Competency {
  id: string;
  title: string;
  description: string;
  framework?: string; // e.g., 'ISTE', 'AECT', 'UA-Internal'
}

export interface EvidenceRequirement {
  id: string;
  title: string;
  type: 'artifact' | 'reflection' | 'quiz' | 'observation';
  description: string;
  rubricId?: string;
}

export interface Microcredential {
  id: string;
  title: string;
  description: string;
  issuingUnit: string; // e.g., 'ELPTS', 'COE', 'ADDIE Lab'
  level: 'Introductory' | 'Intermediate' | 'Advanced';
  creditEquivalency: string; // e.g., '1.5 CEU', '3 PD Hours'
  tags: string[]; // e.g., 'GenAI', 'XR', 'Game-Based Learning'
  competencies: Competency[];
  evidenceRequirements: EvidenceRequirement[];
  recommendedDuration: string;
  image: string;
  courseId?: string; // Link to internal course content if applicable
}

export interface Badge {
  id: string;
  microcredentialId: string;
  title: string;
  imageUrl: string;
  issuedOn: string;
  expiresOn?: string;
}

// --- Enhanced Submission Domain Model ---

export type SubmissionStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'revision_required' 
  | 'resubmitted' 
  | 'approved' 
  | 'rejected';

export interface AlignmentRow {
  id: string;
  learningObjective: string;
  learningActivity: string;
  assessment: string;
}

export interface EvidenceArtifact {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string; // 'pdf', 'image', 'link'
  description: string;
  uploadedAt: string;
}

export interface SubmissionContent {
  contextBrief: string;
  targetAudience: string;
  alignmentMap: AlignmentRow[];
  genAiToolsUsed: string;
  promptDocumentation: string;
  prototypeLink: string;
  testingNotes: string;
  reflectionText: string;
}

export interface SubmissionHistoryEntry {
  status: SubmissionStatus;
  timestamp: string;
  actorName: string;
  comment?: string;
}

export interface Submission {
  id: string;
  microcredentialId: string;
  microcredentialTitle: string;
  learnerName: string;
  learnerId: string;
  status: SubmissionStatus;
  submittedAt?: string;
  updatedAt: string;
  
  // Content
  content: SubmissionContent;
  evidence: EvidenceArtifact[];
  
  // Review
  reviewerComments?: string;
  reviewerId?: string;
  
  // History Log
  history?: SubmissionHistoryEntry[];
}

export interface User {
  id: string;
  name: string;
  role: 'learner' | 'faculty' | 'admin';
  affiliation: string;
  earnedBadges: Badge[];
  activeMicrocredentials: string[]; // IDs of MCs in progress
}