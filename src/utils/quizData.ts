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
    id: 'django-quiz-set-1',
    title: 'Django Quiz Set 1',
    description: 'Test your knowledge of Django frameworks and concepts',
    totalMarks: 100,
    timeLimit: 10800, // 3 hours
    questions: [
      // Section 1: MCQs (10 questions, 20 marks)
      {
        id: '1',
        type: 'multiple-choice',
        text: 'Which command is used to create a new Django project?',
        questionText: 'Which command is used to create a new Django project?',
        options: [
          { id: 'a', text: 'django-admin startapp', isCorrect: false },
          { id: 'b', text: 'django-admin startproject', isCorrect: true },
          { id: 'c', text: 'python manage.py startproject', isCorrect: false },
          { id: 'd', text: 'python manage.py startapp', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '2',
        type: 'multiple-choice',
        text: 'Which file in a Django project contains database configurations?',
        questionText: 'Which file in a Django project contains database configurations?',
        options: [
          { id: 'a', text: 'settings.py', isCorrect: true },
          { id: 'b', text: 'urls.py', isCorrect: false },
          { id: 'c', text: 'models.py', isCorrect: false },
          { id: 'd', text: 'database.py', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '3',
        type: 'multiple-choice',
        text: 'Which function is used to render an HTML template in Django?',
        questionText: 'Which function is used to render an HTML template in Django?',
        options: [
          { id: 'a', text: 'render_template()', isCorrect: false },
          { id: 'b', text: 'render_html()', isCorrect: false },
          { id: 'c', text: 'render()', isCorrect: true },
          { id: 'd', text: 'show_template()', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '4',
        type: 'multiple-choice',
        text: 'Which of the following is the correct way to define a model in Django?',
        questionText: 'Which of the following is the correct way to define a model in Django?',
        options: [
          { id: 'a', text: 'class Model(models.Schema):', isCorrect: false },
          { id: 'b', text: 'class Model(Django.Model):', isCorrect: false },
          { id: 'c', text: 'class Model(models.Model):', isCorrect: true },
          { id: 'd', text: 'class Model(Django.Schema):', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '5',
        type: 'multiple-choice',
        text: 'Which command is used to apply migrations in Django?',
        questionText: 'Which command is used to apply migrations in Django?',
        options: [
          { id: 'a', text: 'python manage.py migrate', isCorrect: true },
          { id: 'b', text: 'python manage.py makemigrations', isCorrect: false },
          { id: 'c', text: 'python manage.py runserver', isCorrect: false },
          { id: 'd', text: 'python manage.py syncdb', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '6',
        type: 'multiple-choice',
        text: 'What is the purpose of Django\'s ORM?',
        questionText: 'What is the purpose of Django\'s ORM?',
        options: [
          { id: 'a', text: 'To define URL routing', isCorrect: false },
          { id: 'b', text: 'To manage static files', isCorrect: false },
          { id: 'c', text: 'To interact with the database using Python', isCorrect: true },
          { id: 'd', text: 'To render HTML templates', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '7',
        type: 'multiple-choice',
        text: 'Which HTTP method is commonly used to submit forms in Django?',
        questionText: 'Which HTTP method is commonly used to submit forms in Django?',
        options: [
          { id: 'a', text: 'GET', isCorrect: false },
          { id: 'b', text: 'POST', isCorrect: true },
          { id: 'c', text: 'PUT', isCorrect: false },
          { id: 'd', text: 'DELETE', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '8',
        type: 'multiple-choice',
        text: 'What is the default database used by Django?',
        questionText: 'What is the default database used by Django?',
        options: [
          { id: 'a', text: 'MySQL', isCorrect: false },
          { id: 'b', text: 'PostgreSQL', isCorrect: false },
          { id: 'c', text: 'SQLite', isCorrect: true },
          { id: 'd', text: 'MongoDB', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '9',
        type: 'multiple-choice',
        text: 'Which middleware is used for session management in Django?',
        questionText: 'Which middleware is used for session management in Django?',
        options: [
          { id: 'a', text: 'SessionMiddleware', isCorrect: true },
          { id: 'b', text: 'AuthMiddleware', isCorrect: false },
          { id: 'c', text: 'SecurityMiddleware', isCorrect: false },
          { id: 'd', text: 'CacheMiddleware', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '10',
        type: 'multiple-choice',
        text: 'Which Django command is used to create a superuser?',
        questionText: 'Which Django command is used to create a superuser?',
        options: [
          { id: 'a', text: 'python manage.py createsuperuser', isCorrect: true },
          { id: 'b', text: 'python manage.py createsuper', isCorrect: false },
          { id: 'c', text: 'python manage.py superuser', isCorrect: false },
          { id: 'd', text: 'python manage.py newadmin', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      
      // Section 2: Coding Questions (3 questions, 50 marks)
      {
        id: '11',
        type: 'coding',
        text: 'Write a Django model for a BlogPost with fields for title, content, author, and publication date.',
        questionText: 'Write a Django model for a BlogPost with fields for title, content, author, and publication date.',
        code: '# Write your Django model here\n',
        codeSnippet: '# Write your Django model here\n',
        correctAnswer: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass BlogPost(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    publication_date = models.DateTimeField(auto_now_add=True)\n    \n    def __str__(self):\n        return self.title',
        section: 'coding',
        marks: 10,
      },
      {
        id: '12',
        type: 'coding',
        text: 'Create a Django view that handles both GET and POST requests to process a contact form.',
        questionText: 'Create a Django view that handles both GET and POST requests to process a contact form.',
        code: '# Write your Django view here\n',
        codeSnippet: '# Write your Django view here\n',
        correctAnswer: 'from django.shortcuts import render, redirect\nfrom django.contrib import messages\nfrom .forms import ContactForm\n\ndef contact_view(request):\n    if request.method == "POST":\n        form = ContactForm(request.POST)\n        if form.is_valid():\n            form.save()\n            messages.success(request, "Your message has been sent!")\n            return redirect("contact")\n    else:\n        form = ContactForm()\n    \n    return render(request, "contact.html", {"form": form})',
        section: 'coding',
        marks: 20,
      },
      {
        id: '13',
        type: 'coding',
        text: 'Write a Django query to retrieve all users who joined within the last 30 days.',
        questionText: 'Write a Django query to retrieve all users who joined within the last 30 days.',
        code: '# Write your Django query here\n',
        codeSnippet: '# Write your Django query here\n',
        correctAnswer: 'from django.contrib.auth.models import User\nfrom django.utils import timezone\nfrom datetime import timedelta\n\n# Get the current time\ncurrent_time = timezone.now()\n\n# Calculate the date 30 days ago\nthirty_days_ago = current_time - timedelta(days=30)\n\n# Query for users who joined in the last 30 days\nrecent_users = User.objects.filter(date_joined__gte=thirty_days_ago)',
        section: 'coding',
        marks: 20,
      },
      
      // Section 3: Debugging Questions (2 questions, 30 marks)
      {
        id: '14',
        type: 'debugging',
        text: 'Fix the following Django model definition that throws errors.',
        questionText: 'Fix the following Django model definition that throws errors.',
        code: 'from django.db import models\n\nclass Blog:\n    title = models.CharField(max=255)\n    content = models.Text()\n    author = models.ForeignKey(\'User\', on_delete=models.CASCADE)\n    published_on = models.DateTime()',
        codeSnippet: 'from django.db import models\n\nclass Blog:\n    title = models.CharField(max=255)\n    content = models.Text()\n    author = models.ForeignKey(\'User\', on_delete=models.CASCADE)\n    published_on = models.DateTime()',
        correctAnswer: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass Blog(models.Model):\n    title = models.CharField(max_length=255)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    published_on = models.DateTimeField()',
        section: 'debugging',
        marks: 15,
      },
      {
        id: '15',
        type: 'debugging',
        text: 'The following Django view is not returning the expected response. Identify and fix the issue.',
        questionText: 'The following Django view is not returning the expected response. Identify and fix the issue.',
        code: 'from django.http import JsonResponse\n\ndef get_user_data(request):\n    if request.GET["user_id"]:\n        user_id = request.GET["user_id"]\n        return JsonResponse({"user": user_id})\n    else:\n        return JsonResponse({"error": "User ID not provided"})',
        codeSnippet: 'from django.http import JsonResponse\n\ndef get_user_data(request):\n    if request.GET["user_id"]:\n        user_id = request.GET["user_id"]\n        return JsonResponse({"user": user_id})\n    else:\n        return JsonResponse({"error": "User ID not provided"})',
        correctAnswer: 'from django.http import JsonResponse\n\ndef get_user_data(request):\n    if "user_id" in request.GET:\n        user_id = request.GET["user_id"]\n        return JsonResponse({"user": user_id})\n    else:\n        return JsonResponse({"error": "User ID not provided"})',
        section: 'debugging',
        marks: 15,
      },
    ],
  },
  // ... keep existing code (all other quiz sets)
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
