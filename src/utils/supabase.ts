
import { supabase } from '@/lib/supabase';
import { QuizSet, Question, QuizResult } from './quizData';

// Quiz Sets
export const fetchQuizSets = async () => {
  const { data, error } = await supabase
    .from('quiz_sets')
    .select('*');
  
  if (error) {
    console.error('Error fetching quiz sets:', error);
    throw error;
  }
  
  return data as QuizSet[];
};

export const fetchQuizSet = async (id: string) => {
  const { data, error } = await supabase
    .from('quiz_sets')
    .select(`
      *,
      questions:quiz_questions(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching quiz set ${id}:`, error);
    throw error;
  }
  
  return {
    ...data,
    questions: data.questions as Question[]
  } as QuizSet;
};

export const createQuizSet = async (quizSet: Omit<QuizSet, 'id'>) => {
  // Insert the quiz set first
  const { data: quizSetData, error: quizSetError } = await supabase
    .from('quiz_sets')
    .insert({
      title: quizSet.title,
      description: quizSet.description,
      totalMarks: quizSet.totalMarks,
      timeLimit: quizSet.timeLimit
    })
    .select()
    .single();
  
  if (quizSetError) {
    console.error('Error creating quiz set:', quizSetError);
    throw quizSetError;
  }
  
  // Then insert all the questions associated with this quiz set
  const questionsWithQuizSetId = quizSet.questions.map(q => ({
    ...q,
    quiz_set_id: quizSetData.id
  }));
  
  const { data: questionData, error: questionError } = await supabase
    .from('quiz_questions')
    .insert(questionsWithQuizSetId);
  
  if (questionError) {
    console.error('Error creating quiz questions:', questionError);
    throw questionError;
  }
  
  return {
    ...quizSetData,
    questions: quizSet.questions
  } as QuizSet;
};

export const updateQuizSet = async (quizSet: QuizSet) => {
  // Update the quiz set
  const { error: quizSetError } = await supabase
    .from('quiz_sets')
    .update({
      title: quizSet.title,
      description: quizSet.description,
      totalMarks: quizSet.totalMarks,
      timeLimit: quizSet.timeLimit
    })
    .eq('id', quizSet.id);
  
  if (quizSetError) {
    console.error('Error updating quiz set:', quizSetError);
    throw quizSetError;
  }
  
  // Delete all existing questions for this quiz set
  const { error: deleteError } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('quiz_set_id', quizSet.id);
  
  if (deleteError) {
    console.error('Error deleting existing questions:', deleteError);
    throw deleteError;
  }
  
  // Insert the updated questions
  const questionsWithQuizSetId = quizSet.questions.map(q => ({
    ...q,
    quiz_set_id: quizSet.id
  }));
  
  const { error: questionError } = await supabase
    .from('quiz_questions')
    .insert(questionsWithQuizSetId);
  
  if (questionError) {
    console.error('Error creating updated quiz questions:', questionError);
    throw questionError;
  }
  
  return quizSet;
};

export const deleteQuizSet = async (id: string) => {
  // Quiz questions will be cascade-deleted due to foreign key constraints
  const { error } = await supabase
    .from('quiz_sets')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting quiz set:', error);
    throw error;
  }
  
  return true;
};

// Quiz Results
export const saveQuizResult = async (result: Omit<QuizResult, 'id'>) => {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      user_id: result.userId,
      username: result.username,
      quiz_set_id: result.quizSetId,
      score: result.score,
      total_marks: result.totalMarks,
      completed_at: result.completedAt,
      answers: result.answers
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
  
  return data as QuizResult;
};

export const getUserResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user results:', error);
    throw error;
  }
  
  return data as QuizResult[];
};

export const getQuizResults = async (quizSetId: string) => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('quiz_set_id', quizSetId);
  
  if (error) {
    console.error('Error fetching quiz results:', error);
    throw error;
  }
  
  return data as QuizResult[];
};
