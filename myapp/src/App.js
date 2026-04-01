import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import DataViewer from './DataViewer';
import { login as loginAPI, signup as signupAPI, logout as logoutAPI, isAuthenticated, getCurrentUser } from './services/authService';
import { saveResult } from './services/resultsService';


const skillsData = [
  {
    id: 1,
    title: "Python Fundamentals",
    icon: "fa-brands fa-python",
    description: "Master the basics of Python programming",
    difficulty: "Beginner",
    duration: "5 hours",
    enrollments: 15420,
    rating: 4.8,
    videos: [
      { id: 1, title: "Python Basics & Variables", duration: "15 min", url: "https://www.youtube.com/embed/rfscVS0vtik", fallbackUrl: "https://www.w3schools.com/python/" },
      { id: 2, title: "Functions & Control Flow", duration: "18 min", url: "https://www.youtube.com/embed/u-OmVr_fF_E", fallbackUrl: "https://docs.python.org/3/" },
      { id: 3, title: "Lists & Data Structures", duration: "20 min", url: "https://www.youtube.com/embed/jF0fDrHLaXg", fallbackUrl: "https://www.geeksforgeeks.org/python-tutorial/" }
    ],
    resources: [
      { id: 1, title: "Python Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-tutorial/" },
      { id: 2, title: "Python Docs - Official", url: "https://docs.python.org/3/" },
      { id: 3, title: "W3Schools Python", url: "https://www.w3schools.com/python/" }
    ],
    questions: [
      { id: 1, question: "What is the output of print(type([]))?", options: ["<class 'list'>", "<class 'array'>", "<class 'collection'>", "<class 'tuple'>"], correct: 0 },
      { id: 2, question: "Which keyword is used to create a function in Python?", options: ["func", "function", "def", "define"], correct: 2 },
      { id: 3, question: "What will be the output of: 5 // 2?", options: ["2.5", "2", "3", "Error"], correct: 1 },
      { id: 4, question: "Which of the following is NOT a valid variable name?", options: ["my_var", "_var", "1var", "var1"], correct: 2 },
      { id: 5, question: "What does len() function do?", options: ["Gets length of strings/lists", "Returns maximum value", "Converts to integer", "Removes items"], correct: 0 },
      { id: 6, question: "Which loop is used to iterate over a sequence?", options: ["while", "for", "do-while", "repeat"], correct: 1 },
      { id: 7, question: "What is a tuple in Python?", options: ["Mutable list", "Immutable list", "Dictionary", "Set"], correct: 1 },
      { id: 8, question: "How do you create a dictionary in Python?", options: ["dict = ()", "dict = {}", "dict = []", "dict = <>"], correct: 1 },
      { id: 9, question: "What does the 'pass' statement do?", options: ["Skips code", "Does nothing", "Exits function", "Continues loop"], correct: 1 },
      { id: 10, question: "Which method removes the last element from a list?", options: ["remove()", "pop()", "delete()", "drop()"], correct: 1 },
      { id: 11, question: "What is a lambda function?", options: ["Named function", "Anonymous function", "Class method", "Static method"], correct: 1 },
      { id: 12, question: "How do you import a specific function from a module?", options: ["import module.func", "from module import func", "use module:func", "include module.func"], correct: 1 },
    ]
  },
  {
    id: 2,
    title: "JavaScript Basics",
    icon: "fa-brands fa-js",
    description: "Learn JavaScript from scratch",
    difficulty: "Beginner",
    duration: "4 hours",
    enrollments: 22150,
    rating: 4.7,
    videos: [
      { id: 1, title: "JavaScript Variables & Data Types", duration: "16 min", url: "https://www.youtube.com/embed/W6NZfCO5tTE", fallbackUrl: "https://www.w3schools.com/js/" },
      { id: 2, title: "Functions & Scope", duration: "19 min", url: "https://www.youtube.com/embed/gigtS_5KOqM", fallbackUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" },
      { id: 3, title: "Arrays & Objects", duration: "22 min", url: "https://www.youtube.com/embed/YaPWaIw4AwE", fallbackUrl: "https://www.geeksforgeeks.org/javascript-tutorial/" }
    ],
    resources: [
      { id: 1, title: "W3Schools JavaScript", url: "https://www.w3schools.com/js/" },
      { id: 2, title: "JavaScript MDN Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/" },
      { id: 3, title: "GeeksforGeeks JavaScript", url: "https://www.geeksforgeeks.org/javascript-tutorial/" }
    ],
    questions: [
      { id: 1, question: "How to declare a variable in JavaScript?", options: ["var x = 5", "variable x = 5", "v x = 5", "declare x = 5"], correct: 0 },
      { id: 2, question: "Which symbol is used for comments?", options: ["#", "//", "--", "/*"], correct: 1 },
      { id: 3, question: "What is the correct way to create an array?", options: ["array = []", "array = {}", "let array = []", "new array()"], correct: 2 },
      { id: 4, question: "Which method adds elements to the end of array?", options: ["add()", "append()", "push()", "insert()"], correct: 2 },
      { id: 5, question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Source Open Network", "JavaScript Online Notation", "Java String Object Network"], correct: 0 },
      { id: 6, question: "What is the difference between '==' and '==='?", options: ["No difference", "=== checks type", "== is newer", "=== is deprecated"], correct: 1 },
      { id: 7, question: "What does typeof() return for an array?", options: ["'array'", "'object'", "'list'", "'collection'"], correct: 1 },
      { id: 8, question: "How do you write an if statement?", options: ["if (x > 5)", "if x > 5", "if(x > 5){}", "if x > 5 then"], correct: 2 },
      { id: 9, question: "What is a callback function?", options: ["Function that calls another", "Function passed as argument", "Function in loop", "Function in class"], correct: 1 },
      { id: 10, question: "Which keyword is used to create an object?", options: ["object", "new", "create", "make"], correct: 1 },
      { id: 11, question: "What does document.getElementById() do?", options: ["Gets element by class", "Gets element by ID", "Gets all elements", "Gets element by tag"], correct: 1 },
      { id: 12, question: "How do you declare an arrow function?", options: ["function() => {}", "() => {}", "func => {}", "-> () {}"], correct: 1 },
    ]
  },
  {
    id: 3,
    title: "React.js Advanced",
    icon: "fa-brands fa-react",
    description: "Master React and build modern UIs",
    difficulty: "Beginner",
    duration: "6 hours",
    enrollments: 18900,
    rating: 4.9,
    videos: [
      { id: 1, title: "React Hooks Explained", duration: "20 min", url: "https://www.youtube.com/embed/TNhaISOUy6Q", fallbackUrl: "https://react.dev/" },
      { id: 2, title: "State Management Patterns", duration: "22 min", url: "https://www.youtube.com/embed/35lXWvCuM8o", fallbackUrl: "https://www.geeksforgeeks.org/react-tutorial/" },
      { id: 3, title: "Component Composition", duration: "18 min", url: "https://www.youtube.com/embed/MOBLtSA_DmY", fallbackUrl: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React" }
    ],
    resources: [
      { id: 1, title: "React Official Docs", url: "https://react.dev/" },
      { id: 2, title: "React Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/react-tutorial/" },
      { id: 3, title: "React MDN Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React" }
    ],
    questions: [
      { id: 1, question: "What is the purpose of useState hook?", options: ["HTTP requests", "State management", "Styling", "Routing"], correct: 1 },
      { id: 2, question: "What does useEffect do?", options: ["Manages state", "Side effects", "Routes", "Styling"], correct: 1 },
      { id: 3, question: "What is a component in React?", options: ["A function", "A reusable UI part", "A CSS file", "A database"], correct: 1 },
      { id: 4, question: "What is JSX?", options: ["JavaScript XML", "Java Standard Extension", "JSON Extension", "JavaScript Extra"], correct: 0 },
      { id: 5, question: "How do you pass data to components?", options: ["State", "Props", "Context", "All of above"], correct: 1 },
      { id: 6, question: "What is virtual DOM?", options: ["Real DOM", "In-memory representation", "Browser cache", "Server storage"], correct: 1 },
      { id: 7, question: "What is the difference between controlled and uncontrolled components?", options: ["Controlled by React state vs not", "Size difference", "Performance", "Display"], correct: 0 },
      { id: 8, question: "What does useContext hook do?", options: ["Context management", "HTTP requests", "Routing", "Styling"], correct: 0 },
      { id: 9, question: "What is the key prop used for?", options: ["Security", "Identification in lists", "CSS styling", "Function params"], correct: 1 },
      { id: 10, question: "What is prop drilling?", options: ["CSS technique", "Passing props through nested components", "React testing", "State management"], correct: 1 },
      { id: 11, question: "What does Fragment(<></>) do?", options: ["Creates div", "Groups elements without wrapper", "Splits content", "Creates fragment CSS"], correct: 1 },
      { id: 12, question: "What is lazy loading in React?", options: ["Slow loading", "Dynamic imports", "CSS animations", "Database queries"], correct: 1 },
    ]
  },
  {
    id: 4,
    title: "SQL & Databases",
    icon: "fa-solid fa-database",
    description: "Master SQL queries and database design",
    difficulty: "Intermediate",
    duration: "5 hours",
    enrollments: 16230,
    rating: 4.6,
    videos: [
      { id: 1, title: "Introduction to Databases", duration: "17 min", url: "https://www.youtube.com/embed/Fr82jUfzD64", fallbackUrl: "https://www.w3schools.com/sql/" },
      { id: 2, title: "SQL Joins Mastery", duration: "21 min", url: "https://www.youtube.com/embed/xr_RFzVSCWE", fallbackUrl: "https://www.geeksforgeeks.org/sql-tutorial/" },
      { id: 3, title: "Database Normalization", duration: "19 min", url: "https://www.youtube.com/embed/NvrpdhLcg0s", fallbackUrl: "https://www.sqlite.org/" }
    ],
    resources: [
      { id: 1, title: "W3Schools SQL", url: "https://www.w3schools.com/sql/" },
      { id: 2, title: "SQLlite Official", url: "https://www.sqlite.org/" },
      { id: 3, title: "GeeksforGeeks SQL", url: "https://www.geeksforgeeks.org/sql-tutorial/" }
    ],
    questions: [
      { id: 1, question: "What does SQL stand for?", options: ["Standard Query Language", "Structured Query Language", "Simple Query Language", "System Query Language"], correct: 1 },
      { id: 2, question: "Which command is used to retrieve data?", options: ["FETCH", "GET", "SELECT", "RETRIEVE"], correct: 2 },
      { id: 3, question: "What is a primary key?", options: ["First column", "Unique identifier", "Foreign key", "Index"], correct: 1 },
      { id: 4, question: "What is normalization?", options: ["Data organization", "Standardization", "Both", "Neither"], correct: 2 },
      { id: 5, question: "Which SQL join returns all rows from left table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 1 },
      { id: 6, question: "What is a foreign key?", options: ["Column in another table", "Unique reference", "Both", "Neither"], correct: 2 },
      { id: 7, question: "What does INSERT do?", options: ["Updates data", "Adds new record", "Deletes data", "Modifies structure"], correct: 1 },
      { id: 8, question: "What is an index in database?", options: ["Table of contents", "Speeds up queries", "Stores data", "Backup"], correct: 1 },
      { id: 9, question: "What is the difference between WHERE and HAVING?", options: ["WHERE filters rows, HAVING filters groups", "Same thing", "HAVING is SQL only", "WHERE is new"], correct: 0 },
      { id: 10, question: "What does GROUP BY do?", options: ["Sorts data", "Groups rows with same values", "Filters data", "Deletes duplicates"], correct: 1 },
      { id: 11, question: "What is a transaction in SQL?", options: ["Single query", "Series of operations as unit", "Database backup", "Query optimization"], correct: 1 },
      { id: 12, question: "What does ORDER BY do?", options: ["Groups data", "Sorts results", "Filters rows", "Joins tables"], correct: 1 },
    ]
  },
  {
    id: 5,
    title: "Data Structures & Algorithms",
    icon: "fa-solid fa-code",
    description: "Learn essential DSA concepts",
    difficulty: "Beginner",
    duration: "7 hours",
    enrollments: 24500,
    rating: 4.9,
    videos: [
      { id: 1, title: "Arrays & Lists Explained", duration: "16 min", url: "https://www.youtube.com/embed/OTs5EA7SXRE", fallbackUrl: "https://www.geeksforgeeks.org/data-structures/" },
      { id: 2, title: "Stacks & Queues", duration: "18 min", url: "https://www.youtube.com/embed/wjI1WNcIntg", fallbackUrl: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" },
      { id: 3, title: "Trees & Graphs", duration: "22 min", url: "https://www.youtube.com/embed/09Yxys-vqKE", fallbackUrl: "https://www.tutorialspoint.com/data_structures_algorithms/" }
    ],
    resources: [
      { id: 1, title: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
      { id: 2, title: "GeeksforGeeks Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" },
      { id: 3, title: "Tutorialspoint DSA", url: "https://www.tutorialspoint.com/data_structures_algorithms/" }
    ],
    questions: [
      { id: 1, question: "What is time complexity?", options: ["Runtime measurement", "Code length", "Memory usage", "None"], correct: 0 },
      { id: 2, question: "What is Big O notation used for?", options: ["Math", "Algorithms", "Memory", "Storage"], correct: 1 },
      { id: 3, question: "Which is a linear data structure?", options: ["Tree", "Array", "Graph", "Hash Table"], correct: 1 },
      { id: 4, question: "What is recursion?", options: ["Loop", "Function calling itself", "Algorithm", "Variable"], correct: 1 },
      { id: 5, question: "Best sorting algorithm for large data?", options: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"], correct: 1 },
      { id: 6, question: "What is a stack?", options: ["FIFO", "LIFO", "Random access", "Sorted list"], correct: 1 },
      { id: 7, question: "What is a queue?", options: ["LIFO", "FIFO", "Random access", "Tree structure"], correct: 1 },
      { id: 8, question: "What is a linked list?", options: ["Array", "Nodes connected by pointers", "Tree", "Graph"], correct: 1 },
      { id: 9, question: "What is a hash table?", options: ["Database", "Key-value storage", "Linked list", "Binary tree"], correct: 1 },
      { id: 10, question: "What is a binary search tree?", options: ["Sorted array", "Tree with sorted nodes", "Hash table", "Linked list"], correct: 1 },
      { id: 11, question: "What is dynamic programming?", options: ["Runtime coding", "Optimization technique", "OOP concept", "Database method"], correct: 1 },
      { id: 12, question: "What is a graph?", options: ["Chart", "Connected nodes", "Array", "Tree structure"], correct: 1 },
    ]
  },
  {
    id: 6,
    title: "Web Design Fundamentals",
    icon: "fa-solid fa-paintbrush",
    description: "Learn responsive design and UX/UI basics",
    difficulty: "Beginner",
    duration: "4 hours",
    enrollments: 19800,
    rating: 4.7,
    videos: [
      { id: 1, title: "UI/UX Design Principles", duration: "17 min", url: "https://www.youtube.com/embed/eTgNNy0HpyI", fallbackUrl: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/" },
      { id: 2, title: "Responsive Design Basics", duration: "19 min", url: "https://www.youtube.com/embed/srvUrAsNHVQ", fallbackUrl: "https://www.w3schools.com/css/css_rwd_intro.asp" },
      { id: 3, title: "Color & Typography Essentials", duration: "15 min", url: "https://www.youtube.com/embed/Wd4oLIWGM6E", fallbackUrl: "https://www.geeksforgeeks.org/web-design/" }
    ],
    resources: [
      { id: 1, title: "MDN Web Design Basics", url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/" },
      { id: 2, title: "W3Schools Responsive Design", url: "https://www.w3schools.com/css/css_rwd_intro.asp" },
      { id: 3, title: "GeeksforGeeks Web Design", url: "https://www.geeksforgeeks.org/web-design/" }
    ],
    questions: [
      { id: 1, question: "What does responsive design mean?", options: ["Fast loading", "Works on all devices", "Pretty colors", "Interactive"], correct: 1 },
      { id: 2, question: "What is CSS?", options: ["Programming language", "Styling language", "Database", "Server"], correct: 1 },
      { id: 3, question: "What is the box model?", options: ["Design pattern", "Margin+Border+Padding+Content", "Layout grid", "Color scheme"], correct: 1 },
      { id: 4, question: "Which HTML element defines the page structure?", options: ["<div>", "<section>", "<article>", "All above"], correct: 3 },
      { id: 5, question: "What is a wireframe?", options: ["UI mockup", "Code template", "Design tool", "Framework"], correct: 0 },
      { id: 6, question: "What is UX design?", options: ["Visual design", "User experience design", "Backend design", "Database design"], correct: 1 },
      { id: 7, question: "What does UI stand for?", options: ["User Input", "User Interface", "Unique Interface", "Universal Internet"], correct: 1 },
      { id: 8, question: "What is a color scheme?", options: ["CSS file", "Selected colors for design", "Browser theme", "Database colors"], correct: 1 },
      { id: 9, question: "What is typography?", options: ["Website layout", "Typeface and text styling", "Color selection", "Image editing"], correct: 1 },
      { id: 10, question: "What is a mockup?", options: ["Final design", "Visual representation", "Code", "Database"], correct: 1 },
    ]
  },
  {
    id: 7,
    title: "CSS Mastery",
    icon: "fa-brands fa-css3-alt",
    description: "Advanced CSS styling and animations",
    difficulty: "Intermediate",
    duration: "5 hours",
    enrollments: 17650,
    rating: 4.8,
    videos: [
      { id: 1, title: "CSS Flexbox Complete Guide", duration: "20 min", url: "https://www.youtube.com/embed/3YW65K4nnTk", fallbackUrl: "https://www.w3schools.com/css/" },
      { id: 2, title: "CSS Grid Mastery", duration: "22 min", url: "https://www.youtube.com/embed/E-4v-7KNvZU", fallbackUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { id: 3, title: "Animations & Transitions", duration: "18 min", url: "https://www.youtube.com/embed/SgRf2j_zh0c", fallbackUrl: "https://www.geeksforgeeks.org/css-tutorials/" }
    ],
    resources: [
      { id: 1, title: "W3Schools CSS", url: "https://www.w3schools.com/css/" },
      { id: 2, title: "CSS Tricks - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { id: 3, title: "GeeksforGeeks CSS", url: "https://www.geeksforgeeks.org/css-tutorials/" }
    ],
    questions: [
      { id: 1, question: "What is the difference between margin and padding?", options: ["Same thing", "Margin is outside, padding inside", "Padding is outside", "No real difference"], correct: 1 },
      { id: 2, question: "What does flexbox do?", options: ["Styles fonts", "Arranges elements in row/column", "Creates animations", "Manages database"], correct: 1 },
      { id: 3, question: "What is CSS Grid?", options: ["Table structure", "2D layout system", "Animation tool", "Color palette"], correct: 1 },
      { id: 4, question: "What is specificity in CSS?", options: ["Details", "Priority of selectors", "Performance", "Compatibility"], correct: 1 },
      { id: 5, question: "What are pseudo-classes?", options: ["Fake classes", "Dynamic state selectors", "CSS variable", "Animation"], correct: 1 },
      { id: 6, question: "What does z-index do?", options: ["Horizontal position", "Vertical stacking order", "Font size", "Color depth"], correct: 1 },
      { id: 7, question: "What is a media query?", options: ["Database query", "Responsive design condition", "Animation effect", "Color selector"], correct: 1 },
      { id: 8, question: "What is transition in CSS?", options: ["Moving element", "Smooth animation between states", "CSS variable", "HTML attribute"], correct: 1 },
      { id: 9, question: "What is CSS variable?", options: ["HTML variable", "Reusable CSS value", "JavaScript variable", "Database field"], correct: 1 },
      { id: 10, question: "What does transform do?", options: ["Changes HTML", "Modifies element visually", "Animates", "Styles text"], correct: 1 },
      { id: 11, question: "What is backdrop filter?", options: ["HTML filter", "Visual effect on background", "Image filter", "Color selector"], correct: 1 },
      { id: 12, question: "What does ::before do?", options: ["Adds content after", "Adds pseudo-element before", "CSS variable", "Animation"], correct: 1 },
    ]
  },
  {
    id: 8,
    title: "Node.js Backend Development",
    icon: "fa-brands fa-node-js",
    description: "Build server-side applications with Node.js",
    difficulty: "Advanced",
    duration: "6 hours",
    enrollments: 20100,
    rating: 4.8,
    videos: [
      { id: 1, title: "Node.js Fundamentals", duration: "21 min", url: "https://www.youtube.com/embed/-b-ll6execQY", fallbackUrl: "https://nodejs.org/en/docs/" },
      { id: 2, title: "Express.js & Routing", duration: "23 min", url: "https://www.youtube.com/embed/pKd0Rpw7O30", fallbackUrl: "https://expressjs.com/" },
      { id: 3, title: "Middleware & API Design", duration: "19 min", url: "https://www.youtube.com/embed/G8uL7yKAnapříč", fallbackUrl: "https://www.geeksforgeeks.org/nodejs/" }
    ],
    resources: [
      { id: 1, title: "Node.js Official Docs", url: "https://nodejs.org/en/docs/" },
      { id: 2, title: "GeeksforGeeks Node.js", url: "https://www.geeksforgeeks.org/nodejs/" },
      { id: 3, title: "Express.js Official", url: "https://expressjs.com/" }
    ],
    questions: [
      { id: 1, question: "What is Node.js?", options: ["JavaScript framework", "JavaScript runtime", "CSS framework", "Database"], correct: 1 },
      { id: 2, question: "What is npm?", options: ["Node Package Manager", "Network Protocol Manager", "New Python Module", "Node Protocol Manager"], correct: 0 },
      { id: 3, question: "What is Express.js?", options: ["CSS framework", "Web framework for Node.js", "Database", "Testing tool"], correct: 1 },
      { id: 4, question: "What is middleware?", options: ["Database layer", "Functions between request and response", "CSS tool", "HTML element"], correct: 1 },
      { id: 5, question: "What is a callback?", options: ["Phone call", "Function as parameter", "HTML element", "CSS rule"], correct: 1 },
      { id: 6, question: "What is async/await?", options: ["HTML attributes", "Asynchronous programming", "CSS properties", "Database commands"], correct: 1 },
      { id: 7, question: "What is a promise?", options: ["Guarantee", "Async operation wrapper", "HTML element", "CSS property"], correct: 1 },
      { id: 8, question: "What is REST API?", options: ["Network interface", "Client-server communication style", "Database query", "CSS framework"], correct: 1 },
      { id: 9, question: "What does app.get() do?", options: ["Gets file", "Handles GET request", "Retrieves data", "Gets variable"], correct: 1 },
      { id: 10, question: "What is a route in Express?", options: ["File path", "URL endpoint", "Database query", "HTML element"], correct: 1 },
      { id: 11, question: "What does app.listen() do?", options: ["Listens to events", "Starts server on port", "Reads file", "Connects database"], correct: 1 },
      { id: 12, question: "What is req.body?", options: ["HTML body", "Request body data", "Server body", "Response data"], correct: 1 },
    ]
  },
  {
    id: 9,
    title: "Git & Version Control",
    icon: "fa-brands fa-git-alt",
    description: "Master Git for collaborative development",
    difficulty: "Advanced",
    duration: "3 hours",
    enrollments: 21000,
    rating: 4.7,
    videos: [
      { id: 1, title: "Git Basics & Setup", duration: "16 min", url: "https://www.youtube.com/embed/RGOj5yH7evk", fallbackUrl: "https://git-scm.com/doc" },
      { id: 2, title: "Branching & Merging", duration: "18 min", url: "https://www.youtube.com/embed/oPpnCh7InLY", fallbackUrl: "https://www.geeksforgeeks.org/git-tutorial/" },
      { id: 3, title: "Collaboration with Git", duration: "17 min", url: "https://www.youtube.com/embed/SWYqp7iY_Tc", fallbackUrl: "https://guides.github.com/" }
    ],
    resources: [
      { id: 1, title: "Git Official Documentation", url: "https://git-scm.com/doc" },
      { id: 2, title: "GeeksforGeeks Git", url: "https://www.geeksforgeeks.org/git-tutorial/" },
      { id: 3, title: "GitHub Guides", url: "https://guides.github.com/" }
    ],
    questions: [
      { id: 1, question: "What is Git?", options: ["Programming language", "Version control system", "Database", "Framework"], correct: 1 },
      { id: 2, question: "What is a repository?", options: ["Database", "Project folder with Git", "Server", "Backup"], correct: 1 },
      { id: 3, question: "What does git clone do?", options: ["Removes repo", "Copies repository", "Updates files", "Deletes files"], correct: 1 },
      { id: 4, question: "What is a branch?", options: ["Tree part", "Separate code line", "Server", "Database table"], correct: 1 },
      { id: 5, question: "What does git commit do?", options: ["Publishes code", "Saves changes with message", "Removes files", "Updates server"], correct: 1 },
      { id: 6, question: "What is a merge?", options: ["Split code", "Combines branches", "Deletes branch", "Updates file"], correct: 1 },
      { id: 7, question: "What does git push do?", options: ["Uploads changes", "Downloads changes", "Creates branch", "Deletes files"], correct: 0 },
      { id: 8, question: "What does git pull do?", options: ["Downloads changes", "Uploads changes", "Creates branch", "Removes files"], correct: 0 },
      { id: 9, question: "What is a remote?", options: ["Online server", "Local copy", "Branch name", "Commit message"], correct: 0 },
      { id: 10, question: "What does git status do?", options: ["Shows Git version", "Shows changes in repo", "Creates commit", "Updates files"], correct: 1 },
    ]
  },
  {
    id: 10,
    title: "REST APIs",
    icon: "fa-solid fa-plug",
    description: "Build and consume RESTful APIs",
    difficulty: "Advanced",
    duration: "4.5 hours",
    enrollments: 18500,
    rating: 4.8,
    videos: [
      { id: 1, title: "REST API Fundamentals", duration: "19 min", url: "https://www.youtube.com/embed/SLwpqD8n3d0", fallbackUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs" },
      { id: 2, title: "HTTP Methods & Status Codes", duration: "17 min", url: "https://www.youtube.com/embed/LooL6_chvN4", fallbackUrl: "https://www.geeksforgeeks.org/rest-api-introduction/" },
      { id: 3, title: "Building Scalable APIs", duration: "21 min", url: "https://www.youtube.com/embed/6sGBGQUUSds", fallbackUrl: "https://www.json.org/" }
    ],
    resources: [
      { id: 1, title: "MDN REST API Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs" },
      { id: 2, title: "GeeksforGeeks REST API", url: "https://www.geeksforgeeks.org/rest-api-introduction/" },
      { id: 3, title: "JSON Documentation", url: "https://www.json.org/" }
    ],
    questions: [
      { id: 1, question: "What does REST stand for?", options: ["Representational State Transfer", "Remote System Transfer", "Response Server Transfer", "Resource Structure Transfer"], correct: 0 },
      { id: 2, question: "What is an API?", options: ["Website", "Application Programming Interface", "Programming language", "Database"], correct: 1 },
      { id: 3, question: "What is JSON?", options: ["JavaScript language", "Data format", "Programming framework", "CSS tool"], correct: 1 },
      { id: 4, question: "What is HTTP?", options: ["Hyper Text Transfer Protocol", "High Transfer Protocol", "Home Text Protocol", "Http Transfer Process"], correct: 0 },
      { id: 5, question: "What are HTTP methods?", options: ["Programming functions", "GET, POST, PUT, DELETE", "Server functions", "Database operations"], correct: 1 },
      { id: 6, question: "What is GET request?", options: ["Sends data", "Retrieves data", "Updates data", "Deletes data"], correct: 1 },
      { id: 7, question: "What is POST request?", options: ["Gets data", "Sends data to server", "Updates data", "Deletes data"], correct: 1 },
      { id: 8, question: "What is PUT request?", options: ["Creates new", "Gets data", "Updates existing", "Deletes data"], correct: 2 },
      { id: 9, question: "What is DELETE request?", options: ["Creates data", "Gets data", "Updates data", "Removes data"], correct: 3 },
      { id: 10, question: "What is an endpoint?", options: ["Starting point", "URL path for API action", "Server location", "Database table"], correct: 1 },
      { id: 11, question: "What are HTTP status codes?", options: ["Error messages", "Server responses", "HTML tags", "Database fields"], correct: 1 },
      { id: 12, question: "What is CORS?", options: ["Data format", "Cross-Origin Resource Sharing", "API protocol", "Server feature"], correct: 1 },
    ]
  },
  {
    id: 11,
    title: "MongoDB & NoSQL",
    icon: "fa-solid fa-leaf",
    description: "Learn NoSQL databases and MongoDB",
    difficulty: "Beginner",
    duration: "5 hours",
    enrollments: 16800,
    rating: 4.7,
    videos: [
      { id: 1, title: "NoSQL Database Concepts", duration: "18 min", url: "https://www.youtube.com/embed/meRQ0Fxpfpw", fallbackUrl: "https://docs.mongodb.com/" },
      { id: 2, title: "MongoDB Essentials", duration: "20 min", url: "https://www.youtube.com/embed/ofme2o29ngU", fallbackUrl: "https://www.geeksforgeeks.org/mongodb-tutorial/" },
      { id: 3, title: "CRUD Operations & Queries", duration: "22 min", url: "https://www.youtube.com/embed/fbYExfeFsI0", fallbackUrl: "https://www.mongodb.com/docs/manual/tutorial/" }
    ],
    resources: [
      { id: 1, title: "MongoDB Official", url: "https://docs.mongodb.com/" },
      { id: 2, title: "GeeksforGeeks MongoDB", url: "https://www.geeksforgeeks.org/mongodb-tutorial/" },
      { id: 3, title: "MongoDB Tutorials", url: "https://www.mongodb.com/docs/manual/tutorial/" }
    ],
    questions: [
      { id: 1, question: "What is NoSQL?", options: ["New SQL", "Non-relational database", "Not SQL", "No Structured Query Language"], correct: 3 },
      { id: 2, question: "What is MongoDB?", options: ["Database system", "Document database", "SQL database", "Server software"], correct: 1 },
      { id: 3, question: "What is a document in MongoDB?", options: ["Text file", "JSON-like object", "Database table", "Server"], correct: 1 },
      { id: 4, question: "What is a collection?", options: ["Group of items", "Table in MongoDB", "Database function", "Backup"], correct: 1 },
      { id: 5, question: "What is BSON?", options: ["Binary format", "Binary JSON", "Database format", "Server format"], correct: 1 },
      { id: 6, question: "What is indexing in MongoDB?", options: ["Numbering", "Speed up queries", "Database backup", "Server config"], correct: 1 },
      { id: 7, question: "What are aggregations?", options: ["Sum values", "Complex data processing", "Database backup", "Table creation"], correct: 1 },
      { id: 8, question: "What is sharding?", options: ["Breaking", "Splitting data across servers", "Backup method", "Database copy"], correct: 1 },
      { id: 9, question: "What is replication?", options: ["Copying", "Copying data between servers", "Backup", "Database merge"], correct: 1 },
      { id: 10, question: "What does insertOne do?", options: ["Updates document", "Inserts single document", "Deletes document", "Gets document"], correct: 1 },
      { id: 11, question: "What does find() do?", options: ["Creates document", "Searches documents", "Deletes document", "Updates document"], correct: 1 },
      { id: 12, question: "What is ObjectId?", options: ["String", "Unique identifier", "Database name", "Collection name"], correct: 1 },
    ]
  },
  {
    id: 12,
    title: "TypeScript Essentials",
    icon: "fa-brands fa-js",
    description: "Master TypeScript and type safety",
    difficulty: "Beginner",
    duration: "4 hours",
    enrollments: 17200,
    rating: 4.8,
    videos: [
      { id: 1, title: "TypeScript Basics & Types", duration: "18 min", url: "https://www.youtube.com/embed/d56mHq7C1eI", fallbackUrl: "https://www.typescriptlang.org/docs/" },
      { id: 2, title: "Interfaces & Classes", duration: "20 min", url: "https://www.youtube.com/embed/PJreZrgC8jM", fallbackUrl: "https://www.geeksforgeeks.org/typescript/" },
      { id: 3, title: "Generics & Advanced Types", duration: "22 min", url: "https://www.youtube.com/embed/h27Wuh1G-68", fallbackUrl: "https://www.tutorialspoint.com/typescript/" }
    ],
    resources: [
      { id: 1, title: "TypeScript Official Handbook", url: "https://www.typescriptlang.org/docs/" },
      { id: 2, title: "GeeksforGeeks TypeScript", url: "https://www.geeksforgeeks.org/typescript/" },
      { id: 3, title: "TypeScript Tutorialspoint", url: "https://www.tutorialspoint.com/typescript/" }
    ],
    questions: [
      { id: 1, question: "What is TypeScript?", options: ["JavaScript style", "JavaScript superset with types", "New JavaScript version", "CSS framework"], correct: 1 },
      { id: 2, question: "What is type annotation?", options: ["Comment", "Declaring variable type", "CSS style", "HTML attribute"], correct: 1 },
      { id: 3, question: "What is an interface?", options: ["UI element", "Contract for object structure", "CSS class", "HTML tag"], correct: 1 },
      { id: 4, question: "What is a generic?", options: ["Common type", "Reusable type parameter", "CSS property", "HTML element"], correct: 1 },
      { id: 5, question: "What is union type?", options: ["Single type", "Multiple possible types", "Type array", "Type object"], correct: 1 },
      { id: 6, question: "What is optional property?", options: ["Unnecessary", "May or may not exist", "Always required", "Default value"], correct: 1 },
      { id: 7, question: "What does readonly do?", options: ["Cannot read", "Cannot modify after creation", "Can write", "Can delete"], correct: 1 },
      { id: 8, question: "What is enum?", options: ["Enumeration of values", "Set of named constants", "Data type", "CSS selector"], correct: 1 },
      { id: 9, question: "What is a tuple?", options: ["Two items", "Fixed-length array with types", "Pair of values", "Array type"], correct: 1 },
      { id: 10, question: "What does any type do?", options: ["All types", "Disables type checking", "Default type", "Union type"], correct: 1 },
    ]
  },
  {
    id: 13,
    title: "Docker & Containers",
    icon: "fa-brands fa-docker",
    description: "Containerize applications with Docker",
    difficulty: "Beginner",
    duration: "5.5 hours",
    enrollments: 15600,
    rating: 4.9,
    videos: [
      { id: 1, title: "Docker Fundamentals", duration: "19 min", url: "https://www.youtube.com/embed/Kyx2PsuwomE" },
      { id: 2, title: "Images & Containers", duration: "21 min", url: "https://www.youtube.com/embed/JSLpG_spOHM" },
      { id: 3, title: "Docker Compose & Networks", duration: "20 min", url: "https://www.youtube.com/embed/xNJZYX2ybVE" }
    ],
    resources: [
      { id: 1, title: "Docker Official Docs", url: "https://docs.docker.com/" },
      { id: 2, title: "GeeksforGeeks Docker", url: "https://www.geeksforgeeks.org/docker-tutorial/" },
      { id: 3, title: "Docker Learning Resources", url: "https://www.docker.com/resources/" }
    ],
    questions: [
      { id: 1, question: "What is Docker?", options: ["Programming language", "Containerization platform", "Database", "Server software"], correct: 1 },
      { id: 2, question: "What is a container?", options: ["Box", "Isolated environment for app", "Database", "Server"], correct: 1 },
      { id: 3, question: "What is an image?", options: ["Picture", "Blueprint for container", "File", "Database"], correct: 1 },
      { id: 4, question: "What is Dockerfile?", options: ["Regular file", "Instructions to build image", "Database file", "Configuration file"], correct: 1 },
      { id: 5, question: "What does docker build do?", options: ["Runs container", "Creates image from Dockerfile", "Starts server", "Deletes container"], correct: 1 },
      { id: 6, question: "What does docker run do?", options: ["Builds image", "Creates and starts container", "Removes container", "Stops container"], correct: 1 },
      { id: 7, question: "What is docker-compose?", options: ["Write code", "Multi-container orchestration", "Build tool", "Server tool"], correct: 1 },
      { id: 8, question: "What is a volume?", options: ["Sound", "Persistent data storage", "Container size", "Image size"], correct: 1 },
      { id: 9, question: "What are container ports?", options: ["Harbor", "Network endpoints", "Container size", "Image layer"], correct: 1 },
      { id: 10, question: "What is docker push?", options: ["Physical action", "Uploads image to registry", "Runs container", "Builds image"], correct: 1 },
      { id: 11, question: "What is Docker Hub?", options: ["Website", "Registry for images", "Container engine", "Development tool"], correct: 1 },
      { id: 12, question: "What does docker exec do?", options: ["Runs image", "Executes command in container", "Removes container", "Stops container"], correct: 1 },
    ]
  },
  {
    id: 14,
    title: "AWS Cloud Services",
    icon: "fa-brands fa-aws",
    description: "Deploy and manage with Amazon Web Services",
    difficulty: "Beginner",
    duration: "6 hours",
    enrollments: 16200,
    rating: 4.8,
    videos: [
      { id: 1, title: "AWS Fundamentals & Core Services", duration: "22 min", url: "https://www.youtube.com/embed/k1RI5locZE4" },
      { id: 2, title: "EC2, S3 & Database Services", duration: "24 min", url: "https://www.youtube.com/embed/SO2z2wS0Uk8" },
      { id: 3, title: "Deployment & Scaling on AWS", duration: "20 min", url: "https://www.youtube.com/embed/ulprqHHWlng" }
    ],
    resources: [
      { id: 1, title: "AWS Official Documentation", url: "https://docs.aws.amazon.com/" },
      { id: 2, title: "GeeksforGeeks AWS", url: "https://www.geeksforgeeks.org/aws-full-form/" },
      { id: 3, title: "AWS Training Center", url: "https://www.aws.training/" }
    ],
    questions: [
      { id: 1, question: "What is AWS?", options: ["Website service", "Amazon Web Services", "Application Web Service", "Automatic Web System"], correct: 1 },
      { id: 2, question: "What is EC2?", options: ["Elastic Cloud Computing", "Server", "Virtual machine service", "All above"], correct: 3 },
      { id: 3, question: "What is S3?", options: ["Storage service", "Simple Storage Service", "Data storage", "All above"], correct: 3 },
      { id: 4, question: "What is Lambda?", options: ["Serverless function", "Computing service", "Execute code", "All above"], correct: 3 },
      { id: 5, question: "What is RDS?", options: ["Relational Database Service", "Remote Database System", "Database hosting", "All above"], correct: 0 },
      { id: 6, question: "What is CloudFront?", options: ["Server", "CDN service", "Content delivery", "All above"], correct: 3 },
      { id: 7, question: "What is IAM?", options: ["Identity Access Management", "User management", "Security", "All above"], correct: 3 },
      { id: 8, question: "What is VPC?", options: ["Virtual Private Cloud", "Network isolation", "Server environment", "All above"], correct: 3 },
      { id: 9, question: "What is SQS?", options: ["Queue service", "Message queue", "Async processing", "All above"], correct: 3 },
      { id: 10, question: "What is ElastiCache?", options: ["Caching service", "In-memory cache", "Performance boost", "All above"], correct: 3 },
      { id: 11, question: "What is Auto Scaling?", options: ["Manual scaling", "Automatic capacity adjustment", "Load balancing", "All above"], correct: 1 },
      { id: 12, question: "What does CloudWatch do?", options: ["Server", "Monitoring service", "Performance tracking", "All above"], correct: 3 },
    ]
  },
  {
    id: 15,
    title: "Machine Learning Basics",
    icon: "fa-solid fa-brain",
    description: "Introduction to ML and Python libraries",
    difficulty: "Beginner",
    duration: "7 hours",
    enrollments: 13400,
    rating: 4.8,
    videos: [
      { id: 1, title: "Machine Learning Fundamentals", duration: "20 min", url: "https://www.youtube.com/embed/uk8th-0VyHc" },
      { id: 2, title: "Supervised & Unsupervised Learning", duration: "22 min", url: "https://www.youtube.com/embed/F2Fs8pUKLWI" },
      { id: 3, title: "Python Libraries for ML", duration: "23 min", url: "https://www.youtube.com/embed/2F_OLJMf9hM" }
    ],
    resources: [
      { id: 1, title: "GeeksforGeeks Machine Learning", url: "https://www.geeksforgeeks.org/machine-learning/" },
      { id: 2, title: "Scikit-learn Docs", url: "https://scikit-learn.org/stable/" },
      { id: 3, title: "Google ML Resources", url: "https://developers.google.com/machine-learning" }
    ],
    questions: [
      { id: 1, question: "What is Machine Learning?", options: ["Programming", "Learning patterns from data", "Artificial Intelligence", "Data processing"], correct: 1 },
      { id: 2, question: "What are the main ML types?", options: ["Two types", "Supervised, Unsupervised, Reinforcement", "Classification, Regression", "Training, Testing"], correct: 1 },
      { id: 3, question: "What is supervised learning?", options: ["No labels", "Labeled training data", "Training humans", "Self-teaching"], correct: 1 },
      { id: 4, question: "What is unsupervised learning?", options: ["Has labels", "No labeled data", "Human supervised", "Pre-trained"], correct: 1 },
      { id: 5, question: "What is classification?", options: ["Organization", "Predicting categories", "Grouping data", "Sorting algorithm"], correct: 1 },
      { id: 6, question: "What is regression?", options: ["Going back", "Predicting continuous values", "Classification", "Clustering"], correct: 1 },
      { id: 7, question: "What is a dataset?", options: ["Set data", "Collection of data", "Single sample", "Database"], correct: 1 },
      { id: 8, question: "What is training data?", options: ["Learning data", "Data to train model", "Test data", "Raw data"], correct: 1 },
      { id: 9, question: "What is testing data?", options: ["Model evaluation data", "Training data", "Raw data", "Production data"], correct: 0 },
      { id: 10, question: "What is overfitting?", options: ["Too complex", "Model memorizes training data", "Underfitting", "Good fit"], correct: 1 },
      { id: 11, question: "What is underfitting?", options: ["Too simple", "Model too simple for data", "Good fit", "Overfitting"], correct: 1 },
      { id: 12, question: "What is accuracy metric?", options: ["Speed", "Correct predictions percentage", "Precision", "Recall"], correct: 1 },
    ]
  },
  {
    id: 16,
    title: "Angular Framework",
    icon: "fa-brands fa-angular",
    description: "Build enterprise apps with Angular",
    difficulty: "Beginner",
    duration: "6 hours",
    enrollments: 14800,
    rating: 4.7,
    videos: [
      { id: 1, title: "Angular Basics & Architecture", duration: "21 min", url: "https://www.youtube.com/embed/wbg_ys8YY6w" },
      { id: 2, title: "Components & Services", duration: "20 min", url: "https://www.youtube.com/embed/xHngGzKd_gU" },
      { id: 3, title: "Routing & Dependency Injection", duration: "22 min", url: "https://www.youtube.com/embed/BqmMIukVZnU" }
    ],
    resources: [
      { id: 1, title: "Angular Official Docs", url: "https://angular.io/docs" },
      { id: 2, title: "GeeksforGeeks Angular", url: "https://www.geeksforgeeks.org/angular-tutorials/" },
      { id: 3, title: "Angular Tutorial - W3Schools", url: "https://www.w3schools.com/angular/" }
    ],
    questions: [
      { id: 1, question: "What is Angular?", options: ["Angle", "TypeScript framework", "JavaScript library", "CSS framework"], correct: 1 },
      { id: 2, question: "What is dependency injection?", options: ["Code injection", "Providing dependencies", "Security issue", "Performance technique"], correct: 1 },
      { id: 3, question: "What is a service?", options: ["Server", "Reusable class", "HTTP request", "Database"], correct: 1 },
      { id: 4, question: "What is a directive?", options: ["HTML element", "Instruction for DOM", "CSS selector", "JavaScript function"], correct: 1 },
      { id: 5, question: "What is ngModel?", options: ["Model name", "Two-way binding", "Component model", "Data model"], correct: 1 },
      { id: 6, question: "What is routing?", options: ["Sending data", "Navigation between pages", "Network", "HTTP"], correct: 1 },
      { id: 7, question: "What is modules in Angular?", options: ["Code files", "Containers for features", "Database modules", "Functions"], correct: 1 },
      { id: 8, question: "What is component lifecycle?", options: ["Project timeline", "Component creation to destruction", "Build process", "Deployment"], correct: 1 },
      { id: 9, question: "What is RxJS?", options: ["Library", "Reactive programming library", "HTTP library", "Database library"], correct: 1 },
      { id: 10, question: "What is Observable?", options: ["Visible", "Async data stream", "Component", "Service"], correct: 1 },
    ]
  },
  {
    id: 17,
    title: "Vue.js Fundamentals",
    icon: "fa-brands fa-vuejs",
    description: "Learn Vue.js for interactive UIs",
    difficulty: "Beginner",
    duration: "4.5 hours",
    enrollments: 15500,
    rating: 4.7,
    videos: [
      { id: 1, title: "Vue.js Basics & Templates", duration: "19 min", url: "https://www.youtube.com/embed/FXpIoQ_rT_c" },
      { id: 2, title: "Directives & Data Binding", duration: "18 min", url: "https://www.youtube.com/embed/nxlwWaZpgW0" },
      { id: 3, title: "Components & Lifecycle", duration: "20 min", url: "https://www.youtube.com/embed/4deVCNvCh3A" }
    ],
    resources: [
      { id: 1, title: "Vue.js Official Guide", url: "https://vuejs.org/guide/" },
      { id: 2, title: "GeeksforGeeks Vue.js", url: "https://www.geeksforgeeks.org/vue-js-tutorial/" },
      { id: 3, title: "Vue.js W3Schools", url: "https://www.w3schools.com/whatis/whatis_vue.asp" }
    ],
    questions: [
      { id: 1, question: "What is Vue.js?", options: ["View library", "JavaScript framework", "CSS framework", "Database"], correct: 1 },
      { id: 2, question: "What is v-model?", options: ["HTML attribute", "Two-way binding", "CSS class", "JavaScript variable"], correct: 1 },
      { id: 3, question: "What is v-bind?", options: ["Binding data", "One-way binding", "Loop directive", "Conditional"], correct: 1 },
      { id: 4, question: "What is v-if?", options: ["If statement", "Conditional rendering", "Loop", "Event handler"], correct: 1 },
      { id: 5, question: "What is v-for?", options: ["For loop", "List rendering", "Conditional", "Event binding"], correct: 1 },
      { id: 6, question: "What is computed property?", options: ["Regular variable", "Cached computed value", "Method", "Data"], correct: 1 },
      { id: 7, question: "What is watcher?", options: ["Observer", "Reactive change handler", "Component", "Directive"], correct: 1 },
      { id: 8, question: "What is lifecycle hook?", options: ["Fishing hook", "Component stage callback", "Directive", "Service"], correct: 1 },
      { id: 9, question: "What is Vuex?", options: ["Library", "State management", "Routing", "HTTP client"], correct: 1 },
      { id: 10, question: "What is props?", options: ["Properties", "Data passed to component", "Component state", "HTML attributes"], correct: 1 },
    ]
  },
  {
    id: 18,
    title: "GraphQL",
    icon: "fa-solid fa-chart-network",
    description: "Query language for APIs",
    difficulty: "Beginner",
    duration: "5 hours",
    enrollments: 12900,
    rating: 4.8,
    videos: [
      { id: 1, title: "GraphQL Basics & Schema", duration: "20 min", url: "https://www.youtube.com/embed/HyHEwRR2htc" },
      { id: 2, title: "Queries & Mutations", duration: "19 min", url: "https://www.youtube.com/embed/b7aUr2xkavE" },
      { id: 3, title: "Apollo Server & Client", duration: "21 min", url: "https://www.youtube.com/embed/sT_-owjKIbA" }
    ],
    resources: [
      { id: 1, title: "GraphQL Official Docs", url: "https://graphql.org/learn/" },
      { id: 2, title: "Apollo GraphQL", url: "https://www.apollographql.com/docs/" },
      { id: 3, title: "GeeksforGeeks GraphQL", url: "https://www.geeksforgeeks.org/graphql-introduction/" }
    ],
    questions: [
      { id: 1, question: "What is GraphQL?", options: ["Graph", "Query language for APIs", "Database", "Framework"], correct: 1 },
      { id: 2, question: "How does GraphQL differ from REST?", options: ["Same", "Flexible queries vs fixed endpoints", "REST is better", "GraphQL older"], correct: 1 },
      { id: 3, question: "What is a schema?", options: ["Design", "Type definitions", "Database schema", "HTML schema"], correct: 1 },
      { id: 4, question: "What is a query?", options: ["Question", "Reading data", "Mutation", "Subscription"], correct: 1 },
      { id: 5, question: "What is a mutation?", options: ["Change", "Modifying data", "Reading data", "Deleting data"], correct: 1 },
      { id: 6, question: "What is a resolver?", options: ["Solving", "Function that returns field value", "Query", "Mutation"], correct: 1 },
      { id: 7, question: "What are fragments?", options: ["Pieces", "Reusable query parts", "Components", "Variables"], correct: 1 },
      { id: 8, question: "What is an Apollo Server?", options: ["Server", "GraphQL server implementation", "Database", "REST server"], correct: 1 },
      { id: 9, question: "What is batch processing?", options: ["Group work", "Combining multiple requests", "Sequential", "Parallel"], correct: 1 },
      { id: 10, question: "What is caching in GraphQL?", options: ["Memory", "Storing query results", "Database", "Network"], correct: 1 },
    ]
  },
  {
    id: 19,
    title: "Testing & QA",
    icon: "fa-solid fa-flask-vial",
    description: "Unit testing and quality assurance",
    difficulty: "Beginner",
    duration: "5 hours",
    enrollments: 14200,
    rating: 4.7,
    videos: [
      { id: 1, title: "Unit Testing Fundamentals", duration: "18 min", url: "https://www.youtube.com/embed/7M2pZISROVU" },
      { id: 2, title: "Jest & Test Frameworks", duration: "20 min", url: "https://www.youtube.com/embed/7deAwb0ba-s" },
      { id: 3, title: "Testing Best Practices", duration: "19 min", url: "https://www.youtube.com/embed/dKU8BRuGI9U" }
    ],
    resources: [
      { id: 1, title: "Jest Official Docs", url: "https://jestjs.io/docs/getting-started" },
      { id: 2, title: "Mocha Testing", url: "https://mochajs.org/" },
      { id: 3, title: "GeeksforGeeks Testing", url: "https://www.geeksforgeeks.org/software-testing/" }
    ],
    questions: [
      { id: 1, question: "What is unit testing?", options: ["Full app test", "Testing individual functions", "Performance test", "Load test"], correct: 1 },
      { id: 2, question: "What is integration testing?", options: ["Unit test", "Testing multiple components together", "End-to-end", "Manual testing"], correct: 1 },
      { id: 3, question: "What is end-to-end testing?", options: ["One step", "Full user workflow test", "Unit test", "Integration test"], correct: 1 },
      { id: 4, question: "What is Jest?", options: ["Joke", "Testing framework", "Database", "Server"], correct: 1 },
      { id: 5, question: "What is Mocha?", options: ["Coffee", "Testing framework", "Assertion library", "Test runner"], correct: 1 },
      { id: 6, question: "What is assertion?", options: ["Stating", "Verifying expected outcome", "Test case", "Bug report"], correct: 1 },
      { id: 7, question: "What is mocking?", options: ["Laughing", "Simulating objects", "Testing", "Debugging"], correct: 1 },
      { id: 8, question: "What is test coverage?", options: ["Test files", "Percentage of code tested", "Test cases", "Bug fixes"], correct: 1 },
      { id: 9, question: "What is TDD?", options: ["Testing", "Test-Driven Development", "Code first", "Test later"], correct: 1 },
      { id: 10, question: "What is CI/CD?", options: ["Continuous Integration/Continuous Deployment", "Code Integration", "Development", "Testing"], correct: 0 },
      { id: 11, question: "What is a bug?", options: ["Insect", "Software defect", "Feature", "Requirement"], correct: 1 },
      { id: 12, question: "What is regression testing?", options: ["Going back", "Testing after changes", "New features", "Unit test"], correct: 1 },
    ]
  },
  {
    id: 20,
    title: "DevOps Fundamentals",
    icon: "fa-solid fa-gear",
    description: "Continuous integration and deployment",
    difficulty: "Beginner",
    duration: "6 hours",
    enrollments: 13800,
    rating: 4.8,
    videos: [
      { id: 1, title: "DevOps Fundamentals", duration: "21 min", url: "https://www.youtube.com/embed/j5Zf0H6i1iE" },
      { id: 2, title: "CI/CD Pipelines & Automation", duration: "23 min", url: "https://www.youtube.com/embed/scEDHErZgdM" },
      { id: 3, title: "Monitoring & Infrastructure Code", duration: "22 min", url: "https://www.youtube.com/embed/yLrERZJnanE" }
    ],
    resources: [
      { id: 1, title: "Jenkins Official", url: "https://www.jenkins.io/" },
      { id: 2, title: "GeeksforGeeks DevOps", url: "https://www.geeksforgeeks.org/devops/" },
      { id: 3, title: "Kubernetes Docs", url: "https://kubernetes.io/docs/" }
    ],
    questions: [
      { id: 1, question: "What is DevOps?", options: ["Development", "Dev + Operations culture", "Operations", "Deployment"], correct: 1 },
      { id: 2, question: "What is CI/CD?", options: ["Continuous Integration/Deployment", "Code Integration", "Development", "Testing"], correct: 0 },
      { id: 3, question: "What is continuous integration?", options: ["Single integration", "Frequent code merges", "Deployment", "Testing"], correct: 1 },
      { id: 4, question: "What is continuous deployment?", options: ["One deployment", "Automatic production release", "Testing", "Staging"], correct: 1 },
      { id: 5, question: "What is Jenkins?", options: ["Name", "CI/CD automation server", "Testing tool", "Deployment tool"], correct: 1 },
      { id: 6, question: "What is GitLab CI?", options: ["Website", "Integrated CI/CD in GitLab", "Testing", "Deployment"], correct: 1 },
      { id: 7, question: "What is infrastructure as code?", options: ["Written infrastructure", "Code manages infrastructure", "Configuration", "Deployment"], correct: 1 },
      { id: 8, question: "What is monitoring?", options: ["Watching", "Tracking system health", "Testing", "Logging"], correct: 1 },
      { id: 9, question: "What is logging?", options: ["Wood", "Recording application events", "Monitoring", "Debugging"], correct: 1 },
      { id: 10, question: "What is load balancing?", options: ["Weight", "Distributing traffic", "Performance", "Scaling"], correct: 1 },
    ]
  }
];

const Login = ({ onLogin, onShowSignUp }) => {
  const [email, setEmail] = useState('Rom@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { email: 'Rom@example.com', password: 'password123', name: 'Rom' },
    { email: 'sara@example.com', password: 'sara123', name: 'Sara' }
  ];

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      const result = await loginAPI(email, password);
      if (result.success) {
        onLogin(result.user.username || result.user.email.split('@')[0]);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <h1>Login</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>Or try demo accounts</span>
        </div>

        <div className="demo-accounts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => handleDemoLogin(account)}
              disabled={loading}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.background = 'white'}
            >
              <i className="fa-solid fa-user"></i> {account.name}
            </button>
          ))}
        </div>

        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        <div className="login-socials">
          <button type="button" className="social-btn facebook">
            <i className="fa-brands fa-facebook-f"></i>
          </button>
          <button type="button" className="social-btn google">
            <i className="fa-brands fa-google"></i>
          </button>
          <button type="button" className="social-btn github">
            <i className="fa-brands fa-github"></i>
          </button>
        </div>

       <div className="login-footer">
  <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onShowSignUp(); }}>Sign up</a></p>
</div>
      </div>
    </div>
  );
};

const Signup = ({ onSignup, onShowLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password || !fullName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await signupAPI(username, email, password, fullName);
      if (result.success) {
        onSignup(result.user.username || result.user.email.split('@')[0]);
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <h1>Sign Up</h1>
          <p>Create a new account to get started</p>
        </div>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

       <div className="login-footer">
  <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onShowLogin(); }}>Sign in</a></p>
</div>
      </div>
    </div>
  );
};

const VideoSuggestions = ({ skill, onStartQuiz, onBack }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [failedVideos, setFailedVideos] = useState({});
  const [currentLoadStatus, setCurrentLoadStatus] = useState('idle'); // 'idle'|'loading'|'loaded'|'failed'
  const loadTimeoutRef = useRef(null);

  const handleVideoError = (videoId) => {
    setFailedVideos(prev => ({ ...prev, [videoId]: true }));
  };

  useEffect(() => {
    if (selectedVideoIndex === null) return;
    const video = skill.videos[selectedVideoIndex];
    if (!video) return;

    // start loading timer — if iframe doesn't report onLoad within timeout, mark failed
    setCurrentLoadStatus('loading');
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      handleVideoError(video.id);
      setCurrentLoadStatus('failed');
    }, 3000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [selectedVideoIndex, skill.videos]);

  return (
    <div className="video-suggestions-page">
      <div className="video-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back to Courses
        </button>
        <h1>📚 Study Materials: {skill.title}</h1>
        <p>Watch these videos before taking the test to improve your score!</p>
      </div>

      <div className="video-container">
        {skill.videos && skill.videos.length > 0 ? (
          <>
            {/* Video Player */}
            {selectedVideoIndex !== null && (
              <div className="video-player-section">
                {!failedVideos[skill.videos[selectedVideoIndex].id] ? (
                  <div className="video-player">
                    <iframe
                      width="100%"
                      height="600"
                      src={skill.videos[selectedVideoIndex].url}
                      title={skill.videos[selectedVideoIndex].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        console.log('Video loaded successfully');
                        setCurrentLoadStatus('loaded');
                        if (loadTimeoutRef.current) {
                          clearTimeout(loadTimeoutRef.current);
                          loadTimeoutRef.current = null;
                        }
                      }}
                      onError={() => {
                        handleVideoError(skill.videos[selectedVideoIndex].id);
                        setCurrentLoadStatus('failed');
                        if (loadTimeoutRef.current) {
                          clearTimeout(loadTimeoutRef.current);
                          loadTimeoutRef.current = null;
                        }
                      }}
                    ></iframe>
                  </div>
                ) : (
                  <div className="video-unavailable">
                    <i className="fa-solid fa-video-slash"></i>
                    <h3>Video Unavailable</h3>
                    <p>The video could not be loaded, but you can still learn from the resource link below.</p>
                    <a 
                      href={skill.videos[selectedVideoIndex].fallbackUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-fallback-resource"
                    >
                      <i className="fa-solid fa-link"></i> Visit Learning Resource
                    </a>
                  </div>
                )}
                <div className="video-info">
                  <h2>{skill.videos[selectedVideoIndex].title}</h2>
                  <p>Duration: {skill.videos[selectedVideoIndex].duration}</p>
                  {skill.videos[selectedVideoIndex].fallbackUrl && (
                    <p className="fallback-note">
                      <i className="fa-solid fa-info-circle"></i> 
                      <a href={skill.videos[selectedVideoIndex].fallbackUrl} target="_blank" rel="noopener noreferrer">
                        View learning resource
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Video List */}
            <div className="videos-list">
              <h2>Recommended Videos</h2>
              <div className="videos-grid">
                {skill.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`video-card ${selectedVideoIndex === index ? 'active' : ''}`}
                    onClick={() => {
                      if (loadTimeoutRef.current) {
                        clearTimeout(loadTimeoutRef.current);
                        loadTimeoutRef.current = null;
                      }
                      setCurrentLoadStatus('loading');
                      setSelectedVideoIndex(index);
                    }}
                  >
                    <div className="video-thumbnail">
                      {failedVideos[video.id] && (
                        <div className="video-badge error">
                          <i className="fa-solid fa-exclamation-circle"></i>
                        </div>
                      )}
                      <i className="fa-solid fa-play"></i>
                    </div>
                    <div className="video-details">
                      <h3>{video.title}</h3>
                      <p>
                        <i className="fa-solid fa-clock"></i> {video.duration}
                      </p>
                      {failedVideos[video.id] && (
                        <p className="video-status unavailable">
                          <i className="fa-solid fa-link"></i> Resource available
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="video-actions">
              <button className="btn-start-quiz" onClick={onStartQuiz}>
                <i className="fa-solid fa-arrow-right"></i> Ready? Start the Test!
              </button>
              <p className="video-tip">
                <i className="fa-solid fa-lightbulb"></i> Pro Tip: Watch at least one video before taking the test!
              </p>
            </div>
          </>
        ) : (
          <div className="no-videos">
            <i className="fa-solid fa-video"></i>
            <p>No study videos available for this skill yet.</p>
            <button className="btn-start-quiz" onClick={onStartQuiz}>
              Start the Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Quiz = ({ skill, onBack, skillProgress, setSkillProgress, onViewDashboard }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (index) => {
    setAnswers({ ...answers, [currentQuestion]: index });
  };

  const handleNext = () => {
    if (currentQuestion < skill.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const correctCount = skill.questions.filter(
      (q, i) => answers[i] === q.correct
    ).length;

    const percentage = Math.round(
      (correctCount / skill.questions.length) * 100
    );

    setSkillProgress({
      ...skillProgress,
      [skill.id]: {
        status: percentage >= 60 ? 'Completed' : 'In Progress',
        score: percentage
      }
    });

    // Prepare answer details for storage
    const answerDetails = skill.questions.map((q, index) => ({
      questionId: q.id,
      question: q.question,
      selectedAnswer: q.options[answers[index]] || 'Not answered',
      correctAnswer: q.options[q.correct],
      isCorrect: answers[index] === q.correct
    }));

    // Save result to MongoDB
    try {
      const result = await saveResult({
        courseId: skill.id,
        courseName: skill.title,
        score: correctCount,
        totalQuestions: skill.questions.length,
        answers: answerDetails,
        duration: 0 // You can add a timer if needed
      });

      if (!result.success) {
        console.error('Failed to save result:', result.message);
        // Still show results even if saving failed
      }
    } catch (error) {
      console.error('Error saving result:', error);
      // Still show results even if saving failed
    }

    setShowResults(true);
  };

  if (showResults) {
    const correctCount = skill.questions.filter((q, i) => answers[i] === q.correct).length;
    const percentage = Math.round((correctCount / skill.questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="results-page">
        <div className="results-container">
          <div className="results-header">
            <div className="results-badge">{passed ? '🎉' : '📚'}</div>
            <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
            <p>{passed ? 'You passed the quiz!' : 'Practice makes perfect - try again!'}</p>
          </div>
          <div className="results-stats">
            <div className="stat-box">
              <div className="value">{percentage}%</div>
              <div className="label">Score</div>
            </div>
            <div className="stat-box">
              <div className="value">{correctCount}/{skill.questions.length}</div>
              <div className="label">Correct</div>
            </div>
            <div className="stat-box">
              <div className="value">{skill.questions.length - correctCount}</div>
              <div className="label">Incorrect</div>
            </div>
          </div>
          <div className="results-actions">
            <button className="btn-retake" onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
            }}>Retake Quiz</button>
            <button className="btn-dashboard" onClick={onViewDashboard}>
              <i className="fa-solid fa-chart-bar"></i> View Dashboard
            </button>
            <button className="btn-home" onClick={onBack}>Back to Skills</button>
          </div>
        </div>
      </div>
    );
  }

  const question = skill.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / skill.questions.length) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>{skill.title}</h2>
          <button className="quiz-back-btn" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progress + '%' }}></div>
        </div>
        <div className="quiz-content">
          <div className="quiz-stats">
            <div className="quiz-stat">Question <strong>{currentQuestion + 1}/{skill.questions.length}</strong></div>
            <div className="quiz-stat">Progress <strong>{Math.round(progress)}%</strong></div>
          </div>
          <div className="question-box">
            <p className="question-text">{question.question}</p>
            <div className="options">
              {question.options.map((option, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name="answer"
                    value={idx}
                    checked={answers[currentQuestion] === idx}
                    onChange={() => handleAnswer(idx)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="quiz-buttons">
            <button className="btn-prev" onClick={handlePrev} disabled={currentQuestion === 0}>
              Previous
            </button>
            {currentQuestion === skill.questions.length - 1 ? (
              <button className="btn-submit" onClick={handleSubmit}>
                Submit Quiz
              </button>
            ) : (
              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillsBrowser = ({ onSelectSkill, onLogout, skillProgress, onViewResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const filteredSkills = skillsData.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || skill.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="skills-page">
      <div className="skills-navbar">
        <div className="navbar-brand">SkillMatrix Pro</div>
        <div className="navbar-actions">
          <button className="btn-results" onClick={onViewResults}>
            <i className="fa-solid fa-chart-bar"></i> View Results
          </button>
          <button className="btn-logout" onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>

      <div className="skills-hero">
        <h1>Learn & Master Skills</h1>
        <p>Choose a course and start your learning journey today</p>
      </div>

      <div className="skills-container">
        <div className="skills-toolbar">
          <div className="search-box">
            <i className="fa-solid fa-search"></i>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="difficulty-filter">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                className={`filter-btn ${difficultyFilter === level ? 'active' : ''}`}
                onClick={() => setDifficultyFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div key={skill.id} className="skill-card-full">
                <div className="skill-icon-box">
                  <i className={skill.icon}></i>
                </div>
                <h3>{skill.title}</h3>
                {skillProgress?.[skill.id] && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginBottom: '10px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background:
                        skillProgress[skill.id].status === 'Completed'
                          ? '#10b981'
                          : '#f59e0b',
                      color: 'white'
                    }}
                  >
                    {skillProgress[skill.id].status}
                    {skillProgress[skill.id].score !== undefined &&
                      ` (${skillProgress[skill.id].score}%)`}
                  </span>
                )}

                <p>{skill.description}</p>

                <div className="skill-meta">
                  <span className={`difficulty ${skill.difficulty.toLowerCase()}`}>
                    {skill.difficulty}
                  </span>
                  <span className="duration">
                    <i className="fa-solid fa-clock"></i> {skill.duration}
                  </span>
                </div>

                <div className="skill-stats">
                  <span>
                    <i className="fa-solid fa-star"></i> {skill.rating}
                  </span>
                  <span>
                    <i className="fa-solid fa-users"></i> {skill.enrollments.toLocaleString()}
                  </span>
                </div>

                <button
                  className="btn-start"
                  onClick={() => onSelectSkill(skill)}
                >
                  <i className="fa-solid fa-play"></i> Start Quiz
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="fa-solid fa-search"></i>
              <p>No courses found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillProgress, setSkillProgress] = useState({});
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDataViewer, setShowDataViewer] = useState(false);
  const [userName, setUserName] = useState('User');
  const [showQuiz, setShowQuiz] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.username || user.email.split('@')[0]);
      }
    }
  }, []);

  const handleLogout = () => {
    logoutAPI();
    setIsLoggedIn(false);
    setShowSignUp(false);
    setUserName('User');
    setSelectedSkill(null);
    setShowDashboard(false);
    setShowDataViewer(false);
    setShowQuiz(false);
  };

  // Fetch data from backend API
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        const data = await response.json();
        console.log('✓ Backend connected! Data:', data);
      } catch (error) {
        console.log('Backend connection info:', error.message);
      }
    };
    fetchBackendData();
  }, []);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('skillProgress');
    if (savedProgress) {
      setSkillProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('skillProgress', JSON.stringify(skillProgress));
  }, [skillProgress]);

  return (
    <div className="app">
      {!isLoggedIn ? (
        showSignUp ? (
          <Signup 
            onSignup={(name) => { setIsLoggedIn(true); setUserName(name); setShowSignUp(false); }}
            onShowLogin={() => setShowSignUp(false)}
          />
        ) : (
          <Login 
            onLogin={(name) => { setIsLoggedIn(true); setUserName(name); }}
            onShowSignUp={() => setShowSignUp(true)}
          />
        )
      ) : showDataViewer ? (
        <div>
          <button onClick={() => setShowDataViewer(false)} className="back-btn">← Back</button>
          <DataViewer />
        </div>
      ) : selectedSkill && !showQuiz ? (
        <VideoSuggestions
          skill={selectedSkill}
          onStartQuiz={() => setShowQuiz(true)}
          onBack={() => { setSelectedSkill(null); setShowQuiz(false); }}
        />
      ) : selectedSkill && showQuiz ? (
        <Quiz
          skill={selectedSkill}
          onBack={() => { setSelectedSkill(null); setShowQuiz(false); }}
          skillProgress={skillProgress}
          setSkillProgress={setSkillProgress}
          onViewDashboard={() => { setShowDashboard(true); setSelectedSkill(null); setShowQuiz(false); }}
        />
      ) : (
        showDashboard ? (
        <Dashboard
          userName={userName}
          skillProgress={skillProgress}
          skillsData={skillsData}
          onBack={() => setShowDashboard(false)}
          onViewResults={() => setShowDataViewer(true)}
        />
      ) : (
        <SkillsBrowser
          onSelectSkill={(skill) => { setSelectedSkill(skill); setShowQuiz(false); }}
          onLogout={handleLogout}
          skillProgress={skillProgress}
          onViewResults={() => setShowDataViewer(true)}
        />
      )
      )}
    </div>
  );
}