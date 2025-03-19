
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
  {
    id: 'nextjs-quiz-set-1',
    title: 'Next.js Quiz Set 1',
    description: 'Test your knowledge of Next.js frameworks and concepts',
    totalMarks: 100,
    timeLimit: 10800, // 3 hours
    questions: [
      // Section 1: MCQs (10 questions, 20 marks)
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
      
      // Section 2: Coding Questions (3 questions, 50 marks)
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
      
      // Section 3: Debugging Questions (2 questions, 30 marks)
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
