export interface Question {
  id: number;
  section: 'mcq' | 'coding' | 'debugging';
  questionText: string;
  marks?: number;
  options?: string[];
  correctAnswer?: string | number;
  codeSnippet?: string;
  answer?: string;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  timeLimit: number; // in seconds
  questions: Question[];
}

let quizSets: QuizSet[] = [
  {
    id: "django-set-1",
    title: "Django Technical Test - Set 1",
    description: "Test your knowledge of Django fundamentals including project setup, models, views, and debugging.",
    totalMarks: 100,
    timeLimit: 3 * 60 * 60, // 3 hours in seconds
    questions: [
      // Section 1: Multiple Choice Questions
      {
        id: 1,
        section: 'mcq',
        questionText: 'Which command is used to create a new Django project?',
        options: [
          'a) django-admin startapp',
          'b) django-admin startproject',
          'c) python manage.py startproject',
          'd) python manage.py startapp'
        ],
        correctAnswer: 1, // b
        marks: 2
      },
      {
        id: 2,
        section: 'mcq',
        questionText: 'Which file in a Django project contains database configurations?',
        options: [
          'a) settings.py',
          'b) urls.py',
          'c) models.py',
          'd) database.py'
        ],
        correctAnswer: 0, // a
        marks: 2
      },
      {
        id: 3,
        section: 'mcq',
        questionText: 'Which function is used to render an HTML template in Django?',
        options: [
          'a) render_template()',
          'b) render_html()',
          'c) render()',
          'd) show_template()'
        ],
        correctAnswer: 2, // c
        marks: 2
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'Which of the following is the correct way to define a model in Django?',
        options: [
          'a) class Model(models.Schema):',
          'b) class Model(Django.Model):',
          'c) class Model(models.Model):',
          'd) class Model(Django.Schema):'
        ],
        correctAnswer: 2, // c
        marks: 2
      },
      {
        id: 5,
        section: 'mcq',
        questionText: 'Which command is used to apply migrations in Django?',
        options: [
          'a) python manage.py migrate',
          'b) python manage.py makemigrations',
          'c) python manage.py runserver',
          'd) python manage.py syncdb'
        ],
        correctAnswer: 0, // a
        marks: 2
      },
      {
        id: 6,
        section: 'mcq',
        questionText: 'What is the purpose of Django\'s ORM?',
        options: [
          'a) To define URL routing',
          'b) To manage static files',
          'c) To interact with the database using Python',
          'd) To render HTML templates'
        ],
        correctAnswer: 2, // c
        marks: 2
      },
      {
        id: 7,
        section: 'mcq',
        questionText: 'Which HTTP method is commonly used to submit forms in Django?',
        options: [
          'a) GET',
          'b) POST',
          'c) PUT',
          'd) DELETE'
        ],
        correctAnswer: 1, // b
        marks: 2
      },
      {
        id: 8,
        section: 'mcq',
        questionText: 'What is the default database used by Django?',
        options: [
          'a) MySQL',
          'b) PostgreSQL',
          'c) SQLite',
          'd) MongoDB'
        ],
        correctAnswer: 2, // c
        marks: 2
      },
      {
        id: 9,
        section: 'mcq',
        questionText: 'Which middleware is used for session management in Django?',
        options: [
          'a) SessionMiddleware',
          'b) AuthMiddleware',
          'c) SecurityMiddleware',
          'd) CacheMiddleware'
        ],
        correctAnswer: 0, // a
        marks: 2
      },
      {
        id: 10,
        section: 'mcq',
        questionText: 'Which Django command is used to create a superuser?',
        options: [
          'a) python manage.py createsuperuser',
          'b) python manage.py createsuper',
          'c) python manage.py superuser',
          'd) python manage.py newadmin'
        ],
        correctAnswer: 0, // a
        marks: 2
      },
      
      // Section 2: Coding Questions
      {
        id: 11,
        section: 'coding',
        questionText: 'Write a Django model for a BlogPost with fields for title, content, author, and publication date.',
        codeSnippet: `from django.db import models

# Write your BlogPost model below:
`,
        correctAnswer: `from django.db import models
from django.contrib.auth.models import User

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    publication_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title`,
        marks: 10
      },
      {
        id: 12,
        section: 'coding',
        questionText: 'Create a Django view that handles both GET and POST requests to process a contact form.',
        codeSnippet: `from django.shortcuts import render
from django.http import HttpResponse
from .forms import ContactForm

# Write your view function below:
`,
        correctAnswer: `from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import ContactForm

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Process the form data
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            # Here you might send an email or save to database
            return HttpResponse('Thank you for your message!')
    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {'form': form})`,
        marks: 20
      },
      {
        id: 13,
        section: 'coding',
        questionText: 'Write a Django query to retrieve all users who joined within the last 30 days.',
        codeSnippet: `from django.contrib.auth.models import User
from django.utils import timezone

# Write your query below:
`,
        correctAnswer: `from django.contrib.auth.models import User
from django.utils import timezone
import datetime

# Get the date 30 days ago
thirty_days_ago = timezone.now() - datetime.timedelta(days=30)

# Query for users who joined after that date
recent_users = User.objects.filter(date_joined__gte=thirty_days_ago)`,
        marks: 20
      },
      
      // Section 3: Debugging Questions
      {
        id: 14,
        section: 'debugging',
        questionText: 'Fix the following Django model definition that throws errors.',
        codeSnippet: `from django.db import models

class Blog:
    title = models.CharField(max=255)
    content = models.Text()
    author = models.ForeignKey('User', on_delete=models.CASCADE)
    published_on = models.DateTime()`,
        correctAnswer: `from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    published_on = models.DateTimeField()`,
        marks: 15
      },
      {
        id: 15,
        section: 'debugging',
        questionText: 'The following Django view is not returning the expected response. Identify and fix the issue.',
        codeSnippet: `from django.http import JsonResponse

def get_user_data(request):
    if request.GET["user_id"]:
        user_id = request.GET["user_id"]
        return JsonResponse({"user": user_id})
    else:
        return JsonResponse({"error": "User ID not provided"})`,
        correctAnswer: `from django.http import JsonResponse

def get_user_data(request):
    if request.GET.get("user_id"):
        user_id = request.GET["user_id"]
        return JsonResponse({"user": user_id})
    else:
        return JsonResponse({"error": "User ID not provided"})`,
        marks: 15
      }
    ]
  },
  {
    id: "django-set-2",
    title: "Django Technical Test - Set 2",
    description: "Advanced Django concepts including middleware, signals, authentication, and REST APIs.",
    totalMarks: 100,
    timeLimit: 3 * 60 * 60, // 3 hours in seconds
    questions: [
      // Section 1: MCQs
      {
        id: 1,
        section: 'mcq',
        questionText: 'Which package is commonly used to create RESTful APIs in Django?',
        options: [
          'a) django-rest-api',
          'b) django-rest-framework',
          'c) django-api',
          'd) django-restful'
        ],
        correctAnswer: 1, // b
        marks: 2
      },
      {
        id: 2,
        section: 'mcq',
        questionText: 'Which decorator is used to restrict a view to authenticated users only?',
        options: [
          'a) @login_required',
          'b) @authenticated_only',
          'c) @user_passes_test',
          'd) @requires_login'
        ],
        correctAnswer: 0, // a
        marks: 2
      },
      {
        id: 3,
        section: 'mcq',
        questionText: 'In Django REST Framework, which class is used to validate incoming data?',
        options: [
          'a) Validator',
          'b) FormValidator',
          'c) Serializer',
          'd) DataValidator'
        ],
        correctAnswer: 2, // c
        marks: 2
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'Which signal is triggered before a model instance is saved?',
        options: [
          'a) pre_save',
          'b) before_save',
          'c) save_start',
          'd) model_presave'
        ],
        correctAnswer: 0, // a
        marks: 2
      },
      {
        id: 5,
        section: 'mcq',
        questionText: 'Which of the following is not a Django management command?',
        options: [
          'a) makemigrations',
          'b) collectstatic',
          'c) compileTemplates',
          'd) dumpdata'
        ],
        correctAnswer: 2, // c
        marks: 2
      },
      // Add more MCQs for Set 2...

      // Section 2: Coding Questions for Set 2
      {
        id: 11,
        section: 'coding',
        questionText: 'Create a Django REST Framework serializer for a Product model.',
        codeSnippet: `from rest_framework import serializers
from .models import Product

# Write your serializer below:
`,
        correctAnswer: `from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'created_at']
        read_only_fields = ['id', 'created_at']`,
        marks: 10
      },
      // Add more coding questions for Set 2...

      // Section 3: Debugging Questions for Set 2
      {
        id: 14,
        section: 'debugging',
        questionText: 'Fix the following Django REST Framework view that is not properly handling authentication.',
        codeSnippet: `from rest_framework.views import APIView
from rest_framework.response import Response

class UserProfileView(APIView):
    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email
        })`,
        correctAnswer: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email
        })`,
        marks: 15
      }
      // Add more debugging questions for Set 2...
    ]
  }
];

export { quizSets };

export interface QuizState {
  quizSetId: string | null;
  currentSection: 'mcq' | 'coding' | 'debugging';
  currentQuestionIndex: number;
  answers: Record<number, string | number>;
  score: number;
  timeRemaining: number;
  isCompleted: boolean;
}

export function calculateScore(userAnswers: Record<number, string | number>, questions: Question[]): number {
  let totalScore = 0;
  
  for (const question of questions) {
    const userAnswer = userAnswers[question.id];
    
    if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
      totalScore += question.marks || 0;
    }
  }
  
  return totalScore;
}

export function getQuizSetById(id: string): QuizSet | undefined {
  return quizSets.find(set => set.id === id);
}

export function getQuestionsForSection(quizSetId: string, section: 'mcq' | 'coding' | 'debugging'): Question[] {
  const quizSet = getQuizSetById(quizSetId);
  if (!quizSet) return [];
  
  return quizSet.questions.filter(q => q.section === section);
}

export function addQuizSet(quizSet: QuizSet): void {
  const existingIndex = quizSets.findIndex(set => set.id === quizSet.id);
  
  if (existingIndex !== -1) {
    quizSets[existingIndex] = quizSet;
  } else {
    quizSets = [...quizSets, quizSet];
  }
  
  console.log('Quiz set added:', quizSet.id);
}
