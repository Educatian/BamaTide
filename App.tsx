
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ViewState, Module, Lesson, Course, Microcredential, Submission, User, SubmissionContent, AlignmentRow, EvidenceArtifact, SubmissionHistoryEntry, DiscussionPost } from './types';
import { UA_GAME_DESIGN_COURSE, PILOT_MICROCREDENTIALS, MOCK_USER, MOCK_SUBMISSIONS, EMPTY_SUBMISSION } from './constants';
import { GeminiTutor } from './components/GeminiTutor';
import { Certificate } from './components/Certificate';
import { DiscussionBoard } from './components/DiscussionBoard';
import { Play, CheckCircle, BookOpen, Lock, Trophy, ChevronRight, ChevronLeft, Layout, Menu, GraduationCap, User as UserIcon, Award, Microscope, HelpCircle, Plus, Minus, Check, Bookmark, Filter, Search, FileText, Shield, Clock, BarChart, Upload, Link as LinkIcon, AlertCircle, CheckSquare, Save, MessageSquare, Send, ThumbsUp, Users, Sparkles, Loader2, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  // Course state
  const [courseData, setCourseData] = useState<Course>(UA_GAME_DESIGN_COURSE);
  const [currentModule, setCurrentModule] = useState<Module>(courseData.modules[0]);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(courseData.modules[0].lessons[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [tutorContext, setTutorContext] = useState("General Course Overview");
  
  // Platform state
  const [selectedMicrocredential, setSelectedMicrocredential] = useState<Microcredential | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    switch (view) {
      case ViewState.LANDING:
        setTutorContext("Introduction to the University of Alabama Microcredential Platform.");
        break;
      case ViewState.CATALOG:
        setTutorContext("Browse available microcredentials in Game Design, XR, and AI.");
        break;
      case ViewState.DASHBOARD:
        setTutorContext("Help with your learning dashboard, tracking progress, and evidence submission.");
        break;
      case ViewState.ADMIN:
        setTutorContext("Administrative assistance for reviewing submissions and issuing badges.");
        break;
      case ViewState.MC_DETAIL:
        setTutorContext(`Details about the ${selectedMicrocredential?.title} microcredential. Competencies and evidence requirements.`);
        break;
      case ViewState.LEARNING:
        setTutorContext(`Current Lesson: ${currentLesson.title}. Content summary: ${currentLesson.content.substring(0, 100)}...`);
        break;
      case ViewState.SUBMISSION_EDITOR:
        setTutorContext("Helping with the submission form. Ask about writing learning objectives or aligning game mechanics.");
        break;
      default:
        setTutorContext("General help with the UA Microcredential platform.");
    }
  }, [view, currentLesson, selectedMicrocredential]);

  // --- Shared Components ---

  const PublicNav = ({ currentView, setView, transparent = false }: { currentView: ViewState, setView: (v: ViewState) => void, transparent?: boolean }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isTransparent = transparent && !scrolled;
    const textColor = isTransparent ? 'text-white' : 'text-gray-900';
    const subTextColor = isTransparent ? 'text-white/80' : 'text-gray-500';
    const navBg = isTransparent ? 'bg-transparent' : 'bg-white shadow-md';

    const navLinkClass = (targetView: ViewState) => `
      cursor-pointer font-medium text-sm transition-colors
      ${currentView === targetView 
        ? (isTransparent ? 'text-white border-b-2 border-white' : 'text-ua-crimson border-b-2 border-ua-crimson') 
        : (isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-ua-crimson')}
    `;

    return (
      <nav className={`fixed w-full z-50 transition-all duration-300 py-4 ${navBg}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
            <div className="w-10 h-10 bg-ua-crimson text-white flex items-center justify-center font-serif font-bold text-xl rounded shadow-sm">UA</div>
            <div>
                <h1 className={`font-bold text-lg leading-tight ${textColor}`}>BamaTide</h1>
                <p className={`text-xs tracking-wider uppercase ${subTextColor}`}>Microcredentials</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => setView(ViewState.CATALOG)} className={navLinkClass(ViewState.CATALOG)}>Catalog</button>
            <button onClick={() => setView(ViewState.DASHBOARD)} className={navLinkClass(ViewState.DASHBOARD)}>My Dashboard</button>
            <button onClick={() => setView(ViewState.ADMIN)} className={navLinkClass(ViewState.ADMIN)}>Instructor</button>
          </div>
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => setView(ViewState.DASHBOARD)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all border ${isTransparent ? 'border-white text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
             >
                <UserIcon size={16} />
                <span className="text-sm">{user.name}</span>
             </button>
          </div>
        </div>
      </nav>
    );
  };

  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <h4 className="font-serif font-bold text-xl">The University of Alabama</h4>
                <p className="text-sm text-gray-400 mt-1">College of Continuing Studies</p>
            </div>
            <div className="text-xs text-gray-500 text-center md:text-right">
                <p>&copy; {new Date().getFullYear()} The University of Alabama. All Rights Reserved.</p>
                <div className="flex justify-center md:justify-end space-x-4 mt-2">
                    <button onClick={() => setView(ViewState.LANDING)} className="hover:text-white transition-colors">Home</button>
                    <button onClick={() => setView(ViewState.CATALOG)} className="hover:text-white transition-colors">Catalog</button>
                    <button onClick={() => setView(ViewState.INSTRUCTOR)} className="hover:text-white transition-colors">About</button>
                </div>
            </div>
        </div>
    </footer>
  );

  // --- Submission Editor Component ---
  const SubmissionEditor = () => {
    const [step, setStep] = useState(1);
    // Local state for the form
    const [formData, setFormData] = useState<SubmissionContent>(EMPTY_SUBMISSION);
    
    const steps = [
        { id: 1, title: "Context", icon: BookOpen },
        { id: 2, title: "Alignment", icon: Layout },
        { id: 3, title: "GenAI Design", icon: Microscope },
        { id: 4, title: "Evidence", icon: Upload },
        { id: 5, title: "Reflection", icon: Shield }
    ];

    const handleAlignmentChange = (idx: number, field: keyof AlignmentRow, value: string) => {
        const newMap = [...formData.alignmentMap];
        newMap[idx] = { ...newMap[idx], [field]: value };
        setFormData({ ...formData, alignmentMap: newMap });
    };

    const addAlignmentRow = () => {
        setFormData({
            ...formData,
            alignmentMap: [...formData.alignmentMap, { id: `row-${Date.now()}`, learningObjective: '', learningActivity: '', assessment: '' }]
        });
    };

    const removeAlignmentRow = (idx: number) => {
        const newMap = [...formData.alignmentMap];
        newMap.splice(idx, 1);
        setFormData({ ...formData, alignmentMap: newMap });
    };

    const handleSaveDraft = () => {
        // Simulate API call
        alert("Draft saved locally!");
    };

    const handleSubmit = () => {
        alert("Submission sent to instructor for review!");
        // Mock updating the submission list
        const newSub: Submission = {
            id: `sub-${Date.now()}`,
            microcredentialId: selectedMicrocredential?.id || 'mc-unknown',
            microcredentialTitle: selectedMicrocredential?.title || 'Unknown',
            learnerName: user.name,
            learnerId: user.id,
            status: 'submitted',
            updatedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            content: formData,
            evidence: [], // Mock empty for now
            history: [{
                status: 'submitted',
                timestamp: new Date().toISOString(),
                actorName: user.name
            }]
        };
        setSubmissions([...submissions, newSub]);
        setView(ViewState.DASHBOARD);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-500">
            <PublicNav currentView={ViewState.SUBMISSION_EDITOR} setView={setView} transparent={false} />
            <div className="pt-32 pb-24 flex-grow container mx-auto px-6 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Evidence Submission</h2>
                        <p className="text-gray-600">{selectedMicrocredential?.title}</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={handleSaveDraft} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            <Save size={18} className="mr-2"/> Save Draft
                        </button>
                        <button onClick={handleSubmit} className="flex items-center px-4 py-2 bg-ua-crimson text-white rounded-lg hover:bg-red-800">
                            Submit for Review
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Steps */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {steps.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setStep(s.id)}
                                    className={`w-full text-left px-6 py-4 flex items-center space-x-3 transition-colors border-l-4 ${
                                        step === s.id ? 'border-ua-crimson bg-ua-crimson/5 text-ua-crimson font-bold' : 'border-transparent text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <s.icon size={20} />
                                    <span>{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-grow bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Context Setting</h3>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none"
                                        placeholder="e.g., 7th Grade Biology Students, Corporate Trainees..."
                                        value={formData.targetAudience}
                                        onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Context Brief</label>
                                    <p className="text-xs text-gray-500 mb-2">Describe the learning setting, specific topic, and any constraints.</p>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none h-48"
                                        placeholder="The learning will take place in a hybrid classroom..."
                                        value={formData.contextBrief}
                                        onChange={e => setFormData({...formData, contextBrief: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Constructive Alignment</h3>
                                <p className="text-sm text-gray-600 mb-4">Ensure your objectives, activities, and assessments are aligned.</p>
                                
                                <div className="space-y-4">
                                    {formData.alignmentMap.map((row, idx) => (
                                        <div key={row.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Learning Objective</label>
                                                    <textarea 
                                                        className="w-full p-2 border border-gray-300 rounded text-sm h-24"
                                                        placeholder="Students will be able to..."
                                                        value={row.learningObjective}
                                                        onChange={e => handleAlignmentChange(idx, 'learningObjective', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Learning Activity (Game/XR)</label>
                                                    <textarea 
                                                        className="w-full p-2 border border-gray-300 rounded text-sm h-24"
                                                        placeholder="In the game, students will..."
                                                        value={row.learningActivity}
                                                        onChange={e => handleAlignmentChange(idx, 'learningActivity', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Assessment Evidence</label>
                                                    <textarea 
                                                        className="w-full p-2 border border-gray-300 rounded text-sm h-24"
                                                        placeholder="Quiz score, artifact, etc..."
                                                        value={row.assessment}
                                                        onChange={e => handleAlignmentChange(idx, 'assessment', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {formData.alignmentMap.length > 1 && (
                                                <button onClick={() => removeAlignmentRow(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                                    <Minus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addAlignmentRow} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:bg-gray-50 flex items-center justify-center">
                                    <Plus size={20} className="mr-2"/> Add Alignment Row
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">GenAI Design Process</h3>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tools Used</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none"
                                        placeholder="ChatGPT, Midjourney, Claude, Blockade Labs..."
                                        value={formData.genAiToolsUsed}
                                        onChange={e => setFormData({...formData, genAiToolsUsed: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Prompt Documentation</label>
                                    <p className="text-xs text-gray-500 mb-2">Document the prompts you used and how you refined them. You can use Markdown.</p>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none h-64 font-mono text-sm"
                                        placeholder="## Prompt 1&#10;Act as a..."
                                        value={formData.promptDocumentation}
                                        onChange={e => setFormData({...formData, promptDocumentation: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Prototype & Evidence</h3>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Prototype Link</label>
                                    <div className="flex items-center space-x-2">
                                        <LinkIcon size={20} className="text-gray-400" />
                                        <input 
                                            type="text" 
                                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none"
                                            placeholder="https://..."
                                            value={formData.prototypeLink}
                                            onChange={e => setFormData({...formData, prototypeLink: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Playtesting Notes</label>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none h-32"
                                        placeholder="Summary of feedback from at least 2 playtesters..."
                                        value={formData.testingNotes}
                                        onChange={e => setFormData({...formData, testingNotes: e.target.value})}
                                    />
                                </div>

                                <div className="border-t pt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-4">File Uploads (Screenshots, GDD)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600 font-medium">Drag and drop files here, or click to browse</p>
                                        <p className="text-xs text-gray-400 mt-2">PDF, PNG, JPG, MP4 (Max 50MB)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Final Reflection</h3>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Reflection</label>
                                    <p className="text-xs text-gray-500 mb-2">Reflect on the design process. What challenges did you face using GenAI? How did you overcome them?</p>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ua-crimson outline-none h-96"
                                        value={formData.reflectionText}
                                        onChange={e => setFormData({...formData, reflectionText: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                            <button 
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className="px-6 py-2 text-gray-600 font-bold disabled:opacity-30 hover:bg-gray-100 rounded"
                            >
                                Back
                            </button>
                            <button 
                                onClick={() => setStep(Math.min(5, step + 1))}
                                disabled={step === 5}
                                className="px-6 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-800 disabled:opacity-30"
                            >
                                Next Section
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
  };

  const SubmissionReview = () => {
      const [feedback, setFeedback] = useState("");
      const [aiFeedback, setAiFeedback] = useState<string | null>(null);
      const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
      
      if (!currentSubmission) return <AdminView />;

      const handleReviewAction = (status: 'approved' | 'revision_required') => {
          // Update history
          const newHistoryEntry: SubmissionHistoryEntry = {
              status: status,
              timestamp: new Date().toISOString(),
              actorName: 'Jewoong Moon, Ph.D.', // Hardcoded instructor name for demo
              comment: feedback
          };

          const updatedHistory = [...(currentSubmission.history || []), newHistoryEntry];

          const updatedSub = { 
              ...currentSubmission, 
              status, 
              reviewerComments: feedback,
              history: updatedHistory
          };
          
          const newSubs = submissions.map(s => s.id === currentSubmission.id ? updatedSub : s);
          setSubmissions(newSubs);
          setCurrentSubmission(null);
          setView(ViewState.ADMIN);
      };

      const generateAiFeedback = async () => {
        if (!currentSubmission || !process.env.API_KEY) return;
        
        setIsGeneratingFeedback(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Act as an expert Instructional Design faculty mentor. 
                Review the following student submission for the "Educational Game Design" microcredential.
                
                Analyze these three specific areas:
                1. Context Brief: ${currentSubmission.content.contextBrief}
                2. Alignment Map: ${JSON.stringify(currentSubmission.content.alignmentMap)}
                3. Reflection: ${currentSubmission.content.reflectionText}

                Provide concise, formative feedback (max 200 words) focusing on:
                - The clarity of the learning context.
                - The coherence between objectives, activities, and assessments (Constructive Alignment).
                - The depth of insight in the reflection.
                
                Format the output as a structured list of observations.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setAiFeedback(response.text);
        } catch (err) {
            console.error(err);
            setAiFeedback("Unable to generate analysis at this time.");
        } finally {
            setIsGeneratingFeedback(false);
        }
      };

      return (
        <div className="min-h-screen bg-gray-100 flex flex-col animate-in fade-in duration-500">
            <div className="bg-white shadow border-b border-gray-200 fixed w-full z-50 h-16 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setView(ViewState.ADMIN)} className="text-gray-500 hover:text-gray-900 flex items-center">
                        <ChevronLeft size={20} /> Back
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <span className="font-bold text-gray-900">{currentSubmission.learnerName}</span>
                    <span className="text-gray-400 text-sm">/</span>
                    <span className="text-sm text-gray-600">{currentSubmission.microcredentialTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        currentSubmission.status === 'approved' ? 'bg-green-100 text-green-800' :
                        currentSubmission.status === 'revision_required' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                     }`}>
                         {currentSubmission.status.replace('_', ' ')}
                     </span>
                </div>
            </div>

            <div className="pt-24 pb-12 container mx-auto px-6 grid grid-cols-3 gap-8 flex-grow">
                {/* Left: Submission Content */}
                <div className="col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg border-b pb-2 mb-4 text-gray-800">Context & Audience</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-bold">Audience</span>
                                <p>{currentSubmission.content.targetAudience}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 uppercase font-bold">Brief</span>
                        <p className="text-gray-700 mt-1 leading-relaxed">{currentSubmission.content.contextBrief}</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg border-b pb-2 mb-4 text-gray-800">Alignment Map</h3>
                        <div className="space-y-4">
                            {currentSubmission.content.alignmentMap.map((row, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <span className="block text-xs font-bold text-gray-500">Objective</span>
                                            {row.learningObjective}
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-gray-500">Activity</span>
                                            {row.learningActivity}
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-gray-500">Assessment</span>
                                            {row.assessment}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg border-b pb-2 mb-4 text-gray-800">GenAI & Prototype</h3>
                        <div className="mb-4">
                            <span className="text-xs text-gray-500 uppercase font-bold">Tools Used</span>
                            <p>{currentSubmission.content.genAiToolsUsed}</p>
                        </div>
                        {currentSubmission.content.prototypeLink && (
                             <div className="mb-4">
                                <span className="text-xs text-gray-500 uppercase font-bold">Prototype</span>
                                <a href={currentSubmission.content.prototypeLink} target="_blank" rel="noreferrer" className="block text-ua-crimson hover:underline">
                                    {currentSubmission.content.prototypeLink}
                                </a>
                            </div>
                        )}
                        <div className="mt-4">
                            <span className="text-xs text-gray-500 uppercase font-bold">Prompt Documentation</span>
                            <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto mt-1 font-mono border border-gray-200">
                                {currentSubmission.content.promptDocumentation}
                            </pre>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold text-lg border-b pb-2 mb-4 text-gray-800">Reflection</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{currentSubmission.content.reflectionText}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Grading Panel & History */}
                <div className="col-span-1">
                    <div className="sticky top-24 space-y-6">
                        
                         {/* AI Analysis Card */}
                         <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200/60 ring-1 ring-purple-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center">
                                    <Sparkles size={18} className="mr-2 text-purple-500"/> AI Formative Analysis
                                </h3>
                                {!aiFeedback && (
                                     <button 
                                        onClick={generateAiFeedback}
                                        disabled={isGeneratingFeedback}
                                        className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold hover:bg-purple-200 disabled:opacity-50 transition"
                                    >
                                        {isGeneratingFeedback ? <Loader2 size={12} className="animate-spin" /> : <Bot size={14} />}
                                        <span>{isGeneratingFeedback ? 'Analyzing...' : 'Analyze Content'}</span>
                                    </button>
                                )}
                            </div>

                            {aiFeedback && (
                                <div className="prose prose-sm text-gray-600 bg-purple-50/50 p-4 rounded-lg border border-purple-100 mb-4">
                                    <div className="whitespace-pre-wrap font-medium text-xs leading-relaxed text-gray-700">
                                        {aiFeedback}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-purple-100 flex justify-end">
                                        <button 
                                            onClick={generateAiFeedback}
                                            className="text-[10px] text-purple-500 hover:text-purple-700 font-medium"
                                        >
                                            Regenerate Analysis
                                        </button>
                                    </div>
                                </div>
                            )}
                             {!aiFeedback && !isGeneratingFeedback && (
                                <p className="text-xs text-gray-400 italic">
                                    Use AI to scan the context, alignment, and reflection for immediate pedagogical insights.
                                </p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <Shield size={18} className="mr-2 text-ua-crimson"/> Instructor Feedback
                            </h3>
                            
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-4 text-sm h-64 focus:ring-2 focus:ring-ua-crimson outline-none mb-6"
                                placeholder="Enter detailed feedback here..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleReviewAction('revision_required')}
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Request Changes
                                </button>
                                <button 
                                    onClick={() => handleReviewAction('approved')}
                                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <Clock size={18} className="mr-2 text-gray-500"/> Submission History
                            </h3>
                            <div className="space-y-4 relative">
                                {(currentSubmission.history || []).map((entry, index) => (
                                    <div key={index} className="flex gap-3 relative">
                                        {/* Connector Line */}
                                        {index < (currentSubmission.history?.length || 0) - 1 && (
                                            <div className="absolute left-[11px] top-6 bottom-[-16px] w-px bg-gray-200"></div>
                                        )}
                                        
                                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 border ${
                                            entry.status === 'approved' ? 'bg-green-50 border-green-200 text-green-600' :
                                            entry.status === 'revision_required' ? 'bg-red-50 border-red-200 text-red-600' :
                                            'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}>
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        
                                        <div className="text-sm flex-grow">
                                            <div className="font-medium text-gray-900">
                                                {entry.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-1">
                                                {new Date(entry.timestamp).toLocaleDateString()} • {entry.actorName}
                                            </div>
                                            {entry.comment && (
                                                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 italic">
                                                    "{entry.comment}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!currentSubmission.history || currentSubmission.history.length === 0) && (
                                    <div className="text-sm text-gray-500 italic text-center py-4">No history recorded.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  // --- New Views ---

  const CatalogView = () => (
      <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-500">
          <PublicNav currentView={ViewState.CATALOG} setView={setView} transparent={false} />
          <div className="pt-32 pb-24 flex-grow container mx-auto px-6">
              <div className="mb-12 text-center">
                  <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4">Microcredential Catalog</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Explore short-form, competency-based credentials designed to enhance your professional skills in emerging technologies.</p>
              </div>
              
              {/* Filters (Mock) */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                  {['All', 'Game-Based Learning', 'XR/VR', 'GenAI', 'STEM'].map((filter, idx) => (
                      <button key={idx} className={`px-4 py-2 rounded-full text-sm font-medium ${idx === 0 ? 'bg-ua-crimson text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          {filter}
                      </button>
                  ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PILOT_MICROCREDENTIALS.map((mc) => (
                      <div key={mc.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden flex flex-col group cursor-pointer" onClick={() => { setSelectedMicrocredential(mc); setView(ViewState.MC_DETAIL); }}>
                          <div className="h-48 overflow-hidden relative">
                              <img src={mc.image} alt={mc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                  {mc.level}
                              </div>
                          </div>
                          <div className="p-6 flex-grow flex flex-col">
                              <div className="text-xs text-ua-crimson font-bold uppercase tracking-wide mb-2">{mc.issuingUnit}</div>
                              <h3 className="font-bold text-xl text-gray-900 mb-2 font-serif">{mc.title}</h3>
                              <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{mc.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                  {mc.tags.slice(0,3).map(tag => (
                                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
                                  ))}
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                                  <span className="flex items-center"><Clock size={14} className="mr-1" /> {mc.recommendedDuration}</span>
                                  <span className="flex items-center"><Award size={14} className="mr-1" /> {mc.creditEquivalency}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <Footer />
      </div>
  );

  const MicrocredentialDetailView = () => {
      if (!selectedMicrocredential) return <CatalogView />;

      const handleMCPost = (content: string) => {
        if (!selectedMicrocredential) return;
        const newPost: DiscussionPost = {
            id: `d-mc-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userRole: 'student',
            content: content,
            timestamp: new Date().toISOString(),
            likes: 0
        };
        const updatedMC = { 
            ...selectedMicrocredential, 
            discussions: [...(selectedMicrocredential.discussions || []), newPost] 
        };
        setSelectedMicrocredential(updatedMC);
      };

      return (
        <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-500">
            <PublicNav currentView={ViewState.MC_DETAIL} setView={setView} transparent={false} />
            <div className="pt-32 pb-24 flex-grow container mx-auto px-6 max-w-6xl">
                <button onClick={() => setView(ViewState.CATALOG)} className="flex items-center text-gray-500 hover:text-ua-crimson mb-8 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Catalog
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Info */}
                    <div className="lg:w-2/3">
                        <div className="flex items-center space-x-4 mb-4">
                             <span className="px-3 py-1 bg-ua-crimson/10 text-ua-crimson rounded-full text-sm font-bold">{selectedMicrocredential.issuingUnit}</span>
                             <span className="text-gray-500 text-sm font-medium">{selectedMicrocredential.level} Level</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-6">{selectedMicrocredential.title}</h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">{selectedMicrocredential.description}</p>
                        
                        <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100">
                            <h3 className="font-bold text-xl mb-4 flex items-center"><Shield size={20} className="mr-2 text-ua-crimson"/> Competencies</h3>
                            <div className="grid gap-4">
                                {selectedMicrocredential.competencies.map(comp => (
                                    <div key={comp.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <div className="font-bold text-gray-800 mb-1">{comp.title}</div>
                                        <p className="text-sm text-gray-600">{comp.description}</p>
                                        {comp.framework && <div className="mt-2 text-xs text-gray-400 uppercase tracking-wider font-medium">Framework: {comp.framework}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="font-bold text-xl mb-4 flex items-center"><FileText size={20} className="mr-2 text-ua-crimson"/> Evidence Requirements</h3>
                            <ul className="space-y-4">
                                {selectedMicrocredential.evidenceRequirements.map(ev => (
                                    <li key={ev.id} className="flex items-start">
                                        <div className={`mt-1 mr-3 p-1.5 rounded-full ${ev.type === 'artifact' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {ev.type === 'artifact' ? <Layout size={14}/> : <BookOpen size={14}/>}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{ev.title}</div>
                                            <p className="text-sm text-gray-600">{ev.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* New Community Discussion Section */}
                        <div className="pt-8 border-t border-gray-200">
                            <h3 className="font-bold text-xl mb-6 flex items-center">
                                <Users size={20} className="mr-2 text-ua-crimson"/> Community Q&A
                            </h3>
                            <DiscussionBoard 
                                posts={selectedMicrocredential.discussions || []}
                                currentUser={user}
                                onPost={handleMCPost}
                                variant="inline"
                                placeholder="Ask a question about this microcredential..."
                            />
                        </div>
                    </div>

                    {/* Right: Action Card */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <img src={selectedMicrocredential.image} className="w-full h-48 object-cover" alt="Cover"/>
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-500">Credits</span>
                                    <span className="font-bold text-gray-900">{selectedMicrocredential.creditEquivalency}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-bold text-gray-900">{selectedMicrocredential.recommendedDuration}</span>
                                </div>
                                
                                {selectedMicrocredential.courseId && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                        <strong>Course Available:</strong> This credential includes a self-paced learning module.
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {selectedMicrocredential.courseId && (
                                        <button 
                                            onClick={() => setView(ViewState.LEARNING)}
                                            className="w-full py-3 bg-ua-crimson text-white font-bold rounded-lg hover:bg-red-800 transition-colors shadow-lg flex items-center justify-center"
                                        >
                                            <Play size={18} className="mr-2" /> Start Course
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setView(ViewState.SUBMISSION_EDITOR)}
                                        className="w-full py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        <FileText size={18} className="mr-2" /> Submit Evidence
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
      );
  };

  const DashboardView = () => (
      <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-500">
          <PublicNav currentView={ViewState.DASHBOARD} setView={setView} transparent={false} />
          <div className="pt-32 pb-24 flex-grow container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 font-serif mb-2">My Dashboard</h2>
                    <p className="text-gray-600">Welcome back, {user.name}. Track your progress and badges.</p>
                </div>
                <button className="mt-4 md:mt-0 text-ua-crimson font-semibold hover:underline">View Public Profile</button>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                  {/* In Progress */}
                  <div className="lg:col-span-2 space-y-8">
                      <h3 className="font-bold text-xl text-gray-800 flex items-center"><Clock size={20} className="mr-2 text-gray-400"/> In Progress</h3>
                      {PILOT_MICROCREDENTIALS.filter(mc => user.activeMicrocredentials.includes(mc.id)).map(mc => (
                          <div key={mc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-6">
                              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                  <img src={mc.image} alt={mc.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-lg text-gray-900 font-serif">{mc.title}</h4>
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">Active</span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1 mb-4">{mc.issuingUnit}</p>
                                  
                                  {/* Mock Progress */}
                                  <div className="mb-4">
                                      <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                          <span>Overall Completion</span>
                                          <span>35%</span>
                                      </div>
                                      <div className="w-full bg-gray-100 rounded-full h-2">
                                          <div className="bg-ua-crimson h-2 rounded-full" style={{width: '35%'}}></div>
                                      </div>
                                  </div>

                                  <div className="flex space-x-3">
                                      <button onClick={() => { setSelectedMicrocredential(mc); setView(ViewState.LEARNING); }} className="px-4 py-2 bg-ua-crimson text-white text-sm font-bold rounded hover:bg-red-800 transition">Continue Learning</button>
                                      <button onClick={() => { setSelectedMicrocredential(mc); setView(ViewState.SUBMISSION_EDITOR); }} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded hover:bg-gray-50 transition flex items-center">
                                          <FileText size={14} className="mr-1"/> Submission
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                      
                      {/* Recommended (Empty state placeholder) */}
                      <div className="bg-ua-crimson/5 border border-ua-crimson/20 rounded-xl p-8 text-center mt-8">
                          <h4 className="font-bold text-gray-900 mb-2">Start a new journey?</h4>
                          <p className="text-sm text-gray-600 mb-4">Based on your profile, we recommend exploring XR technologies.</p>
                          <button onClick={() => setView(ViewState.CATALOG)} className="text-ua-crimson font-bold text-sm hover:underline">Browse Catalog</button>
                      </div>
                  </div>

                  {/* Badges Sidebar */}
                  <div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center"><Trophy size={20} className="mr-2 text-yellow-500"/> Earned Badges</h3>
                          <div className="grid grid-cols-2 gap-4">
                              {user.earnedBadges.map(badge => (
                                  <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer group">
                                      <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                          <img src={badge.imageUrl} alt={badge.title} className="w-10 h-10" />
                                      </div>
                                      <div className="font-bold text-sm text-gray-900">{badge.title}</div>
                                      <div className="text-xs text-gray-500 mt-1">{badge.issuedOn}</div>
                                  </div>
                              ))}
                              {/* Placeholder slot */}
                              <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-200 rounded-lg opacity-50">
                                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                      <Lock size={20} className="text-gray-300"/>
                                  </div>
                                  <div className="text-xs text-gray-400 font-medium">Next Badge</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <Footer />
      </div>
  );

  const AdminView = () => (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-500">
        <PublicNav currentView={ViewState.ADMIN} setView={setView} transparent={false} />
        <div className="pt-32 pb-24 flex-grow container mx-auto px-6">
            <div className="mb-12">
                <span className="text-ua-crimson font-bold uppercase tracking-widest text-sm">Instructor Portal</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 font-serif">Submission Review</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filter by: All Statuses</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded px-3 py-1.5">
                        <Search size={14} className="text-gray-400" />
                        <input type="text" placeholder="Search student..." className="text-sm outline-none w-48" />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Microcredential</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.map(sub => (
                            <tr key={sub.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { 
                                // Logic to handle 'Under Review' transition
                                let submissionToView = sub;
                                if (sub.status === 'submitted' || sub.status === 'resubmitted') {
                                    const historyEntry: SubmissionHistoryEntry = {
                                        status: 'under_review',
                                        timestamp: new Date().toISOString(),
                                        actorName: 'Jewoong Moon, Ph.D.'
                                    };
                                    submissionToView = {
                                        ...sub,
                                        status: 'under_review',
                                        history: [...(sub.history || []), historyEntry]
                                    };
                                    // Update the main submissions list
                                    const updatedSubmissions = submissions.map(s => s.id === sub.id ? submissionToView : s);
                                    setSubmissions(updatedSubmissions);
                                }
                                setCurrentSubmission(submissionToView); 
                                setView(ViewState.SUBMISSION_REVIEW); 
                            }}>
                                <td className="px-6 py-4 font-medium text-gray-900">{sub.learnerName}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{sub.microcredentialTitle}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        sub.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                        sub.status === 'revision_required' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {sub.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-ua-crimson hover:underline text-sm font-medium">Review</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
                    Showing {submissions.length} submissions
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );

  // --- Existing Landing, Instructor, Learning views need small tweaks to link to new platform flows ---

  const LandingView = () => (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNav currentView={ViewState.LANDING} setView={setView} transparent={true} />

      {/* Hero Section */}
      <header className="relative h-[800px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
            <img 
                src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                alt="Game Design" 
                className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ua-crimson/90 via-ua-crimson/40 to-transparent mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-16">
            <span className="inline-block py-1.5 px-4 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold tracking-[0.15em] mb-8 text-white/90">
                UNIVERSITY OF ALABAMA ONLINE
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight tracking-tight">
                Master the Art of <br/> <span className="text-yellow-400">AI-Enhanced Educational Game Design</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                Design compelling educational experiences. A professional microcredential for educators, instructional designers, and creative leaders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                    onClick={() => { 
                         // Direct link to Game Design MC
                         const gameDesignMC = PILOT_MICROCREDENTIALS.find(mc => mc.id === 'mc-game-design');
                         if(gameDesignMC) {
                             setSelectedMicrocredential(gameDesignMC);
                             setView(ViewState.MC_DETAIL);
                         } else {
                             setView(ViewState.CATALOG); 
                         }
                    }}
                    className="px-8 py-4 bg-white text-ua-crimson font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-lg w-full sm:w-auto"
                >
                    Start Learning Now
                </button>
                <button onClick={() => setView(ViewState.CATALOG)} className="px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto backdrop-blur-sm inline-flex justify-center items-center">
                    View All Programs
                </button>
            </div>
        </div>
      </header>

      {/* Stats / Credibility */}
      <div className="bg-ua-crimson py-16 text-white border-t border-white/10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
                { label: 'Microcredentials', value: '3' },
                { label: 'Hours of Content', value: '120+' },
                { label: 'Interactive Projects', value: '12' },
                { label: 'Format', value: 'Self-Paced' }
             ].map((stat, i) => (
                 <div key={i} className="p-4 hover:bg-white/5 rounded-lg transition-colors">
                     <div className="text-3xl md:text-4xl font-bold mb-1 font-serif">{stat.value}</div>
                     <div className="text-xs md:text-sm text-white/80 uppercase tracking-widest font-medium">{stat.label}</div>
                 </div>
             ))}
        </div>
      </div>
      
      <div className="flex-grow bg-gray-50 flex flex-col items-center justify-center py-24">
         <div className="text-center max-w-2xl px-6">
             <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Ready to transform your teaching?</h2>
             <p className="text-gray-600 mb-8">Join a community of forward-thinking educators and learn to leverage the power of play and AI.</p>
             <button onClick={() => setView(ViewState.CATALOG)} className="text-ua-crimson font-bold flex items-center justify-center gap-2 hover:underline">
                Explore the Catalog <ChevronRight size={20} />
             </button>
         </div>
      </div>

      <Footer />
    </div>
  );

  const InstructorView = () => (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-500">
      <PublicNav currentView={ViewState.INSTRUCTOR} setView={setView} transparent={false} />
      
      <div className="pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
                <span className="text-ua-crimson font-bold uppercase tracking-widest text-sm">Program Director</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 font-serif">Meet Your Instructor</h2>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 max-w-6xl mx-auto">
                {/* Image Column */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative group mb-8 sticky top-32">
                        {/* Decorative Frame Background */}
                        <div className="absolute inset-0 bg-ua-crimson transform translate-x-3 translate-y-3 rounded-xl transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
                        
                        {/* Image Container */}
                        <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg bg-gray-100">
                            {UA_GAME_DESIGN_COURSE.instructorImage ? (
                                <img 
                                    src={UA_GAME_DESIGN_COURSE.instructorImage} 
                                    alt={UA_GAME_DESIGN_COURSE.instructor} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <UserIcon size={64} />
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 text-center md:text-left">
                            <h3 className="text-2xl font-serif font-bold text-gray-900">{UA_GAME_DESIGN_COURSE.instructor}</h3>
                            <p className="text-sm text-gray-500 leading-tight mt-1">{UA_GAME_DESIGN_COURSE.instructorTitle}</p>
                        </div>
                    </div>
                </div>

                {/* Bio Column */}
                <div className="w-full md:w-2/3">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Pioneering the Future of <br/>Learning Technology</h3>
                    
                    <div className="prose prose-lg text-gray-600 leading-relaxed text-justify">
                        {UA_GAME_DESIGN_COURSE.instructorBio?.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="mb-6">{paragraph}</p>
                        ))}
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                         {[
                             { icon: Microscope, title: "ADDIE Lab Director", desc: "Leading research in immersive and AI-driven learning environments." },
                             { icon: Award, title: "AI & Analytics Expert", desc: "Specializing in LLMs, Generative AI, and video-based learning analytics." },
                             { icon: Layout, title: "XR/VR Education", desc: "Creating immersive teacher and engineering education experiences." },
                             { icon: UserIcon, title: "Mentorship", desc: "Deeply engaged in mentoring graduate students and building research communities." }
                         ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-lg border-l-4 border-ua-crimson hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-3 mb-2 text-gray-900 font-bold">
                                    <item.icon size={20} className="text-ua-crimson"/>
                                    <span>{item.title}</span>
                                </div>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Placeholder for Curriculum View (kept for structure but Catalog is now primary entry)
  const CurriculumView = () => (
    <CatalogView />
  );

  // --- ArrowLeft Icon fix for import ---
  const ArrowLeft = ({size, className}: {size:number, className?:string}) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  );

  const QAView = () => {
    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-500">
            <PublicNav currentView={ViewState.QA} setView={setView} transparent={false} />
            
            <div className="pt-32 pb-24 flex-grow">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <span className="text-ua-crimson font-bold uppercase tracking-widest text-sm">Support</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2 font-serif">Frequently Asked Questions</h2>
                        <p className="mt-4 text-gray-600">Common questions about the microcredential, technology requirements, and certificate.</p>
                    </div>

                    <div className="space-y-4">
                        {UA_GAME_DESIGN_COURSE.faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-ua-crimson/30 transition-colors">
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="font-semibold text-gray-900 pr-8 text-lg">{faq.question}</span>
                                    {openFaqIndex === index ? (
                                        <Minus size={20} className="text-ua-crimson flex-shrink-0" />
                                    ) : (
                                        <Plus size={20} className="text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                <div 
                                    className={`bg-gray-50 transition-all duration-300 overflow-hidden ${
                                        openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-16 bg-ua-crimson/5 border border-ua-crimson/20 rounded-2xl p-8 text-center">
                        <h4 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h4>
                        <p className="text-gray-600 mb-6">Our support team is available Monday through Friday, 8am - 5pm CST.</p>
                        <button className="inline-flex items-center space-x-2 bg-white text-ua-crimson px-6 py-3 rounded-lg font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                            <HelpCircle size={18} />
                            <span>Contact Support</span>
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
  };

  const LearningView = () => {
    const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
    const [sidebarTab, setSidebarTab] = useState<'modules' | 'discussion'>('modules');
    
    // Calculate overall progress
    const totalLessons = courseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedLessons = courseData.modules.reduce((acc, mod) => acc + mod.lessons.filter(l => l.completed).length, 0);
    const overallProgress = Math.round((completedLessons / totalLessons) * 100);

    const toggleBookmark = () => {
        const updatedModules = courseData.modules.map(m => ({
            ...m,
            lessons: m.lessons.map(l => {
                if (l.id === currentLesson.id) {
                    return { ...l, bookmarked: !l.bookmarked };
                }
                return l;
            })
        }));

        setCourseData({ ...courseData, modules: updatedModules });
        setCurrentLesson(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
        
        // Update currentModule reference if needed
        const updatedCurrentModule = updatedModules.find(m => m.id === currentModule.id);
        if (updatedCurrentModule) {
            setCurrentModule(updatedCurrentModule);
        }
    };

    const handleLessonComplete = () => {
        const moduleIndex = courseData.modules.findIndex(m => m.id === currentModule.id);
        if (moduleIndex === -1) return;

        const newModules = [...courseData.modules];
        const currentMod = { ...newModules[moduleIndex] };
        const lessons = [...currentMod.lessons];
        
        // 1. Mark current lesson as complete
        const lessonIndex = lessons.findIndex(l => l.id === currentLesson.id);
        if (lessonIndex !== -1) {
            lessons[lessonIndex] = { ...lessons[lessonIndex], completed: true };
        }
        
        // 2. Recalculate module progress
        const completedCount = lessons.filter(l => l.completed).length;
        currentMod.progress = Math.round((completedCount / lessons.length) * 100);
        currentMod.lessons = lessons;
        newModules[moduleIndex] = currentMod;

        // 3. Determine next step
        let nextLessonToSet: Lesson | null = null;
        let nextModuleToSet: Module | null = null;

        if (lessonIndex < lessons.length - 1) {
            // Go to next lesson in current module
            nextLessonToSet = lessons[lessonIndex + 1];
            nextModuleToSet = currentMod;
        } else if (moduleIndex < newModules.length - 1) {
             // If module is complete, unlock next module
            if (currentMod.progress === 100) {
                const nextModIndex = moduleIndex + 1;
                const nextMod = { ...newModules[nextModIndex], isLocked: false };
                newModules[nextModIndex] = nextMod;
                
                // Go to first lesson of next module
                nextModuleToSet = nextMod;
                nextLessonToSet = nextMod.lessons[0];
            }
        }

        // 4. Update State
        setCourseData({ ...courseData, modules: newModules });
        if (nextLessonToSet && nextModuleToSet) {
             setCurrentModule(nextModuleToSet);
             setCurrentLesson(nextLessonToSet);
             setShowBookmarksOnly(false); // Reset filter so user sees new location
        } else {
            // Just update current module ref to ensure UI reflects 'completed' state even if we don't move
            setCurrentModule(currentMod);
            setCurrentLesson(lessons[lessonIndex]);
        }
    };

    const handlePrevious = () => {
        const moduleIndex = courseData.modules.findIndex(m => m.id === currentModule.id);
        const lessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
        
        if (lessonIndex > 0) {
            setCurrentLesson(currentModule.lessons[lessonIndex - 1]);
        } else if (moduleIndex > 0) {
            const prevModule = courseData.modules[moduleIndex - 1];
            setCurrentModule(prevModule);
            setCurrentLesson(prevModule.lessons[prevModule.lessons.length - 1]);
        }
    };

    const goToLesson = (module: Module, lesson: Lesson) => {
        if (module.isLocked) return;
        setCurrentModule(module);
        setCurrentLesson(lesson);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleCoursePost = (content: string) => {
        const newPost: DiscussionPost = {
            id: `d-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userRole: 'student',
            content: content,
            timestamp: new Date().toISOString(),
            likes: 0
        };
        const updatedDiscussions = [...(courseData.discussions || []), newPost];
        setCourseData({...courseData, discussions: updatedDiscussions});
    };

    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-80 h-full bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-ua-crimson text-white">
            <div className="flex items-center space-x-2 font-bold text-lg">
              <div className="bg-white text-ua-crimson px-1.5 rounded text-sm font-serif">UA</div>
              <span>BamaTide</span>
            </div>
            <button onClick={() => setView(ViewState.CATALOG)} className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition">Exit</button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setSidebarTab('modules')}
                className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${sidebarTab === 'modules' ? 'text-ua-crimson border-b-2 border-ua-crimson bg-red-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  Curriculum
              </button>
              <button 
                onClick={() => setSidebarTab('discussion')}
                className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${sidebarTab === 'discussion' ? 'text-ua-crimson border-b-2 border-ua-crimson bg-red-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  Discussion
              </button>
          </div>

          {/* Sidebar Content Area */}
          <div className="flex-grow overflow-hidden flex flex-col relative">
            
            {sidebarTab === 'modules' && (
                <>
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Progress</span>
                            <span className="text-xs font-bold text-ua-crimson">{overallProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div className="bg-ua-crimson h-2 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                        {overallProgress === 100 && (
                            <button onClick={() => setView(ViewState.CERTIFICATE)} className="w-full py-2 bg-yellow-500 text-white rounded text-sm font-bold flex items-center justify-center gap-2 hover:bg-yellow-600 transition">
                                <Trophy size={14} /> Get Certificate
                            </button>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Filters</span>
                        <button 
                            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)} 
                            className={`p-1.5 rounded transition-colors ${showBookmarksOnly ? 'bg-ua-crimson text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                            title="Show Bookmarks Only"
                        >
                            <Bookmark size={16} fill={showBookmarksOnly ? "currentColor" : "none"} />
                        </button>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto scrollbar-hide p-4 space-y-6 pb-24">
                        {courseData.modules.map((module, mIdx) => {
                            // If filtering by bookmark, only show modules that have bookmarked lessons
                            const hasBookmarks = module.lessons.some(l => l.bookmarked);
                            if (showBookmarksOnly && !hasBookmarks) return null;

                            return (
                            <div key={module.id} className={`relative ${module.isLocked ? 'opacity-60' : ''}`}>
                                <div className="flex items-center mb-3 sticky top-0 bg-white z-10 py-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 border ${
                                        module.progress === 100 ? 'bg-green-100 border-green-500 text-green-700' :
                                        module.isLocked ? 'bg-gray-100 border-gray-300 text-gray-400' : 'bg-ua-crimson text-white border-ua-crimson'
                                    }`}>
                                        {module.progress === 100 ? <Check size={14} /> : (mIdx + 1)}
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm leading-tight flex-grow">{module.title}</h3>
                                    {module.isLocked && <Lock size={14} className="text-gray-400 ml-2" />}
                                    {!module.isLocked && module.progress === 100 && <CheckCircle size={16} className="text-green-500 ml-2" />}
                                </div>
                                <div className="space-y-2 pl-3 border-l-2 border-gray-100 ml-3">
                                    {module.lessons.map((lesson) => {
                                        if (showBookmarksOnly && !lesson.bookmarked) return null;
                                        
                                        const isActive = currentLesson.id === lesson.id;
                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => goToLesson(module, lesson)}
                                                disabled={module.isLocked}
                                                className={`w-full text-left p-2 rounded text-sm flex items-center justify-between group transition-all ${
                                                    isActive 
                                                        ? 'bg-ua-crimson/10 text-ua-crimson font-medium border-l-2 border-ua-crimson -ml-[14px] pl-[12px]' 
                                                        : 'hover:bg-gray-50 text-gray-600'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    {lesson.completed ? (
                                                        <CheckCircle size={14} className="mr-2 text-green-500 shrink-0" />
                                                    ) : (
                                                        <div className={`w-3.5 h-3.5 rounded-full border mr-2 shrink-0 ${isActive ? 'border-ua-crimson bg-white' : 'border-gray-300'}`}></div>
                                                    )}
                                                    <span className="line-clamp-1">{lesson.title}</span>
                                                </div>
                                                {lesson.bookmarked && <Bookmark size={12} className="text-yellow-500 fill-current shrink-0 ml-2" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )})}
                        {showBookmarksOnly && courseData.modules.every(m => !m.lessons.some(l => l.bookmarked)) && (
                            <div className="text-center text-gray-500 text-sm py-8 italic">
                                No bookmarks yet.
                            </div>
                        )}
                    </div>
                </>
            )}

            {sidebarTab === 'discussion' && (
                <DiscussionBoard 
                    posts={courseData.discussions || []}
                    currentUser={user}
                    onPost={handleCoursePost}
                    variant="sidebar"
                />
            )}

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow h-full overflow-y-auto bg-gray-50 relative w-full">
           {/* Mobile Header Toggle */}
           <div className="md:hidden absolute top-4 left-4 z-20">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white rounded-md shadow-md text-gray-700">
                   <Menu size={24} />
               </button>
           </div>

           <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
                {/* Breadcrumb */}
                <div className="flex items-center text-xs text-gray-500 mb-4 uppercase tracking-wider font-medium">
                    <span>Module {courseData.modules.findIndex(m => m.id === currentModule.id) + 1}</span>
                    <ChevronRight size={12} className="mx-2" />
                    <span>{currentModule.title}</span>
                </div>

                {/* Video / Content Player Area */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-8 aspect-video relative group">
                    {currentLesson.type === 'video' ? (
                        <>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors cursor-pointer">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 hover:scale-110 transition-transform">
                                    <Play size={32} className="text-white fill-current ml-1" />
                                </div>
                            </div>
                            <img src={`https://picsum.photos/seed/${currentLesson.id}/1200/800`} alt="Video Thumbnail" className="w-full h-full object-cover" />
                            
                            {/* Fake Player Controls */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={20} fill="currentColor" />
                                <div className="h-1 bg-gray-600 flex-grow rounded-full overflow-hidden">
                                    <div className="h-full bg-ua-crimson w-1/3"></div>
                                </div>
                                <span className="text-xs font-mono">04:20 / {currentLesson.duration}</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-white p-12 flex flex-col items-center justify-center text-gray-800 border-b-4 border-ua-crimson">
                            <BookOpen size={64} className="text-ua-crimson mb-4" />
                            <h3 className="text-2xl font-serif font-bold">Reading Assignment</h3>
                            <p className="text-gray-500 mt-2">Estimated time: {currentLesson.duration}</p>
                        </div>
                    )}
                </div>

                {/* Lesson Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-serif mb-2">{currentLesson.title}</h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center"><Layout size={14} className="mr-1"/> {currentLesson.type.charAt(0).toUpperCase() + currentLesson.type.slice(1)}</span>
                                <span className="flex items-center"><UserIcon size={14} className="mr-1"/> Dr. Moon</span>
                            </div>
                        </div>
                        <button 
                            onClick={toggleBookmark}
                            className={`p-2 rounded-full transition-all ${currentLesson.bookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            title={currentLesson.bookmarked ? "Remove Bookmark" : "Bookmark Lesson"}
                        >
                            <Bookmark size={24} fill={currentLesson.bookmarked ? "currentColor" : "none"} />
                        </button>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        {currentLesson.content.split('\n').map((para, i) => (
                            <p key={i} className="mb-4">{para}</p>
                        ))}
                    </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <button 
                        onClick={handlePrevious}
                        disabled={courseData.modules[0].lessons[0].id === currentLesson.id}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span>Previous</span>
                    </button>

                    <button 
                        onClick={handleLessonComplete}
                        className="flex items-center space-x-2 bg-ua-crimson text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-red-800 transition-all hover:scale-105 active:scale-95"
                    >
                        <span>{currentLesson.completed ? 'Next Lesson' : 'Mark Complete & Continue'}</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
           </div>
        </main>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-900">
      {view === ViewState.CERTIFICATE ? (
          <Certificate 
            studentName="Student Name" 
            courseName={courseData.title} 
            instructorName={courseData.instructor}
            instructorTitle={courseData.instructorTitle}
            onBack={() => setView(ViewState.LEARNING)} 
          />
      ) : (
        <>
            {view === ViewState.LANDING && <LandingView />}
            {view === ViewState.CATALOG && <CatalogView />}
            {view === ViewState.DASHBOARD && <DashboardView />}
            {view === ViewState.MC_DETAIL && <MicrocredentialDetailView />}
            {view === ViewState.ADMIN && <AdminView />}
            {view === ViewState.INSTRUCTOR && <InstructorView />}
            {view === ViewState.CURRICULUM && <CurriculumView />}
            {view === ViewState.LEARNING && <LearningView />}
            {view === ViewState.QA && <QAView />}
            {view === ViewState.SUBMISSION_EDITOR && <SubmissionEditor />}
            {view === ViewState.SUBMISSION_REVIEW && <SubmissionReview />}
            
            {/* Global AI Tutor - Available on all pages */}
            <GeminiTutor context={tutorContext} />
        </>
      )}
    </div>
  );
};

export default App;
