import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'coding' | 'debugging';
  text: string;
  questionText?: string;
  code?: string;
  codeSnippet?: string;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer?: string | number;
  section: string;
  marks: number;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  timeLimit: number; // in seconds
  questions: Question[];
}

export interface SectionScore {
  section: string;
  score: number;
  totalMarks: number;
  percentage: number;
}

export interface QuizState {
  quizSetId: string | null;
  currentSection: string;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  score: number;
  timeRemaining: number;
  isCompleted: boolean;
}

// Sample quiz data (as fallback if DB fetch fails)
const mockQuizSets: QuizSet[] = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics',
    totalMarks: 10,
    timeLimit: 600, // 10 minutes
    questions: [
      {
        id: 'react-1',
        type: 'multiple-choice',
        text: 'What is React?',
        options: [
          { id: 'a', text: 'A JavaScript library for building user interfaces', isCorrect: true },
          { id: 'b', text: 'A server-side programming language', isCorrect: false },
          { id: 'c', text: 'A database management system', isCorrect: false },
        ],
        section: 'React',
        marks: 5,
      },
      {
        id: 'react-2',
        type: 'text',
        text: 'What is JSX?',
        correctAnswer: 'JavaScript XML',
        section: 'React',
        marks: 5,
      },
    ],
  },
  {
    id: 'javascript-advanced',
    title: 'Advanced JavaScript',
    description: 'Test your knowledge of advanced JavaScript concepts',
    totalMarks: 15,
    timeLimit: 900, // 15 minutes
    questions: [
      {
        id: 'js-1',
        type: 'multiple-choice',
        text: 'What is a closure in JavaScript?',
        options: [
          { id: 'a', text: 'A function that has access to the parent scope, even after the parent function has closed.', isCorrect: true },
          { id: 'b', text: 'A way to define private variables in JavaScript.', isCorrect: false },
          { id: 'c', text: 'A method for asynchronous programming.', isCorrect: false },
        ],
        section: 'JavaScript',
        marks: 5,
      },
      {
        id: 'js-2',
        type: 'coding',
        text: 'Write a function to implement function currying',
        code: '// write your code here',
        section: 'JavaScript',
        marks: 10,
      },
    ],
  },
  {
    id: 'typescript-basics',
    title: 'TypeScript Basics',
    description: 'Test your knowledge of TypeScript fundamentals',
    totalMarks: 12,
    timeLimit: 600, // 10 minutes
    questions: [
      {
        id: 'ts-1',
        type: 'multiple-choice',
        text: 'What is TypeScript?',
        options: [
          { id: 'a', text: 'A superset of JavaScript that adds static typing', isCorrect: true },
          { id: 'b', text: 'A new programming language', isCorrect: false },
          { id: 'c', text: 'A JavaScript runtime environment', isCorrect: false },
        ],
        section: 'TypeScript',
        marks: 6,
      },
      {
        id: 'ts-2',
        type: 'text',
        text: 'What is the primary benefit of using TypeScript?',
        correctAnswer: 'Static typing',
        section: 'TypeScript',
        marks: 6,
      },
    ],
  },
];

// Function to save a new quiz set to Supabase
export const saveQuizSet = async (quizSet: QuizSet): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      return null;
    }
    
    const userId = userData.user.id;
    const quizSetId = quizSet.id || uuidv4();
    
    // We need to stringify the questions array to store it as JSONB
    const { data, error } = await supabase
      .from('custom_quiz_sets')
      .insert({
        user_id: userId,
        quiz_set_id: quizSetId,
        title: quizSet.title,
        description: quizSet.description,
        total_marks: quizSet.totalMarks,
        time_limit: quizSet.timeLimit,
        questions: JSON.stringify(quizSet.questions) // Convert to JSON string before inserting
      });
    
    if (error) {
      console.error('Error saving quiz set:', error);
      return null;
    }
    
    return quizSetId;
  } catch (error) {
    console.error('Unexpected error saving quiz set:', error);
    return null;
  }
};

// Adding this as an alias for saveQuizSet for backward compatibility
export const addQuizSet = saveQuizSet;

// Function to fetch all quiz sets from Supabase and mock data
export const fetchQuizSets = async (): Promise<QuizSet[]> => {
  try {
    // Fetch custom quiz sets from Supabase
    const { data: customSets, error } = await supabase
      .from('custom_quiz_sets')
      .select('*');
    
    if (error) {
      console.error('Error fetching custom quiz sets:', error);
      return mockQuizSets; // Fallback to mock data
    }
    
    // Transform the data from Supabase format to our app's format
    const transformedCustomSets: QuizSet[] = customSets.map(set => ({
      id: set.quiz_set_id,
      title: set.title,
      description: set.description,
      totalMarks: set.total_marks,
      timeLimit: set.time_limit,
      questions: typeof set.questions === 'string' 
        ? JSON.parse(set.questions) 
        : set.questions // Parse the JSON string back to an array
    }));
    
    // Combine with mock data
    return [...transformedCustomSets, ...mockQuizSets];
  } catch (error) {
    console.error('Unexpected error fetching quiz sets:', error);
    return mockQuizSets; // Fallback to mock data
  }
};

// Function to get a specific quiz set by ID
export const getQuizSetById = async (id: string): Promise<QuizSet | null> => {
  try {
    // First check if it's a custom quiz set
    const { data: customSet, error } = await supabase
      .from('custom_quiz_sets')
      .select('*')
      .eq('quiz_set_id', id)
      .single();
    
    if (customSet) {
      return {
        id: customSet.quiz_set_id,
        title: customSet.title,
        description: customSet.description,
        totalMarks: customSet.total_marks,
        timeLimit: customSet.time_limit,
        questions: typeof customSet.questions === 'string' 
          ? JSON.parse(customSet.questions)
          : customSet.questions // Parse the JSON string back to an array
      };
    }
    
    // If not found in database, check mock data
    const mockSet = mockQuizSets.find(set => set.id === id);
    return mockSet || null;
  } catch (error) {
    console.error('Error fetching quiz set:', error);
    // Check mock data as fallback
    const mockSet = mockQuizSets.find(set => set.id === id);
    return mockSet || null;
  }
};

// Function to save quiz results to Supabase
export const saveQuizResults = async (
  quizSetId: string,
  score: number,
  totalMarks: number,
  timeSpent: number,
  answers: any,
  sectionScores: any,
  attendeeDetails: any = null
): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      return false;
    }
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('quiz_history')
      .insert({
        user_id: userId,
        quiz_set_id: quizSetId,
        score,
        total_marks: totalMarks,
        time_spent: timeSpent,
        answers: JSON.stringify(answers),
        section_scores: JSON.stringify(sectionScores),
        attendee_details: attendeeDetails ? JSON.stringify(attendeeDetails) : null
      });
    
    if (error) {
      console.error('Error saving quiz results:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error saving quiz results:', error);
    return false;
  }
};

// Adding this as an alias for saveQuizResults for backward compatibility
export const saveQuizResult = saveQuizResults;

// Function to calculate section scores
export const calculateSectionScores = (
  questions: Question[],
  answers: Record<string, any>
): SectionScore[] => {
  // Group questions by section
  const sections: Record<string, Question[]> = {};
  
  questions.forEach(q => {
    if (!sections[q.section]) {
      sections[q.section] = [];
    }
    sections[q.section].push(q);
  });
  
  // Calculate scores for each section
  const sectionScores: SectionScore[] = [];
  
  Object.entries(sections).forEach(([section, questions]) => {
    let sectionScore = 0;
    const sectionTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    
    questions.forEach(q => {
      const answer = answers[q.id];
      
      if (q.type === 'multiple-choice' && Array.isArray(q.options)) {
        const correctOption = q.options.find(opt => opt.isCorrect);
        if (correctOption && answer === correctOption.id) {
          sectionScore += q.marks;
        }
      } else if (q.type === 'text' && q.correctAnswer) {
        if (answer && typeof answer === 'string' && typeof q.correctAnswer === 'string' && 
            answer.toLowerCase() === q.correctAnswer.toLowerCase()) {
          sectionScore += q.marks;
        }
      }
      // For coding questions, we don't auto-grade
    });
    
    const percentage = (sectionTotalMarks > 0) 
      ? Math.round((sectionScore / sectionTotalMarks) * 100) 
      : 0;
    
    sectionScores.push({
      section,
      score: sectionScore,
      totalMarks: sectionTotalMarks,
      percentage
    });
  });
  
  return sectionScores;
};

// Simple function to calculate score from answers
export const calculateScore = (answers: Record<string, any>, questions: Question[]): number => {
  let totalScore = 0;
  
  questions.forEach(q => {
    const answer = answers[q.id];
    
    if (q.type === 'multiple-choice' && Array.isArray(q.options)) {
      const correctOption = q.options.find(opt => opt.isCorrect);
      if (correctOption && answer === correctOption.id) {
        totalScore += q.marks;
      }
    } else if (q.type === 'text' && q.correctAnswer) {
      if (answer && typeof answer === 'string' && typeof q.correctAnswer === 'string' && 
          answer.toLowerCase() === q.correctAnswer.toLowerCase()) {
        totalScore += q.marks;
      }
    }
    // For coding questions, we don't auto-grade
  });
  
  return totalScore;
};

// Helper function to get questions for a specific section
export const getQuestionsForSection = (questions: Question[], section: string): Question[] => {
  return questions.filter(q => q.section === section);
};

// Function to fetch quiz history for current user
export const fetchQuizHistory = async (): Promise<any[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      return [];
    }
    
    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .order('completed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching quiz history:', error);
      return [];
    }
    
    // Parse JSON fields
    return data.map(item => ({
      ...item,
      answers: typeof item.answers === 'string' ? JSON.parse(item.answers) : item.answers,
      section_scores: typeof item.section_scores === 'string' ? JSON.parse(item.section_scores) : item.section_scores,
      attendee_details: item.attendee_details ? 
        (typeof item.attendee_details === 'string' ? JSON.parse(item.attendee_details) : item.attendee_details) 
        : null
    }));
  } catch (error) {
    console.error('Unexpected error fetching quiz history:', error);
    return [];
  }
};
