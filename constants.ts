// Fix: Import SubmissionContent to resolve undefined name error
import { Course, Microcredential, Submission, User, SubmissionContent } from './types';

// --- Existing Course Data ---
export const UA_GAME_DESIGN_COURSE: Course = {
  id: 'ua-egd-101',
  title: 'AI-Enhanced Educational Game Design Microcredential',
  instructor: 'Jewoong Moon, Ph.D.',
  instructorTitle: 'Assistant Professor of Instructional Technology',
  instructorBio: 'Jewoong Moon, Ph.D., is an Assistant Professor of Instructional Technology in the Department of Educational Leadership, Policy, and Technology Studies at The University of Alabama, where he directs the ADDIE Lab. He earned his Ph.D. in Instructional Systems and Learning Technologies from Florida State University.\n\nHis work sits at the intersection of learning experience design, educational technology, and data-informed innovation, with a particular focus on how immersive and AI-driven environments can support authentic, high-impact learning experiences. Dr. Moon’s research agenda spans digital game-based learning, virtual and extended reality (VR/XR) for teacher and engineering education, learning analytics, and AI-augmented instructional design.\n\nHe is especially interested in leveraging large language models, generative AI, and video-based analytics to understand and scaffold complex learning processes, including teacher identity development and ethical reasoning in technology-rich contexts. Beyond his research, he is deeply engaged in mentoring graduate students, building collaborative research communities, and translating emerging technologies into practical, evidence-based tools for classrooms and professional learning environments.',
  instructorImage: 'https://adhc.lib.ua.edu/wp-content/uploads/2024/08/Moon-Jewoong-sq.jpg',
  description: 'Master the art of designing serious games for learning. This comprehensive microcredential covers game mechanics, learning psychology, and Unity prototyping specially tailored for educators.',
  modules: [
    {
      id: 'mod-1',
      title: 'Foundations of Game-Based Learning',
      description: 'Explore the history and theory behind using games as educational tools.',
      progress: 0,
      isLocked: false,
      image: 'https://picsum.photos/800/600?random=1',
      lessons: [
        {
          id: 'l-1-1',
          title: 'Introduction to Serious Games',
          duration: '10 min',
          type: 'video',
          completed: false,
          bookmarked: false,
          content: 'Game-based learning (GBL) is not just about "gamification" (badges and points). It is about intrinsically motivating learners through mechanics that reinforce the subject matter. In this video, we explore the core definition of serious games.'
        },
        {
          id: 'l-1-2',
          title: 'The Magic Circle Theory',
          duration: '15 min',
          type: 'reading',
          completed: false,
          bookmarked: false,
          content: 'Huizinga\'s "Magic Circle" separates the game world from reality. For educators, entering this circle means suspending disbelief to engage with complex systems. \n\nKey concepts:\n1. Boundaries\n2. Rules\n3. Meaningful Play'
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Mechanics & Dynamics',
      description: 'Learn how to translate learning objectives into compelling game mechanics.',
      progress: 0,
      isLocked: true,
      image: 'https://picsum.photos/800/600?random=2',
      lessons: [
        {
          id: 'l-2-1',
          title: 'Core Loops in Education',
          duration: '12 min',
          type: 'video',
          completed: false,
          bookmarked: false,
          content: 'Every good game has a core loop: Action -> Reward -> Expansion. In education, this translates to: Attempt -> Feedback -> Mastery. We will analyze "Oregon Trail" as a case study.'
        },
        {
          id: 'l-2-2',
          title: 'Balancing Difficulty & Flow',
          duration: '20 min',
          type: 'reading',
          completed: false,
          bookmarked: false,
          content: 'Csikszentmihalyi’s Flow Theory is critical. If a game is too hard, students quit. If too easy, they get bored. Learn how to design dynamic difficulty adjustment (DDA) systems.'
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Prototyping for Non-Coders',
      description: 'Rapid prototyping techniques using paper and low-code tools.',
      progress: 0,
      isLocked: true,
      image: 'https://picsum.photos/800/600?random=3',
      lessons: [
        {
          id: 'l-3-1',
          title: 'Paper Prototyping Workshop',
          duration: '25 min',
          type: 'video',
          completed: false,
          bookmarked: false,
          content: 'Before you touch a computer, you must playtest with paper. This module guides you through a live workshop on iterating rulesets using index cards and dice.'
        }
      ]
    },
    {
      id: 'mod-4',
      title: 'Assessment & Analytics',
      description: 'Integrating stealth assessment into gameplay without breaking immersion.',
      progress: 0,
      isLocked: true,
      image: 'https://picsum.photos/800/600?random=4',
      lessons: [
        {
          id: 'l-4-1',
          title: 'Stealth Assessment Basics',
          duration: '15 min',
          type: 'video',
          completed: false,
          bookmarked: false,
          content: 'Move beyond the "end of level quiz". Learn how to track player choices as data points for understanding their mastery of the subject material.'
        }
      ]
    }
  ],
  faqs: [
    {
      question: "What is the ADDIE Lab?",
      answer: "The ADDIE Lab, directed by Dr. Jewoong Moon, focuses on learning experience design, educational technology, and data-informed innovation. It investigates how immersive and AI-driven environments can support high-impact learning."
    },
    {
      question: "Do I need coding experience?",
      answer: "No. While we discuss technical concepts like VR/XR and AI, the course focuses on design principles, paper prototyping, and low-code tools suitable for educators and instructional designers."
    },
    {
      question: "Is this course part of a degree program?",
      answer: "This is a microcredential offered by the College of Continuing Studies. However, skills learned here align with the Instructional Technology graduate programs at UA."
    },
    {
      question: "How does AI integrate into this course?",
      answer: "Reflecting Dr. Moon's research, we use AI not just as a topic of study but as a tool. You will have access to an AI Tutor to scaffold your learning process and brainstorm game mechanics."
    }
  ]
};

// --- Pilot Microcredentials Data ---
export const PILOT_MICROCREDENTIALS: Microcredential[] = [
  {
    id: 'mc-game-design',
    title: 'AI-Enhanced Educational Game Design',
    description: 'Design and prototype serious games using generative AI tools. Focuses on game mechanics, learner motivation, and stealth assessment.',
    issuingUnit: 'ADDIE Lab',
    level: 'Intermediate',
    creditEquivalency: '1.5 CEU',
    tags: ['Game-Based Learning', 'GenAI', 'Instructional Design'],
    recommendedDuration: '4 Weeks',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    courseId: 'ua-egd-101', // Links to the existing course content
    competencies: [
      {
        id: 'comp-1',
        title: 'Game Mechanics Alignment',
        description: 'Align game mechanics (rules, loops) with specific learning objectives.',
        framework: 'UA-ID-2025'
      },
      {
        id: 'comp-2',
        title: 'AI-Assisted Prototyping',
        description: 'Utilize Generative AI to create assets, narratives, and code snippets for game prototypes.',
        framework: 'ISTE-Educator'
      }
    ],
    evidenceRequirements: [
      {
        id: 'ev-1',
        title: 'Game Design Document (GDD)',
        type: 'artifact',
        description: 'A comprehensive GDD outlining the core loop, target audience, and learning goals.'
      },
      {
        id: 'ev-2',
        title: 'Paper Prototype Reflection',
        type: 'reflection',
        description: 'A 500-word reflection on the playtesting process and iterations made based on feedback.'
      }
    ]
  },
  {
    id: 'mc-xr-teacher',
    title: 'XR for Pre-service Teacher Education',
    description: 'Introduction to Extended Reality (VR/AR) technologies in the classroom. Create immersive lesson plans for K-12 settings.',
    issuingUnit: 'College of Education',
    level: 'Introductory',
    creditEquivalency: '1.0 CEU',
    tags: ['XR/VR', 'Teacher Education', 'STEM'],
    recommendedDuration: '3 Weeks',
    image: 'https://images.unsplash.com/photo-1592478411213-61535fdd861d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    competencies: [
      {
        id: 'comp-xr-1',
        title: 'Immersive Tech Integration',
        description: 'Evaluate and select appropriate XR tools for specific curriculum standards.',
        framework: 'ISTE-Educator'
      }
    ],
    evidenceRequirements: [
      {
        id: 'ev-xr-1',
        title: 'VR Lesson Plan',
        type: 'artifact',
        description: 'A lesson plan incorporating a specific VR application (e.g., Google Expeditions, Engage).'
      }
    ]
  },
  {
    id: 'mc-genai-media',
    title: 'GenAI-Enhanced Educational Media',
    description: 'Create high-quality educational videos, images, and audio using Generative AI tools while maintaining ethical standards.',
    issuingUnit: 'ELPTS',
    level: 'Advanced',
    creditEquivalency: '2.0 CEU',
    tags: ['GenAI', 'Media Design', 'Ethics'],
    recommendedDuration: '5 Weeks',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    competencies: [
      {
        id: 'comp-media-1',
        title: 'Ethical AI Usage',
        description: 'Demonstrate understanding of copyright, bias, and hallucination in AI media generation.',
        framework: 'AECT'
      }
    ],
    evidenceRequirements: [
      {
        id: 'ev-media-1',
        title: 'Multimedia Portfolio',
        type: 'artifact',
        description: 'A collection of 3 AI-generated educational assets with prompts and critique.'
      }
    ]
  }
];

// --- Mock User Data ---
export const MOCK_USER: User = {
  id: 'u-123',
  name: 'Alex Crimson',
  role: 'learner',
  affiliation: 'Instructional Technology Dept',
  earnedBadges: [
    {
      id: 'badge-1',
      microcredentialId: 'mc-xr-teacher',
      title: 'XR Specialist',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/6270/6270515.png',
      issuedOn: '2024-02-15'
    }
  ],
  activeMicrocredentials: ['mc-game-design']
};

// --- Mock Admin Submissions ---
export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    microcredentialId: 'mc-game-design',
    microcredentialTitle: 'AI-Enhanced Educational Game Design',
    learnerName: 'Sarah Miller',
    learnerId: 'u-999',
    status: 'submitted',
    submittedAt: '2024-03-10T14:30:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    evidence: [
        {
            id: 'ev-1',
            fileName: 'Design_Doc_v2.pdf',
            fileUrl: '#',
            fileType: 'pdf',
            description: 'Main GDD',
            uploadedAt: '2024-03-10'
        }
    ],
    content: {
        contextBrief: 'Middle school biology students learning about cellular respiration.',
        targetAudience: '7th Grade',
        alignmentMap: [
            { id: 'a-1', learningObjective: 'Identify parts of a cell', learningActivity: 'Scavenger hunt in game', assessment: 'Quiz at end of level' }
        ],
        genAiToolsUsed: 'ChatGPT 4.0, Midjourney',
        promptDocumentation: 'Used ChatGPT to generate NPC dialogue. Prompt: "Act as a mitochondria..."',
        prototypeLink: 'https://itch.io/my-game',
        testingNotes: 'Students found the controls difficult in level 2.',
        reflectionText: 'This process taught me that alignment is harder than it looks.'
    },
    history: [
      {
        status: 'draft',
        timestamp: '2024-03-08T10:00:00Z',
        actorName: 'Sarah Miller'
      },
      {
        status: 'submitted',
        timestamp: '2024-03-10T14:30:00Z',
        actorName: 'Sarah Miller'
      }
    ]
  },
  {
    id: 'sub-2',
    microcredentialId: 'mc-genai-media',
    microcredentialTitle: 'GenAI-Enhanced Educational Media',
    learnerName: 'John Doe',
    learnerId: 'u-888',
    status: 'approved',
    submittedAt: '2024-03-01T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
    reviewerComments: 'Excellent use of Midjourney for the history module assets.',
    evidence: [],
    content: {
        contextBrief: 'History class',
        targetAudience: 'High School',
        alignmentMap: [],
        genAiToolsUsed: 'Midjourney',
        promptDocumentation: '',
        prototypeLink: '',
        testingNotes: '',
        reflectionText: ''
    },
    history: [
        {
          status: 'submitted',
          timestamp: '2024-03-01T09:15:00Z',
          actorName: 'John Doe'
        },
        {
          status: 'under_review',
          timestamp: '2024-03-02T10:00:00Z',
          actorName: 'Jewoong Moon, Ph.D.'
        },
        {
          status: 'approved',
          timestamp: '2024-03-05T09:15:00Z',
          actorName: 'Jewoong Moon, Ph.D.',
          comment: 'Excellent use of Midjourney for the history module assets.'
        }
      ]
  }
];

// --- Empty Submission Template ---
export const EMPTY_SUBMISSION: SubmissionContent = {
    contextBrief: '',
    targetAudience: '',
    alignmentMap: [{ id: 'row-1', learningObjective: '', learningActivity: '', assessment: '' }],
    genAiToolsUsed: '',
    promptDocumentation: '',
    prototypeLink: '',
    testingNotes: '',
    reflectionText: ''
};