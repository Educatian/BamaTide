import React, { useState, useEffect } from 'react';
import { ViewState, Module, Lesson, Course } from './types';
import { UA_GAME_DESIGN_COURSE } from './constants';
import { GeminiTutor } from './components/GeminiTutor';
import { Certificate } from './components/Certificate';
import { Play, CheckCircle, BookOpen, Lock, Trophy, ChevronRight, ChevronLeft, Layout, Menu, GraduationCap, User, Award, Microscope, HelpCircle, Plus, Minus, Check, Bookmark, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  // Initialize course data from constants, but keep it stateful to track progress
  const [courseData, setCourseData] = useState<Course>(UA_GAME_DESIGN_COURSE);
  const [currentModule, setCurrentModule] = useState<Module>(courseData.modules[0]);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(courseData.modules[0].lessons[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [tutorContext, setTutorContext] = useState("General Course Overview");

  useEffect(() => {
    switch (view) {
      case ViewState.LANDING:
        setTutorContext("Introduction to the Educational Game Design Microcredential program.");
        break;
      case ViewState.CURRICULUM:
        setTutorContext("Course syllabus and module breakdown.");
        break;
      case ViewState.INSTRUCTOR:
        setTutorContext("Information about Dr. Jewoong Moon and the ADDIE Lab.");
        break;
      case ViewState.LEARNING:
        setTutorContext(`Current Lesson: ${currentLesson.title}. Content summary: ${currentLesson.content.substring(0, 100)}...`);
        break;
      default:
        setTutorContext("General help with the UA Microcredential platform.");
    }
  }, [view, currentLesson]);

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
                <h1 className={`font-bold text-lg leading-tight ${textColor}`}>AI-Enhanced Educational Game Design</h1>
                <p className={`text-xs tracking-wider uppercase ${subTextColor}`}>Microcredential Program</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => setView(ViewState.CURRICULUM)} className={navLinkClass(ViewState.CURRICULUM)}>Curriculum</button>
            <button onClick={() => setView(ViewState.INSTRUCTOR)} className={navLinkClass(ViewState.INSTRUCTOR)}>Instructor</button>
            <button onClick={() => setView(ViewState.QA)} className={navLinkClass(ViewState.QA)}>Q&A</button>
          </div>
          <button 
            onClick={() => setView(ViewState.LEARNING)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${isTransparent ? 'bg-white text-ua-crimson hover:bg-gray-100' : 'bg-ua-crimson text-white hover:bg-red-800'}`}
          >
            Go to Classroom
          </button>
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
                    <button onClick={() => setView(ViewState.CURRICULUM)} className="hover:text-white transition-colors">Curriculum</button>
                    <button onClick={() => setView(ViewState.INSTRUCTOR)} className="hover:text-white transition-colors">Instructor</button>
                </div>
            </div>
        </div>
    </footer>
  );

  // --- Views ---

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
                    onClick={() => setView(ViewState.LEARNING)}
                    className="px-8 py-4 bg-white text-ua-crimson font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-lg w-full sm:w-auto"
                >
                    Start Learning Now
                </button>
                <button onClick={() => setView(ViewState.CURRICULUM)} className="px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto backdrop-blur-sm inline-flex justify-center items-center">
                    View Syllabus
                </button>
            </div>
        </div>
      </header>

      {/* Stats / Credibility */}
      <div className="bg-ua-crimson py-16 text-white border-t border-white/10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
                { label: 'Modules', value: '4' },
                { label: 'Hours of Content', value: '40+' },
                { label: 'Interactive Projects', value: '12' },
                { label: 'Credit', value: 'Microcredential' }
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
             <p className="text-gray-600 mb-8">Join a community of forward-thinking educators and learn to leverage the power of play.</p>
             <button onClick={() => setView(ViewState.CURRICULUM)} className="text-ua-crimson font-bold flex items-center justify-center gap-2 hover:underline">
                Explore the Curriculum <ChevronRight size={20} />
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
                <span className="text-ua-crimson font-bold uppercase tracking-widest text-sm">Course Director</span>
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
                                    <User size={64} />
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
                             { icon: User, title: "Mentorship", desc: "Deeply engaged in mentoring graduate students and building research communities." }
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

  const CurriculumView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-500">
      <PublicNav currentView={ViewState.CURRICULUM} setView={setView} transparent={false} />

      <div className="pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <span className="text-ua-crimson font-bold uppercase tracking-widest text-sm">Syllabus</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4 font-serif">Course Curriculum</h2>
                <p className="text-gray-600 text-lg">
                    Progress through structured modules designed to take you from theory to a working prototype using evidence-based tools.
                </p>
            </div>

            <div className="grid gap-8 max-w-5xl mx-auto">
                {UA_GAME_DESIGN_COURSE.modules.map((module, idx) => (
                    <div key={module.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row border border-gray-100">
                        <div className="md:w-64 h-48 md:h-auto relative shrink-0">
                            <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
                            <div className="absolute top-0 left-0 bg-ua-crimson text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-sm">
                                Module {idx + 1}
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-2xl text-gray-900 font-serif">{module.title}</h3>
                                {module.progress === 100 && <CheckCircle size={24} className="text-green-500 shrink-0" />}
                            </div>
                            <p className="text-gray-600 mb-6">{module.description}</p>
                            
                            <div className="space-y-3">
                                {module.lessons.map((lesson, lIdx) => (
                                    <div key={lesson.id} className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className={`mr-3 ${lIdx === 0 ? 'text-ua-crimson' : 'text-gray-400'}`}>
                                            {lesson.type === 'video' ? <Play size={16} /> : <BookOpen size={16} />}
                                        </div>
                                        <span className="font-medium text-gray-700 flex-grow">{lIdx + 1}. {lesson.title}</span>
                                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200">{lesson.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      <Footer />
    </div>
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

    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-80 h-full bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-ua-crimson text-white">
            <div className="flex items-center space-x-2 font-bold text-lg">
              <div className="bg-white text-ua-crimson px-1.5 rounded text-sm font-serif">UA</div>
              <span>Microcredential</span>
            </div>
            <button onClick={() => setView(ViewState.LANDING)} className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition">Exit</button>
          </div>

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
                                <span className="flex items-center"><User size={14} className="mr-1"/> Dr. Moon</span>
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
            {view === ViewState.INSTRUCTOR && <InstructorView />}
            {view === ViewState.CURRICULUM && <CurriculumView />}
            {view === ViewState.LEARNING && <LearningView />}
            {view === ViewState.QA && <QAView />}
            
            {/* Global AI Tutor - Available on all pages */}
            <GeminiTutor context={tutorContext} />
        </>
      )}
    </div>
  );
};

export default App;