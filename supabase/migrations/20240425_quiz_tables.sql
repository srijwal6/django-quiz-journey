
-- Create tables

-- Quiz Sets
CREATE TABLE quiz_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  total_marks INTEGER NOT NULL,
  time_limit INTEGER NOT NULL, -- Time limit in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_set_id UUID REFERENCES quiz_sets(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('mcq', 'coding', 'debugging')),
  question_text TEXT NOT NULL,
  marks INTEGER NOT NULL,
  options JSONB, -- For MCQ options
  correct_answer JSONB, -- Can be number (for MCQ) or string (for coding/debugging)
  code_snippet TEXT, -- For coding/debugging questions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  quiz_set_id UUID REFERENCES quiz_sets(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  answers JSONB NOT NULL, -- Record of answers { questionId: answer }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies

-- Enable RLS on all tables
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Quiz Sets - anyone can read, only authenticated users can create/update/delete
CREATE POLICY "Quiz sets are viewable by everyone" 
  ON quiz_sets FOR SELECT USING (true);

CREATE POLICY "Quiz sets can be created by authenticated users" 
  ON quiz_sets FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Quiz sets can be updated by authenticated users" 
  ON quiz_sets FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Quiz sets can be deleted by authenticated users" 
  ON quiz_sets FOR DELETE USING (auth.role() = 'authenticated');

-- Quiz Questions - anyone can read, only authenticated users can create/update/delete
CREATE POLICY "Quiz questions are viewable by everyone" 
  ON quiz_questions FOR SELECT USING (true);

CREATE POLICY "Quiz questions can be created by authenticated users" 
  ON quiz_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Quiz questions can be updated by authenticated users" 
  ON quiz_questions FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Quiz questions can be deleted by authenticated users" 
  ON quiz_questions FOR DELETE USING (auth.role() = 'authenticated');

-- Quiz Results - users can only see their own results, only authenticated users can create
CREATE POLICY "Users can view their own quiz results" 
  ON quiz_results FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Quiz results can be created by authenticated users" 
  ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON quiz_sets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

-- Indexes for better performance
CREATE INDEX idx_quiz_questions_quiz_set_id ON quiz_questions(quiz_set_id);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_set_id ON quiz_results(quiz_set_id);
