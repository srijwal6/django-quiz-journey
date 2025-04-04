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
  solution?: string;
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

const mockQuizSets: QuizSet[] = [
  {
    id: 'golang-quiz-set-1',
    title: 'Golang Technical Test - Set 1',
    description: 'Test your knowledge of Go programming language basics, goroutines, and standard libraries',
    totalMarks: 100,
    timeLimit: 10800, // 3 hours
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        text: 'What is the default type of an untyped constant in Go?',
        questionText: 'What is the default type of an untyped constant in Go?',
        options: [
          { id: 'a', text: 'string', isCorrect: false },
          { id: 'b', text: 'int', isCorrect: false },
          { id: 'c', text: 'float64', isCorrect: true },
          { id: 'd', text: 'bool', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '2',
        type: 'multiple-choice',
        text: 'How can you create a new Goroutine in Go?',
        questionText: 'How can you create a new Goroutine in Go?',
        options: [
          { id: 'a', text: 'Using go keyword before a function call', isCorrect: true },
          { id: 'b', text: 'By using newGoroutine() function', isCorrect: false },
          { id: 'c', text: 'By declaring a thread manually', isCorrect: false },
          { id: 'd', text: 'None of the above', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '3',
        type: 'multiple-choice',
        text: 'Which package is used to handle HTTP requests in Go?',
        questionText: 'Which package is used to handle HTTP requests in Go?',
        options: [
          { id: 'a', text: 'http', isCorrect: false },
          { id: 'b', text: 'net/http', isCorrect: true },
          { id: 'c', text: 'web/http', isCorrect: false },
          { id: 'd', text: 'http/server', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '4',
        type: 'multiple-choice',
        text: 'What does the recover function do in Go?',
        questionText: 'What does the recover function do in Go?',
        options: [
          { id: 'a', text: 'Stops a Goroutine', isCorrect: false },
          { id: 'b', text: 'Recovers from a panic', isCorrect: true },
          { id: 'c', text: 'Restarts the application', isCorrect: false },
          { id: 'd', text: 'None of the above', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '5',
        type: 'multiple-choice',
        text: 'How do you define a struct in Go?',
        questionText: 'How do you define a struct in Go?',
        options: [
          { id: 'a', text: 'Using type StructName struct {}', isCorrect: true },
          { id: 'b', text: 'Using struct StructName {}', isCorrect: false },
          { id: 'c', text: 'Using class StructName {}', isCorrect: false },
          { id: 'd', text: 'Using define StructName struct {}', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '6',
        type: 'multiple-choice',
        text: 'How do you create a slice in Go?',
        questionText: 'How do you create a slice in Go?',
        options: [
          { id: 'a', text: 'Using []type{}', isCorrect: false },
          { id: 'b', text: 'Using make([]type, length, capacity)', isCorrect: false },
          { id: 'c', text: 'Both a and b', isCorrect: true },
          { id: 'd', text: 'None of the above', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '7',
        type: 'multiple-choice',
        text: 'Which of the following statements about interfaces in Go is true?',
        questionText: 'Which of the following statements about interfaces in Go is true?',
        options: [
          { id: 'a', text: 'Interfaces can have fields', isCorrect: false },
          { id: 'b', text: 'Interfaces define method sets', isCorrect: true },
          { id: 'c', text: 'Interfaces support inheritance', isCorrect: false },
          { id: 'd', text: 'Interfaces cannot be used with structs', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '8',
        type: 'multiple-choice',
        text: 'What does defer do in Go?',
        questionText: 'What does defer do in Go?',
        options: [
          { id: 'a', text: 'Executes a function before exiting a block', isCorrect: false },
          { id: 'b', text: 'Executes a function at the end of the surrounding function', isCorrect: true },
          { id: 'c', text: 'Pauses the execution of a function', isCorrect: false },
          { id: 'd', text: 'None of the above', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '9',
        type: 'multiple-choice',
        text: 'Which function is used to format strings in Go?',
        questionText: 'Which function is used to format strings in Go?',
        options: [
          { id: 'a', text: 'fmt.Printf()', isCorrect: true },
          { id: 'b', text: 'fmt.Scan()', isCorrect: false },
          { id: 'c', text: 'fmt.Write()', isCorrect: false },
          { id: 'd', text: 'fmt.Parse()', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '10',
        type: 'multiple-choice',
        text: 'How can you create an infinite loop in Go?',
        questionText: 'How can you create an infinite loop in Go?',
        options: [
          { id: 'a', text: 'Using for true {}', isCorrect: false },
          { id: 'b', text: 'Using while(true) {}', isCorrect: false },
          { id: 'c', text: 'Using for {}', isCorrect: false },
          { id: 'd', text: 'Both a and c', isCorrect: true },
        ],
        section: 'mcq',
        marks: 2,
      },
      
      {
        id: '11',
        type: 'coding',
        text: 'Write a function to find the factorial of a number using recursion.',
        questionText: 'Write a function to find the factorial of a number using recursion.',
        codeSnippet: 'package main\n\nimport (\n\t"fmt"\n)\n\n// Implement the factorial function here\nfunc factorial(n int) int {\n\t// Your code here\n}\n\nfunc main() {\n\tfmt.Println(factorial(5)) // Should print 120\n}',
        correctAnswer: 'package main\n\nimport (\n\t"fmt"\n)\n\nfunc factorial(n int) int {\n\tif n <= 1 {\n\t\treturn 1\n\t}\n\treturn n * factorial(n-1)\n}\n\nfunc main() {\n\tfmt.Println(factorial(5)) // Should print 120\n}',
        section: 'coding',
        marks: 10,
      },
      {
        id: '12',
        type: 'coding',
        text: 'Create an HTTP server in Go that responds with "Hello, World!" when accessed at /hello.',
        questionText: 'Create an HTTP server in Go that responds with "Hello, World!" when accessed at /hello.',
        codeSnippet: 'package main\n\nimport (\n\t// Import the required packages\n)\n\nfunc main() {\n\t// Implement the HTTP server here\n}',
        correctAnswer: 'package main\n\nimport (\n\t"fmt"\n\t"net/http"\n)\n\nfunc helloHandler(w http.ResponseWriter, r *http.Request) {\n\tfmt.Fprintf(w, "Hello, World!")\n}\n\nfunc main() {\n\thttp.HandleFunc("/hello", helloHandler)\n\tfmt.Println("Server started at http://localhost:8080")\n\thttp.ListenAndServe(":8080", nil)\n}',
        section: 'coding',
        marks: 20,
      },
      {
        id: '13',
        type: 'coding',
        text: 'Implement a Goroutine-based program that calculates the sum of an array in parallel using channels.',
        questionText: 'Implement a Goroutine-based program that calculates the sum of an array in parallel using channels.',
        codeSnippet: 'package main\n\nimport (\n\t"fmt"\n)\n\n// Implement the parallel sum function using Goroutines and channels\nfunc parallelSum(numbers []int) int {\n\t// Your code here\n}\n\nfunc main() {\n\tnumbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\n\tsum := parallelSum(numbers)\n\tfmt.Println("Sum:", sum) // Should print 55\n}',
        correctAnswer: 'package main\n\nimport (\n\t"fmt"\n\t"sync"\n)\n\nfunc parallelSum(numbers []int) int {\n\tch := make(chan int)\n\twg := sync.WaitGroup{}\n\n\t// Split the numbers into 2 chunks\n\tmid := len(numbers) / 2\n\n\t// Calculate sum of first half\n\twg.Add(1)\n\tgo func() {\n\t\tdefer wg.Done()\n\t\tsum := 0\n\t\tfor _, num := range numbers[:mid] {\n\t\t\tsum += num\n\t\t}\n\t\tch <- sum\n\t}()\n\n\t// Calculate sum of second half\n\twg.Add(1)\n\tgo func() {\n\t\tdefer wg.Done()\n\t\tsum := 0\n\t\tfor _, num := range numbers[mid:] {\n\t\t\tsum += num\n\t\t}\n\t\tch <- sum\n\t}()\n\n\t// Wait for goroutines to finish\n\tgo func() {\n\t\twg.Wait()\n\t\tclose(ch)\n\t}()\n\n\t// Get results from channel\n\ttotalSum := 0\n\tfor sum := range ch {\n\t\ttotalSum += sum\n\t}\n\n\treturn totalSum\n}',
        section: 'coding',
        marks: 20,
      },
      
      {
        id: '14',
        type: 'debugging',
        text: 'Fix the following Go program that does not compile.',
        questionText: 'Fix the following Go program that does not compile.',
        codeSnippet: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var nums = []int{1, 2, 3, 4, 5}\n    for i := range nums {\n        fmt.Println(i, nums(i))\n    }\n}',
        correctAnswer: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var nums = []int{1, 2, 3, 4, 5}\n    for i := range nums {\n        fmt.Println(i, nums[i])\n    }\n}',
        solution: 'The issue is with accessing array elements. In Go, you use square brackets [] to access array/slice elements, not parentheses (). Changed nums(i) to nums[i].',
        section: 'debugging',
        marks: 15,
      },
      {
        id: '15',
        type: 'debugging',
        text: 'Optimize the following Go program for better performance using Goroutines.',
        questionText: 'Optimize the following Go program for better performance using Goroutines.',
        codeSnippet: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc work(id int) {\n    time.Sleep(1 * time.Second)\n    fmt.Println("Worker", id, "done")\n}\n\nfunc main() {\n    for i := 1; i <= 5; i++ {\n        go work(i)\n    }\n    time.Sleep(3 * time.Second)\n}',
        correctAnswer: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\nfunc work(id int, wg *sync.WaitGroup) {\n    defer wg.Done()\n    time.Sleep(1 * time.Second)\n    fmt.Println("Worker", id, "done")\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n    \n    for i := 1; i <= 5; i++ {\n        wg.Add(1)\n        go work(i, &wg)\n    }\n    \n    wg.Wait()\n    fmt.Println("All workers completed")\n}',
        solution: 'The optimization uses a WaitGroup instead of a fixed sleep time, which ensures all goroutines complete before the program exits, regardless of how long they take. This makes the code more reliable and potentially faster as it won\'t wait unnecessarily.',
        section: 'debugging',
        marks: 15,
      },
    ],
  },
  {
    id: 'django-quiz-set-1',
    title: 'Django Quiz Set 1',
    description: 'Test your knowledge of Django frameworks and concepts',
    totalMarks: 100,
    timeLimit: 10800, // 3 hours
    questions: [
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
  {
    id: 'nextjs-quiz-set-1',
    title: 'Next.js Quiz Set 1',
    description: 'Test your knowledge of Next.js frameworks and concepts',
    totalMarks: 100,
    timeLimit: 10800, // 3 hours
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        text: 'Which command is used to create a new Next.js project?',
        questionText: 'Which command is used to create a new Next.js project?',
        options: [
          { id: 'a', text: 'npx create-react-app my-app', isCorrect: false },
          { id: 'b', text: 'npx create-next-app my-app', isCorrect: true },
          { id: 'c', text: 'npm init next-app my-app', isCorrect: false },
          { id: 'd', text: 'yarn create next-app my-app', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '2',
        type: 'multiple-choice',
        text: 'How does Next.js handle server-side rendering (SSR)?',
        questionText: 'How does Next.js handle server-side rendering (SSR)?',
        options: [
          { id: 'a', text: 'By using getStaticProps()', isCorrect: false },
          { id: 'b', text: 'By using getServerSideProps()', isCorrect: true },
          { id: 'c', text: 'By using useEffect()', isCorrect: false },
          { id: 'd', text: 'By using fetch()', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '3',
        type: 'multiple-choice',
        text: 'What is the main advantage of using Next.js over React?',
        questionText: 'What is the main advantage of using Next.js over React?',
        options: [
          { id: 'a', text: 'Faster client-side routing', isCorrect: false },
          { id: 'b', text: 'Built-in API routes and SSR support', isCorrect: true },
          { id: 'c', text: 'Better compatibility with Redux', isCorrect: false },
          { id: 'd', text: 'Uses TypeScript by default', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '4',
        type: 'multiple-choice',
        text: 'Which Next.js function is used for static site generation (SSG)?',
        questionText: 'Which Next.js function is used for static site generation (SSG)?',
        options: [
          { id: 'a', text: 'getServerSideProps()', isCorrect: false },
          { id: 'b', text: 'getStaticProps()', isCorrect: true },
          { id: 'c', text: 'getInitialProps()', isCorrect: false },
          { id: 'd', text: 'useStaticProps()', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '5',
        type: 'multiple-choice',
        text: 'How can you create a dynamic API route in Next.js?',
        questionText: 'How can you create a dynamic API route in Next.js?',
        options: [
          { id: 'a', text: 'By defining a route in pages/api/[param].js', isCorrect: true },
          { id: 'b', text: 'By using fetch() in pages/api/index.js', isCorrect: false },
          { id: 'c', text: 'By adding a new route in next.config.js', isCorrect: false },
          { id: 'd', text: 'By defining an Express.js server manually', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '6',
        type: 'multiple-choice',
        text: 'What is the default behavior of Next.js regarding routing?',
        questionText: 'What is the default behavior of Next.js regarding routing?',
        options: [
          { id: 'a', text: 'Uses React Router for navigation', isCorrect: false },
          { id: 'b', text: 'Uses file-based routing system', isCorrect: true },
          { id: 'c', text: 'Requires manual route definitions in next.config.js', isCorrect: false },
          { id: 'd', text: 'Only supports API routes and not page routes', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '7',
        type: 'multiple-choice',
        text: 'Which Next.js component is used to enable client-side navigation?',
        questionText: 'Which Next.js component is used to enable client-side navigation?',
        options: [
          { id: 'a', text: 'a tag', isCorrect: false },
          { id: 'b', text: 'Link from next/link', isCorrect: true },
          { id: 'c', text: 'navigate function', isCorrect: false },
          { id: 'd', text: 'useRouter hook', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '8',
        type: 'multiple-choice',
        text: 'How does Next.js handle environment variables?',
        questionText: 'How does Next.js handle environment variables?',
        options: [
          { id: 'a', text: 'By storing them in .next-env', isCorrect: false },
          { id: 'b', text: 'Using .env.local and process.env', isCorrect: true },
          { id: 'c', text: 'Using config.js', isCorrect: false },
          { id: 'd', text: 'Defining them in package.json', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '9',
        type: 'multiple-choice',
        text: 'Which function can be used to handle dynamic metadata in Next.js?',
        questionText: 'Which function can be used to handle dynamic metadata in Next.js?',
        options: [
          { id: 'a', text: 'next/head', isCorrect: true },
          { id: 'b', text: 'useEffect()', isCorrect: false },
          { id: 'c', text: 'getServerSideProps()', isCorrect: false },
          { id: 'd', text: 'meta()', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      {
        id: '10',
        type: 'multiple-choice',
        text: 'Which of the following is NOT an optimization feature provided by Next.js?',
        questionText: 'Which of the following is NOT an optimization feature provided by Next.js?',
        options: [
          { id: 'a', text: 'Automatic static optimization', isCorrect: false },
          { id: 'b', text: 'Code splitting', isCorrect: false },
          { id: 'c', text: 'Server-side database management', isCorrect: true },
          { id: 'd', text: 'Image optimization', isCorrect: false },
        ],
        section: 'mcq',
        marks: 2,
      },
      
      {
        id: '11',
        type: 'coding',
        text: 'Implement a Next.js API route that returns a JSON object with user details (name, email, and role).',
        questionText: 'Implement a Next.js API route that returns a JSON object with user details (name, email, and role).',
        code: '// Write your Next.js API route here\n',
        codeSnippet: '// Write your Next.js API route here\n',
        correctAnswer: '// pages/api/user.js\nexport default function handler(req, res) {\n  res.status(200).json({\n    name: "John Doe",\n    email: "john.doe@example.com",\n    role: "Admin"\n  });\n}',
        section: 'coding',
        marks: 10,
      },
      {
        id: '12',
        type: 'coding',
        text: 'Create a Next.js page that fetches and displays a list of products from an external API using getStaticProps().',
        questionText: 'Create a Next.js page that fetches and displays a list of products from an external API using getStaticProps().',
        code: '// Write your Next.js page here\n',
        codeSnippet: '// Write your Next.js page here\n',
        correctAnswer: '// pages/products.js\nimport React from "react";\n\nexport default function Products({ products }) {\n  return (\n    <div className="container mx-auto py-8">\n      <h1 className="text-2xl font-bold mb-6">Products</h1>\n      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n        {products.map(product => (\n          <div key={product.id} className="border p-4 rounded shadow">\n            <h2 className="font-semibold">{product.title}</h2>\n            <p className="text-gray-600">${product.price}</p>\n            <p className="mt-2">{product.description}</p>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}\n\nexport async function getStaticProps() {\n  try {\n    const res = await fetch("https://fakestoreapi.com/products");\n    const products = await res.json();\n    \n    return {\n      props: {\n        products,\n      },\n      revalidate: 3600, // Revalidate every hour\n    };\n  } catch (error) {\n    console.error("Error fetching products:", error);\n    return {\n      props: {\n        products: [],\n      },\n      revalidate: 60, // Try again sooner if there was an error\n    };\n  }\n}',
        section: 'coding',
        marks: 20,
      },
      {
        id: '13',
        type: 'coding',
        text: 'Write a Next.js component that implements client-side navigation using next/link and displays a list of links dynamically from an array of objects.',
        questionText: 'Write a Next.js component that implements client-side navigation using next/link and displays a list of links dynamically from an array of objects.',
        code: '// Write your Next.js component here\n',
        codeSnippet: '// Write your Next.js component here\n',
        correctAnswer: 'import Link from "next/link";\n\nconst NavigationMenu = () => {\n  const links = [\n    { href: "/", text: "Home" },\n    { href: "/about", text: "About" },\n    { href: "/products", text: "Products" },\n    { href: "/blog", text: "Blog" },\n    { href: "/contact", text: "Contact" }\n  ];\n\n  return (\n    <nav className="bg-gray-800 p-4">\n      <ul className="flex space-x-4">\n        {links.map((link, index) => (\n          <li key={index}>\n            <Link href={link.href}>\n              <a className="text-white hover:text-gray-300 transition-colors">\n                {link.text}\n              </a>\n            </Link>\n          </li>\n        ))}\n      </ul>\n    </nav>\n  );\n};\n\nexport default NavigationMenu;',
        section: 'coding',
        marks: 20,
      },
      
      {
        id: '14',
        type: 'debugging',
        text: 'Fix the following Next.js API route that is returning an error.',
        questionText: 'Fix the following Next.js API route that is returning an error.',
        code: 'export default function handler(req, res) {\n  const data = { name: \'John Doe\', email: \'john@example.com\' };\n  return data;\n}',
        codeSnippet: 'export default function handler(req, res) {\n  const data = { name: \'John Doe\', email: \'john@example.com\' };\n  return data;\n}',
        correctAnswer: 'export default function handler(req, res) {\n  const data = { name: \'John Doe\', email: \'john@example.com\' };\n  res.status(200).json(data);\n}',
        section: 'debugging',
        marks: 15,
      },
      {
        id: '15',
        type: 'debugging',
        text: 'Identify and fix the issue in the following Next.js page that fetches data incorrectly.',
        questionText: 'Identify and fix the issue in the following Next.js page that fetches data incorrectly.',
        code: 'import { useEffect, useState } from \'react\';\n\nexport default function Products() {\n  const [products, setProducts] = useState([]);\n\n  useEffect(async () => {\n    const res = await fetch(\'/api/products\');\n    const data = await res.json();\n    setProducts(data);\n  }, []);\n\n  return (\n    <div>\n      <h1>Product List</h1>\n      {products.map((product) => (\n        <div key={product.id}>{product.name}</div>\n      ))}\n    </div>\n  );\n}',
        codeSnippet: 'import { useEffect, useState } from \'react\';\n\nexport default function Products() {\n  const [products, setProducts] = useState([]);\n\n  useEffect(async () => {\n    const res = await fetch(\'/api/products\');\n    const data = await res.json();\n    setProducts(data);\n  }, []);\n\n  return (\n    <div>\n      <h1>Product List</h1>\n      {products.map((product) => (\n        <div key={product.id}>{product.name}</div>\n      ))}\n    </div>\n  );\n}',
        correctAnswer: 'import { useEffect, useState } from \'react\';\n\nexport default function Products() {\n  const [products, setProducts] = useState([]);\n\n  useEffect(() => {\n    const fetchProducts = async () => {\n      try {\n        const res = await fetch(\'/api/products\');\n        const data = await res.json();\n        setProducts(data);\n      } catch (error) {\n        console.error(\'Error fetching products:\', error);\n      }\n    };\n    \n    fetchProducts();\n  }, []);\n\n  return (\n    <div>\n      <h1>Product List</h1>\n      {products.map((product) => (\n        <div key={product.id}>{product.name}</div>\n      ))}\n    </div>\n  );\n}',
        section: 'debugging',
        marks: 15,
      },
    ],
  },
];

export const saveQuizSet = async (quizSet: QuizSet): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      return null;
    }
    
    const userId = userData.user.id;
    const quizSetId = quizSet.id || uuidv4();
    
    const { data, error } = await supabase
      .from('custom_quiz_sets')
      .insert({
        user_id: userId,
        quiz_set_id: quizSetId,
        title: quizSet.title,
        description: quizSet.description,
        total_marks: quizSet.totalMarks,
        time_limit: quizSet.timeLimit,
        questions: JSON.stringify(quizSet.questions)
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

export const addQuizSet = saveQuizSet;

export const fetchQuizSets = async (): Promise<QuizSet[]> => {
  try {
    const { data: customSets, error } = await supabase
      .from('custom_quiz_sets')
      .select('*');
    
    if (error) {
      console.error('Error fetching custom quiz sets:', error);
      return mockQuizSets;
    }
    
    const transformedCustomSets: QuizSet[] = customSets.map(set => ({
      id: set.quiz_set_id,
      title: set.title,
      description: set.description,
      totalMarks: set.total_marks,
      timeLimit: set.time_limit,
      questions: typeof set.questions === 'string' 
        ? JSON.parse(set.questions)
        : set.questions
    }));
    
    return [...transformedCustomSets, ...mockQuizSets];
  } catch (error) {
    console.error('Unexpected error fetching quiz sets:', error);
    return mockQuizSets;
  }
};

export const getQuizSetById = async (id: string): Promise<QuizSet | null> => {
  try {
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
          : customSet.questions
      };
    }
    
    const mockSet = mockQuizSets.find(set => set.id === id);
    return mockSet || null;
  } catch (error) {
    console.error('Error fetching quiz set:', error);
    const mockSet = mockQuizSets.find(set => set.id === id);
    return mockSet || null;
  }
};

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

export const saveQuizResult = saveQuizResults;

export const calculateSectionScores = (
  questions: Question[],
  answers: Record<string, any>
): SectionScore[] => {
  const sections: Record<string, Question[]> = {};
  
  questions.forEach(q => {
    if (!sections[q.section]) {
      sections[q.section] = [];
    }
    sections[q.section].push(q);
  });
  
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
      if (q.type === 'coding' && q.correctAnswer) {
        if (answer && answer === q.correctAnswer) {
          sectionScore += q.marks;
        }
      }
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
    if (q.type === 'coding' && q.correctAnswer) {
      if (answer && answer === q.correctAnswer) {
        totalScore += q.marks;
      }
    }
  });
  
  return totalScore;
};

export const getQuestionsForSection = (questions: Question[], section: string): Question[] => {
  return questions.filter(q => q.section === section);
};

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
