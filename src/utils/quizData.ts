export interface Question {
  id: number;
  section: 'mcq' | 'coding' | 'debugging';
  questionText: string;
  marks: number;
  options?: string[];
  correctAnswer?: number;
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
];

export const addQuizSet = (quizSet) => {
  quizSets.push(quizSet);
};

export const getQuizSet = (quizSetId: string) => {
  return quizSets.find((quizSet) => quizSet.id === quizSetId);
};
