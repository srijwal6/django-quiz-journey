export interface Question {
  id: number;
  section: 'mcq' | 'coding' | 'debugging';
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: number | string;
  codeSnippet?: string;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  timeLimit: number;
  questions: Question[];
}

export interface QuizState {
  quizSetId: string | null;
  currentSection: 'mcq' | 'coding' | 'debugging';
  currentQuestionIndex: number;
  answers: Record<number, string | number>;
  score: number;
  timeRemaining: number;
  isCompleted: boolean;
}

// Load quiz sets from localStorage or use default data
const loadQuizSets = (): QuizSet[] => {
  const storedQuizSets = localStorage.getItem('quizSets');
  if (storedQuizSets) {
    try {
      return JSON.parse(storedQuizSets);
    } catch (error) {
      console.error('Failed to parse stored quiz sets:', error);
      return defaultQuizSets;
    }
  }
  return defaultQuizSets;
};

// Save quiz sets to localStorage
const saveQuizSets = (quizSets: QuizSet[]) => {
  localStorage.setItem('quizSets', JSON.stringify(quizSets));
};

// Default quiz sets
const defaultQuizSets: QuizSet[] = [
  {
    id: 'nextjs-technical-test-set-1',
    title: 'Next.js Technical Test - Set 1',
    description:
      'Assess your Next.js skills with this technical test designed for experienced developers.',
    totalMarks: 100,
    timeLimit: 10800,
    questions: [
      {
        id: 1,
        section: 'mcq',
        questionText: 'Which command is used to create a new Next.js project?',
        marks: 2,
        options: [
          'npx create-react-app my-app',
          'npx create-next-app my-app',
          'npm init next-app my-app',
          'yarn create next-app my-app',
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        section: 'mcq',
        questionText: 'How does Next.js handle server-side rendering (SSR)?',
        marks: 2,
        options: [
          'By using getStaticProps()',
          'By using getServerSideProps()',
          'By using useEffect()',
          'By using fetch()',
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        section: 'mcq',
        questionText: 'What is the main advantage of using Next.js over React?',
        marks: 2,
        options: [
          'Faster client-side routing',
          'Built-in API routes and SSR support',
          'Better compatibility with Redux',
          'Uses TypeScript by default',
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'Which Next.js function is used for static site generation (SSG)?',
        marks: 2,
        options: [
          'getServerSideProps()',
          'getStaticProps()',
          'getInitialProps()',
          'useStaticProps()',
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        section: 'mcq',
        questionText: 'How can you create a dynamic API route in Next.js?',
        marks: 2,
        options: [
          'By defining a route in pages/api/[param].js',
          'By using fetch() in pages/api/index.js',
          'By adding a new route in next.config.js',
          'By defining an Express.js server manually',
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        section: 'mcq',
        questionText: 'What is the default behavior of Next.js regarding routing?',
        marks: 2,
        options: [
          'Uses React Router for navigation',
          'Uses file-based routing system',
          'Requires manual route definitions in next.config.js',
          'Only supports API routes and not page routes',
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        section: 'mcq',
        questionText: 'Which Next.js component is used to enable client-side navigation?',
        marks: 2,
        options: [
          'a tag',
          'Link from next/link',
          'navigate function',
          'useRouter hook',
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        section: 'mcq',
        questionText: 'How does Next.js handle environment variables?',
        marks: 2,
        options: [
          'By storing them in .next-env',
          'Using .env.local and process.env',
          'Using config.js',
          'Defining them in package.json',
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        section: 'mcq',
        questionText: 'Which function can be used to handle dynamic metadata in Next.js?',
        marks: 2,
        options: [
          'next/head',
          'useEffect()',
          'getServerSideProps()',
          'meta()',
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        section: 'mcq',
        questionText: 'Which of the following is NOT an optimization feature provided by Next.js?',
        marks: 2,
        options: [
          'Automatic static optimization',
          'Code splitting',
          'Server-side database management',
          'Image optimization',
        ],
        correctAnswer: 2,
      },
      {
        id: 11,
        section: 'coding',
        questionText: 'Implement a Next.js API route that returns a JSON object with user details (name, email, and role).',
        marks: 10,
        codeSnippet: '// pages/api/user.js\n\nexport default function handler(req, res) {\n  // Your code here\n}',
      },
      {
        id: 12,
        section: 'coding',
        questionText: 'Create a Next.js page that fetches and displays a list of products from an external API using getStaticProps().',
        marks: 20,
        codeSnippet: '// pages/products.js\n\nexport async function getStaticProps() {\n  // Your code here\n}\n\nexport default function Products({ products }) {\n  // Your code here\n}',
      },
      {
        id: 13,
        section: 'coding',
        questionText: 'Write a Next.js component that implements client-side navigation using next/link and displays a list of links dynamically from an array of objects.',
        marks: 20,
        codeSnippet: '// components/Navigation.js\nimport Link from \'next/link\';\n\nconst Navigation = ({ links }) => {\n  // Your code here\n};\n\nexport default Navigation;',
      },
      {
        id: 14,
        section: 'debugging',
        questionText: 'Fix the following Next.js API route that is returning an error.',
        marks: 15,
        codeSnippet: 'export default function handler(req, res) {\n  const data = { name: \'John Doe\', email: \'john@example.com\' };\n  return data;\n}',
        correctAnswer: 'export default function handler(req, res) {\n  const data = { name: \'John Doe\', email: \'john@example.com\' };\n  res.status(200).json(data);\n}',
      },
      {
        id: 15,
        section: 'debugging',
        questionText: 'Identify and fix the issue in the following Next.js page that fetches data incorrectly.',
        marks: 15,
        codeSnippet: 'import { useEffect, useState } from \'react\';\n\nexport default function Products() {\n  const [products, setProducts] = useState([]);\n\n  useEffect(async () => {\n    const res = await fetch(\'/api/products\');\n    const data = await res.json();\n    setProducts(data);\n  }, []);\n\n  return (\n    <div>\n      <h1>Product List</h1>\n      {products.map((product) => (\n        <div key={product.id}>{product.name}</div>\n      ))}\n    </div>\n  );\n}',
        correctAnswer: 'import { useEffect, useState } from \'react\';\n\nexport default function Products() {\n  const [products, setProducts] = useState([]);\n\n  useEffect(() => {\n    const fetchProducts = async () => {\n      const res = await fetch(\'/api/products\');\n      const data = await res.json();\n      setProducts(data);\n    };\n    \n    fetchProducts();\n  }, []);\n\n  return (\n    <div>\n      <h1>Product List</h1>\n      {products.map((product) => (\n        <div key={product.id}>{product.name}</div>\n      ))}\n    </div>\n  );\n}',
      },
    ],
  },
  {
    id: 'django-technical-test-set-1',
    title: 'Django Technical Test - Set 1',
    description:
      'Test your Django skills with this comprehensive technical assessment for developers of all levels.',
    totalMarks: 100,
    timeLimit: 5400,
    questions: [
      {
        id: 1,
        section: 'mcq',
        questionText: 'What is a Django model?',
        marks: 10,
        options: [
          'A template for rendering HTML',
          'A Python class that represents a database table',
          'A function that handles HTTP requests',
          'A URL pattern',
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        section: 'coding',
        questionText:
          'Write a Django model for a `Book` with fields for `title` (CharField), `author` (CharField), and `publication_date` (DateField).',
        marks: 30,
        codeSnippet:
          '# models.py\nfrom django.db import models\n\n# Your code here',
      },
      {
        id: 3,
        section: 'debugging',
        questionText:
          'The following Django view is not displaying the list of books correctly. Identify and fix the issue.\n\n```python\n# views.py\nfrom django.shortcuts import render\nfrom .models import Book\n\ndef book_list(request):\n    books = Book.objects.all()\n    return render(request, \'book_list.html\', {\'book_list\': books})\n```\n\n```html\n<!-- templates/book_list.html -->\n<h1>Book List</h1>\n<ul>\n    {% for book in books %}\n        <li>{{ book.title }} by {{ book.author }}</li>\n    {% endfor %}\n</ul>',
        marks: 30,
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'What is the purpose of Django middleware?',
        marks: 10,
        options: [
          'To handle database migrations',
          'To process requests and responses globally',
          'To define URL patterns',
          'To create forms',
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        section: 'coding',
        questionText:
          'Implement a Django form for creating a new `Book` instance, including validation for required fields.',
        marks: 20,
        codeSnippet:
          '# forms.py\nfrom django import forms\nfrom .models import Book\n\n# Your code here',
      },
    ],
  },
  {
    id: 'django-technical-test-set-2',
    title: 'Django Technical Test - Set 2',
    description:
      'Advanced Django technical assessment covering models, authentication, and performance optimization techniques.',
    totalMarks: 100,
    timeLimit: 10800,
    questions: [
      {
        id: 1,
        section: 'mcq',
        questionText: 'Which of the following Django commands creates database migrations?',
        marks: 2,
        options: [
          'python manage.py migrate',
          'python manage.py create_migrations',
          'python manage.py makemigrations',
          'python manage.py generate_migrations'
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        section: 'mcq',
        questionText: 'What is the correct way to use Django\'s class-based views (CBVs) for handling forms?',
        marks: 2,
        options: [
          'Using FormView',
          'Using TemplateView',
          'Using FormMixin',
          'Both a and c'
        ],
        correctAnswer: 3,
      },
      {
        id: 3,
        section: 'mcq',
        questionText: 'Which method in Django\'s ORM retrieves exactly one object or raises an exception if it doesn\'t exist?',
        marks: 2,
        options: [
          'filter()',
          'get()',
          'retrieve()',
          'fetch_one()'
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'How can you implement a custom authentication backend in Django?',
        marks: 2,
        options: [
          'By modifying settings.py',
          'By subclassing django.contrib.auth.backends.BaseBackend',
          'By using a middleware class',
          'By modifying Django\'s built-in User model'
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        section: 'mcq',
        questionText: 'Which of the following is true about Django\'s middleware?',
        marks: 2,
        options: [
          'Middleware executes before view processing only',
          'Middleware executes both before and after view processing',
          'Middleware is only used for security purposes',
          'Middleware runs only in development mode'
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        section: 'mcq',
        questionText: 'What is the purpose of Django\'s select_related() method?',
        marks: 2,
        options: [
          'It optimizes database queries by performing JOINs',
          'It filters querysets based on related models',
          'It fetches only specific fields from the database',
          'It is used to execute raw SQL queries'
        ],
        correctAnswer: 0,
      },
      {
        id: 7,
        section: 'mcq',
        questionText: 'Which Django model field is best suited for storing JSON data efficiently?',
        marks: 2,
        options: [
          'CharField',
          'JSONField',
          'TextField',
          'ArrayField'
        ],
        correctAnswer: 1,
      },
      {
        id: 8,
        section: 'mcq',
        questionText: 'How does Django handle concurrent database transactions?',
        marks: 2,
        options: [
          'Using optimistic locking',
          'Using database-level locks',
          'Using the atomic() method for transactions',
          'Both b and c'
        ],
        correctAnswer: 3,
      },
      {
        id: 9,
        section: 'mcq',
        questionText: 'Which of the following is a recommended method to implement real-time features in Django?',
        marks: 2,
        options: [
          'Using Django Channels',
          'Using AJAX polling',
          'Using Django\'s built-in WebSocket module',
          'Using session-based caching'
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        section: 'mcq',
        questionText: 'How can you improve the performance of Django queries when dealing with large datasets?',
        marks: 2,
        options: [
          'Using values_list() instead of all()',
          'Using prefetch_related() and select_related()',
          'Using database indexing',
          'All of the above'
        ],
        correctAnswer: 3,
      },
      {
        id: 11,
        section: 'coding',
        questionText: 'Write a Django model for an ECommerceOrder that includes fields for order ID, customer, total amount, and a status field with choices (\'Pending\', \'Shipped\', \'Delivered\').',
        marks: 10,
        codeSnippet: '# models.py\nfrom django.db import models\n\n# Your code here',
      },
      {
        id: 12,
        section: 'coding',
        questionText: 'Create a Django REST framework (DRF) API view to handle user login authentication using JWT.',
        marks: 20,
        codeSnippet: '# views.py\nfrom rest_framework.views import APIView\nfrom rest_framework.response import Response\n\n# Your code here',
      },
      {
        id: 13,
        section: 'coding',
        questionText: 'Implement a Django signal that sends an email notification when a new user registers.',
        marks: 20,
        codeSnippet: '# signals.py\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom django.contrib.auth.models import User\n\n# Your code here',
      },
      {
        id: 14,
        section: 'debugging',
        questionText: 'Fix the following Django query that results in excessive database queries. Optimize it for better performance.\n\n```python\nfrom myapp.models import Order\n\ndef get_orders():\n    orders = Order.objects.all()\n    for order in orders:\n        print(order.customer.name, order.total_price)\n```',
        marks: 15,
        codeSnippet: 'from myapp.models import Order\n\ndef get_orders():\n    orders = Order.objects.all()\n    for order in orders:\n        print(order.customer.name, order.total_price)',
        correctAnswer: 'from myapp.models import Order\n\ndef get_orders():\n    orders = Order.objects.select_related(\'customer\').all()\n    for order in orders:\n        print(order.customer.name, order.total_price)',
      },
      {
        id: 15,
        section: 'debugging',
        questionText: 'Identify and fix the error in the following Django model definition.\n\n```python\nfrom django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max=200)\n    description = models.Text()\n    price = models.DecimalField()\n    created_at = models.Date()\n```',
        marks: 15,
        codeSnippet: 'from django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max=200)\n    description = models.Text()\n    price = models.DecimalField()\n    created_at = models.Date()',
        correctAnswer: 'from myapp.models import Order\n\ndef get_orders():\n    orders = Order.objects.select_related(\'customer\').all()\n    for order in orders:\n        print(order.customer.name, order.total_price)',
      },
    ],
  },
  {
    id: 'nextjs-technical-test-set-2',
    title: 'Next.js Technical Test - Set 2',
    description:
      'Advanced Next.js technical assessment covering dynamic routing, data fetching strategies, and optimization techniques.',
    totalMarks: 100,
    timeLimit: 10800,
    questions: [
      {
        id: 1,
        section: 'mcq',
        questionText: 'Which of the following functions is used to fetch data at request time in Next.js?',
        marks: 2,
        options: [
          'getStaticProps()',
          'getServerSideProps()',
          'useEffect()',
          'fetchData()'
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        section: 'mcq',
        questionText: 'What is the correct way to create dynamic routes in Next.js?',
        marks: 2,
        options: [
          'Defining routes in next.config.js',
          'Creating [id].js inside pages directory',
          'Using useRouter() hook in a component',
          'Creating a custom Express.js server'
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        section: 'mcq',
        questionText: 'Which method is used for incremental static regeneration (ISR) in Next.js?',
        marks: 2,
        options: [
          'getInitialProps()',
          'getServerSideProps()',
          'getStaticProps() with revalidate',
          'useEffect() with API calls'
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'Which of the following is true regarding API routes in Next.js?',
        marks: 2,
        options: [
          'They must be defined inside pages/api directory',
          'They can be defined anywhere in the project',
          'They require an external Express.js server',
          'They do not support middleware'
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        section: 'mcq',
        questionText: 'How does Next.js handle client-side navigation efficiently?',
        marks: 2,
        options: [
          'Using React Router',
          'Preloading pages with next/link',
          'Fetching data after navigation',
          'Using useEffect() to update page state'
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        section: 'mcq',
        questionText: 'What is the purpose of next/image component?',
        marks: 2,
        options: [
          'To lazy load images automatically',
          'To support automatic resizing and optimization',
          'To enhance performance by using WebP when possible',
          'All of the above'
        ],
        correctAnswer: 3,
      },
      {
        id: 7,
        section: 'mcq',
        questionText: 'Which statement about middleware in Next.js is correct?',
        marks: 2,
        options: [
          'Middleware can modify responses before they are sent',
          'Middleware can only be applied to API routes',
          'Middleware must be configured in next.config.js',
          'Middleware cannot access request headers'
        ],
        correctAnswer: 0,
      },
      {
        id: 8,
        section: 'mcq',
        questionText: 'How can you enable TypeScript support in a Next.js project?',
        marks: 2,
        options: [
          'npm install typescript @types/react @types/node',
          'next enable typescript',
          'Adding "typescript": true in package.json',
          'Next.js does not support TypeScript'
        ],
        correctAnswer: 0,
      },
      {
        id: 9,
        section: 'mcq',
        questionText: 'Which of the following is NOT an advantage of Next.js?',
        marks: 2,
        options: [
          'Automatic code splitting',
          'Full-stack capabilities with API routes',
          'Built-in WebSocket support',
          'Server-side rendering (SSR) support'
        ],
        correctAnswer: 2,
      },
      {
        id: 10,
        section: 'mcq',
        questionText: 'How does Next.js optimize JavaScript bundling?',
        marks: 2,
        options: [
          'By minifying and compressing JavaScript',
          'By tree shaking unused imports',
          'By lazy loading components',
          'All of the above'
        ],
        correctAnswer: 3,
      },
      {
        id: 11,
        section: 'coding',
        questionText: 'Implement a middleware in Next.js that checks if a user is authenticated before accessing certain pages.',
        marks: 15,
        codeSnippet: '// middleware.js\n\nexport function middleware(req) {\n  // Your code here\n}',
      },
      {
        id: 12,
        section: 'coding',
        questionText: 'Create a Next.js API route that connects to a MongoDB database and retrieves a list of users.',
        marks: 20,
        codeSnippet: '// pages/api/users.js\n\nexport default async function handler(req, res) {\n  // Your code here\n}',
      },
      {
        id: 13,
        section: 'coding',
        questionText: 'Build a Next.js dynamic page that fetches and displays blog posts using getServerSideProps().',
        marks: 20,
        codeSnippet: '// pages/blog/index.js\n\nexport async function getServerSideProps() {\n  // Your code here\n}\n\nexport default function BlogPage({ posts }) {\n  // Your code here\n}',
      },
      {
        id: 14,
        section: 'debugging',
        questionText: 'Fix the following Next.js page that throws an error when fetching data.\n\n```jsx\nexport async function getServerSideProps() {\n  const response = await fetch(\'https://jsonplaceholder.typicode.com/posts\');\n  const data = response.json();\n\n  return {\n    props: { posts: data },\n  };\n}\n\nexport default function Posts({ posts }) {\n  return (\n    <div>\n      <h1>Blog Posts</h1>\n      {posts.map((post) => (\n        <div key={post.id}>{post.title}</div>\n      ))}\n    </div>\n  );\n}\n```',
        marks: 15,
        correctAnswer: 'export async function getServerSideProps() {\n  const response = await fetch(\'https://jsonplaceholder.typicode.com/posts\');\n  const data = await response.json();\n\n  return {\n    props: { posts: data },\n  };\n}\n\nexport default function Posts({ posts }) {\n  return (\n    <div>\n      <h1>Blog Posts</h1>\n      {posts.map((post) => (\n        <div key={post.id}>{post.title}</div>\n      ))}\n    </div>\n  );\n}',
      },
      {
        id: 15,
        section: 'debugging',
        questionText: 'Identify and fix the issue in the Next.js component below that uses next/image.\n\n```jsx\nimport Image from \'next/image\';\n\nexport default function Profile() {\n  return (\n    <div>\n      <Image src="/profile.jpg" width={150} height={150} />\n      <h2>John Doe</h2>\n    </div>\n  );\n}\n```',
        marks: 15,
        correctAnswer: 'import Image from \'next/image\';\n\nexport default function Profile() {\n  return (\n    <div>\n      <Image src="/profile.jpg" width={150} height={150} alt="Profile picture of John Doe" />\n      <h2>John Doe</h2>\n    </div>\n  );\n}',
      },
    ],
  },
];

export let quizSets: QuizSet[] = loadQuizSets();

export const addQuizSet = (quizSet: QuizSet) => {
  quizSets.push(quizSet);
  saveQuizSets(quizSets);
};

export const updateQuizSet = (updatedQuizSet: QuizSet) => {
  const index = quizSets.findIndex(qs => qs.id === updatedQuizSet.id);
  if (index !== -1) {
    quizSets[index] = updatedQuizSet;
    saveQuizSets(quizSets);
    return true;
  }
  return false;
};

export const deleteQuizSet = (quizSetId: string) => {
  const initialLength = quizSets.length;
  quizSets = quizSets.filter(qs => qs.id !== quizSetId);
  if (quizSets.length !== initialLength) {
    saveQuizSets(quizSets);
    return true;
  }
  return false;
};

export const getQuizSet = (quizSetId: string) => {
  return quizSets.find((quizSet) => quizSet.id === quizSetId);
};

export const getQuizSetById = (quizSetId: string) => {
  return getQuizSet(quizSetId);
};

export const getQuestionsForSection = (quizSetId: string, section: 'mcq' | 'coding' | 'debugging') => {
  const quizSet = getQuizSet(quizSetId);
  if (!quizSet) return [];
  
  return quizSet.questions.filter(q => q.section === section);
};

export const calculateScore = (answers: Record<number, string | number>, questions: Question[]) => {
  let score = 0;
  
  questions.forEach(question => {
    const userAnswer = answers[question.id];
    if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
      score += question.marks || 0;
    }
  });
  
  return score;
};

export interface QuizResult {
  userId: string;
  username: string;
  quizSetId: string;
  score: number;
  totalMarks: number;
  completedAt: string;
  answers: Record<number, string | number>;
}

export const saveQuizResult = (result: QuizResult) => {
  const storedResults = localStorage.getItem('quizResults');
  const results: QuizResult[] = storedResults ? JSON.parse(storedResults) : [];
  results.push(result);
  localStorage.setItem('quizResults', JSON.stringify(results));
};

export const getUserResults = (userId: string): QuizResult[] => {
  const storedResults = localStorage.getItem('quizResults');
  const results: QuizResult[] = storedResults ? JSON.parse(storedResults) : [];
  return results.filter(result => result.userId === userId);
};

export const getQuizResults = (quizSetId: string): QuizResult[] => {
  const storedResults = localStorage.getItem('quizResults');
  const results: QuizResult[] = storedResults ? JSON.parse(storedResults) : [];
  return results.filter(result => result.quizSetId === quizSetId);
};
