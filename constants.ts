import { Course } from './types';

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