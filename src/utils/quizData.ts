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

export let quizSets: QuizSet[] = [
  {
    id: 'nextjs-technical-test-set-1',
    title: 'Next.js Technical Test - Set 1',
    description:
      'Assess your Next.js skills with this technical test designed for experienced developers.',
    totalMarks: 120,
    timeLimit: 7200,
    questions: [
      {
        id: 1,
        section: 'mcq',
        questionText: 'What is the primary purpose of the `getServerSideProps` function in Next.js?',
        marks: 10,
        options: [
          'To fetch data at build time',
          'To fetch data on the client-side',
          'To fetch data on each request',
          'To define API routes',
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        section: 'coding',
        questionText:
          'Write a Next.js API route that accepts a `name` query parameter and returns a JSON response with a greeting message.',
        marks: 30,
        codeSnippet:
          '// pages/api/greeting.js\nexport default function handler(req, res) {\n  // Your code here\n}',
      },
      {
        id: 3,
        section: 'debugging',
        questionText:
          'The following Next.js component is not rendering the user’s name correctly. Identify and fix the issue.\n\n```jsx\n// pages/user.js\nimport { useState, useEffect } from \'react\';\n\nfunction UserProfile() {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    async function fetchUser() {\n      const res = await fetch(\'/api/user\');\n      const data = await res.json();\n      setUser(data);\n    }\n\n    fetchUser();\n  }, []);\n\n  if (!user) {\n    return <p>Loading...</p>;\n  }\n\n  return (\n    <div>\n      <h1>User Profile</h1>\n      <p>Name: {user.name}</p>\n    </div>\n  );\n}\n\nexport default UserProfile;\n```\n\n```javascript\n// pages/api/user.js\nexport default function handler(req, res) {\n  res.status(200).json({ userName: \'John Doe\' });\n}\n```',
        marks: 40,
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'What is the purpose of the `useRouter` hook in Next.js?',
        marks: 10,
        options: [
          'To manage component state',
          'To handle form submissions',
          'To access the router object',
          'To define API routes',
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        section: 'coding',
        questionText:
          'Implement a Next.js component that dynamically imports and renders a module. Handle the loading state gracefully.',
        marks: 30,
        codeSnippet:
          '// components/DynamicComponent.js\nimport dynamic from \'next/dynamic\';\n\nconst DynamicComponent = () => {\n  // Your code here\n};\n\nexport default DynamicComponent;',
      },
    ],
  },
  {
    id: 'reactjs-technical-test-set-1',
    title: 'React.js Technical Test - Set 1',
    description:
      'Evaluate your React.js proficiency with this set of technical questions and coding challenges.',
    totalMarks: 100,
    timeLimit: 5400,
    questions: [
      {
        id: 1,
        section: 'mcq',
        questionText: 'What is the purpose of `useState` hook in React?',
        marks: 10,
        options: [
          'To define a functional component',
          'To add state to functional components',
          'To render UI',
          'To fetch data from an API',
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        section: 'coding',
        questionText:
          'Create a React component that displays a counter. Include buttons to increment and decrement the counter value.',
        marks: 30,
        codeSnippet:
          '// components/Counter.js\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  // Your code here\n}\n\nexport default Counter;',
      },
      {
        id: 3,
        section: 'debugging',
        questionText:
          'The following React component is not updating the state correctly. Identify and fix the issue.\n\n```jsx\n// components/Toggle.js\nimport React, { useState } from \'react\';\n\nfunction Toggle() {\n  const [isToggled, setIsToggled] = useState(false);\n\n  const toggle = () => {\n    setIsToggled(!isToggled);\n  };\n\n  return (\n    <button onClick={toggle}>\n      {isToggled ? \'On\' : \'Off\'}\n    </button>\n  );\n}\n\nexport default Toggle;\n```',
        marks: 30,
      },
      {
        id: 4,
        section: 'mcq',
        questionText: 'What is the significance of keys in React lists?',
        marks: 10,
        options: [
          'To style list items',
          'To uniquely identify list items',
          'To add interactivity to list items',
          'To define the order of list items',
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        section: 'coding',
        questionText:
          'Implement a React component that fetches data from an API and displays it in a list. Handle loading and error states gracefully.',
        marks: 20,
        codeSnippet:
          '// components/DataList.js\nimport React, { useState, useEffect } from \'react\';\n\nfunction DataList() {\n  // Your code here\n}\n\nexport default DataList;',
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
        correctAnswer: 'from django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n    description = models.TextField()\n    price = models.DecimalField(max_digits=10, decimal_places=2)\n    created_at = models.DateField(auto_now_add=True)',
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

export const addQuizSet = (quizSet) => {
  quizSets.push(quizSet);
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
