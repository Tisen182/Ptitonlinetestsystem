export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: 'Practice' | 'Midterm' | 'Final' | 'Quiz';
  status: 'free' | 'scheduled';
  scheduledTime?: string;
  endTime?: string;
  duration: number;
  questions: Question[];
  totalParticipants: number;
  completionRate: number;
  averageScore: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  fullName: string;
  studentId?: string;
  createdAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  answers: (number | null)[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeSpent: number;
  status: 'completed' | 'incomplete';
}

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam1',
    title: 'Introduction to Programming',
    description: 'Basic Python programming concepts including variables, data types, loops, and functions.',
    subject: 'CSE101',
    category: 'Practice',
    status: 'free',
    duration: 30,
    totalParticipants: 145,
    completionRate: 92,
    averageScore: 7.4,
    createdAt: '2024-09-01',
    questions: [
      {
        id: 'q1_1',
        text: 'What is the output of `print(type(3.14))`?',
        options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"],
        correctAnswer: 1,
        explanation: "3.14 is a floating-point number, so its type is 'float'.",
      },
      {
        id: 'q1_2',
        text: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1,
        explanation: "In Python, the 'def' keyword is used to define a function.",
      },
      {
        id: 'q1_3',
        text: 'What does the `len()` function return for the string "Hello"?',
        options: ['4', '5', '6', 'Error'],
        correctAnswer: 1,
        explanation: '"Hello" has 5 characters: H, e, l, l, o.',
      },
      {
        id: 'q1_4',
        text: 'What is the output of `print(10 // 3)`?',
        options: ['3', '3.33', '4', '1'],
        correctAnswer: 0,
        explanation: "'//' is integer (floor) division. 10 // 3 = 3 with remainder 1.",
      },
      {
        id: 'q1_5',
        text: 'Which of the following creates an empty list in Python?',
        options: ['list = {}', 'list = []', 'list = ()', 'list = new List()'],
        correctAnswer: 1,
        explanation: 'Square brackets [] create an empty list. {} creates a dict, () creates a tuple.',
      },
      {
        id: 'q1_6',
        text: 'What is the output of `print(2 ** 8)`?',
        options: ['16', '64', '256', '128'],
        correctAnswer: 2,
        explanation: '** is the exponentiation operator. 2^8 = 256.',
      },
      {
        id: 'q1_7',
        text: 'How do you add an element to the end of a list in Python?',
        options: ['list.add(x)', 'list.push(x)', 'list.append(x)', 'list.insert(x)'],
        correctAnswer: 2,
        explanation: "The append() method adds an element to the end of a list.",
      },
      {
        id: 'q1_8',
        text: 'Which statement is used for exception handling in Python?',
        options: ['try/catch', 'try/except', 'catch/throw', 'handle/except'],
        correctAnswer: 1,
        explanation: "Python uses try/except blocks for exception handling.",
      },
      {
        id: 'q1_9',
        text: 'What is a tuple in Python?',
        options: [
          'A mutable ordered collection',
          'An immutable ordered collection',
          'A key-value pair collection',
          'An unordered collection',
        ],
        correctAnswer: 1,
        explanation: 'Tuples are immutable (cannot be changed after creation) ordered sequences.',
      },
      {
        id: 'q1_10',
        text: 'Which function converts a string to an integer in Python?',
        options: ['str()', 'float()', 'int()', 'convert()'],
        correctAnswer: 2,
        explanation: "int() converts a string or float to an integer.",
      },
    ],
  },
  {
    id: 'exam2',
    title: 'Data Structures & Algorithms - Midterm',
    description: 'Covers arrays, linked lists, trees, graphs, and algorithm complexity analysis.',
    subject: 'CSE201',
    category: 'Midterm',
    status: 'scheduled',
    scheduledTime: '2025-03-15T08:00:00',
    endTime: '2025-03-15T10:00:00',
    duration: 60,
    totalParticipants: 118,
    completionRate: 88,
    averageScore: 6.8,
    createdAt: '2024-09-01',
    questions: [
      {
        id: 'q2_1',
        text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
        explanation: 'Binary search halves the search space each iteration, giving O(log n) complexity.',
      },
      {
        id: 'q2_2',
        text: 'Which data structure uses the LIFO (Last In, First Out) principle?',
        options: ['Queue', 'Stack', 'Deque', 'Priority Queue'],
        correctAnswer: 1,
        explanation: 'A Stack follows LIFO: the last element pushed is the first to be popped.',
      },
      {
        id: 'q2_3',
        text: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'QuickSort worst case is O(n²) when the pivot is consistently the smallest or largest element.',
      },
      {
        id: 'q2_4',
        text: 'Which tree traversal visits nodes in Left-Root-Right order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 1,
        explanation: 'In-order traversal (Left, Root, Right) on a BST produces sorted output.',
      },
      {
        id: 'q2_5',
        text: 'What is the time complexity of inserting at the head of a singly linked list?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correctAnswer: 2,
        explanation: 'Inserting at the head only requires updating the head pointer — O(1).',
      },
      {
        id: 'q2_6',
        text: 'In a max-heap, what is the property of the root element?',
        options: [
          'It is the smallest element',
          'It is the largest element',
          'It is a random element',
          'It is the median element',
        ],
        correctAnswer: 1,
        explanation: 'In a max-heap, the root is always the maximum element.',
      },
      {
        id: 'q2_7',
        text: 'What is the main advantage of a hash table over other data structures?',
        options: [
          'O(1) average time for lookup, insert, delete',
          'Always sorted data',
          'Uses less memory',
          'Sequential access pattern',
        ],
        correctAnswer: 0,
        explanation: 'Hash tables provide O(1) average time complexity for common operations.',
      },
      {
        id: 'q2_8',
        text: 'What is the height of a balanced binary tree with n nodes?',
        options: ['O(n)', 'O(log n)', 'O(√n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'A balanced binary tree has height O(log n).',
      },
      {
        id: 'q2_9',
        text: 'Which data structure is best suited for implementing BFS (Breadth-First Search)?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
        correctAnswer: 1,
        explanation: 'BFS uses a Queue to process nodes level by level.',
      },
      {
        id: 'q2_10',
        text: 'A graph with V vertices stored as an adjacency matrix requires how much space?',
        options: ['O(V + E)', 'O(V²)', 'O(E)', 'O(V log V)'],
        correctAnswer: 1,
        explanation: 'An adjacency matrix is a V×V 2D array, requiring O(V²) space.',
      },
    ],
  },
  {
    id: 'exam3',
    title: 'Computer Networks - Final Exam',
    description: 'Comprehensive exam covering OSI model, TCP/IP, routing protocols, and network security.',
    subject: 'NET301',
    category: 'Final',
    status: 'scheduled',
    scheduledTime: '2025-05-20T13:00:00',
    endTime: '2025-05-20T14:30:00',
    duration: 90,
    totalParticipants: 102,
    completionRate: 85,
    averageScore: 6.5,
    createdAt: '2024-09-01',
    questions: [
      {
        id: 'q3_1',
        text: 'What does HTTP stand for?',
        options: [
          'HyperText Transfer Protocol',
          'HyperText Transmission Protocol',
          'High Transfer Text Protocol',
          'Hyperlink Text Transfer Protocol',
        ],
        correctAnswer: 0,
        explanation: 'HTTP stands for HyperText Transfer Protocol.',
      },
      {
        id: 'q3_2',
        text: 'Which OSI layer is responsible for routing packets between networks?',
        options: ['Data Link Layer (Layer 2)', 'Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Session Layer (Layer 5)'],
        correctAnswer: 1,
        explanation: 'The Network Layer (Layer 3) handles logical addressing and routing.',
      },
      {
        id: 'q3_3',
        text: 'How many bits are in an IPv4 address?',
        options: ['16 bits', '32 bits', '64 bits', '128 bits'],
        correctAnswer: 1,
        explanation: 'IPv4 addresses are 32 bits long, written as 4 octets (e.g., 192.168.1.1).',
      },
      {
        id: 'q3_4',
        text: 'Which port does HTTPS use by default?',
        options: ['80', '8080', '443', '8443'],
        correctAnswer: 2,
        explanation: 'HTTPS uses port 443 by default (HTTP uses port 80).',
      },
      {
        id: 'q3_5',
        text: 'What is the primary function of DNS?',
        options: [
          'Assign IP addresses automatically',
          'Translate domain names to IP addresses',
          'Encrypt network traffic',
          'Route packets between networks',
        ],
        correctAnswer: 1,
        explanation: 'DNS (Domain Name System) translates human-readable domain names to IP addresses.',
      },
      {
        id: 'q3_6',
        text: 'Which protocol provides reliable, ordered data transmission?',
        options: ['UDP', 'IP', 'TCP', 'ICMP'],
        correctAnswer: 2,
        explanation: 'TCP (Transmission Control Protocol) guarantees reliable, ordered delivery.',
      },
      {
        id: 'q3_7',
        text: 'What does ARP resolve?',
        options: [
          'Domain names to IP addresses',
          'IP addresses to MAC addresses',
          'Port numbers to services',
          'URLs to web pages',
        ],
        correctAnswer: 1,
        explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network.',
      },
      {
        id: 'q3_8',
        text: 'Which network topology connects all devices to a central hub or switch?',
        options: ['Ring', 'Mesh', 'Bus', 'Star'],
        correctAnswer: 3,
        explanation: 'In a Star topology, all devices connect to a central hub or switch.',
      },
      {
        id: 'q3_9',
        text: 'What is the purpose of a subnet mask?',
        options: [
          'Encrypting network traffic',
          'Identifying the network and host portions of an IP address',
          'Routing packets between subnets',
          'Assigning dynamic IP addresses',
        ],
        correctAnswer: 1,
        explanation: 'A subnet mask separates the network address from the host address.',
      },
      {
        id: 'q3_10',
        text: 'What is the purpose of the TCP three-way handshake?',
        options: ['Data encryption', 'Establishing a reliable connection', 'Error correction in transit', 'Flow control'],
        correctAnswer: 1,
        explanation: 'The SYN, SYN-ACK, ACK three-way handshake establishes a TCP connection.',
      },
    ],
  },
  {
    id: 'exam4',
    title: 'Database Systems - Quick Quiz',
    description: 'Quiz covering SQL basics, normalization, transactions, and relational database concepts.',
    subject: 'DB201',
    category: 'Quiz',
    status: 'free',
    duration: 20,
    totalParticipants: 178,
    completionRate: 95,
    averageScore: 7.9,
    createdAt: '2024-09-15',
    questions: [
      {
        id: 'q4_1',
        text: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'],
        correctAnswer: 0,
        explanation: 'SQL stands for Structured Query Language.',
      },
      {
        id: 'q4_2',
        text: 'Which SQL command retrieves data from a table?',
        options: ['GET', 'FETCH', 'SELECT', 'RETRIEVE'],
        correctAnswer: 2,
        explanation: 'SELECT is the SQL command used to query and retrieve data.',
      },
      {
        id: 'q4_3',
        text: 'What is a primary key in a relational database?',
        options: [
          'A key used for data encryption',
          'A unique identifier for each record in a table',
          'A foreign key reference to another table',
          'An index for faster searching',
        ],
        correctAnswer: 1,
        explanation: 'A primary key uniquely identifies each row in a database table.',
      },
      {
        id: 'q4_4',
        text: 'What does the JOIN operation accomplish in SQL?',
        options: [
          'Creates a new database table',
          'Combines rows from two or more tables based on a related column',
          'Deletes duplicate records',
          'Sorts the query result set',
        ],
        correctAnswer: 1,
        explanation: 'JOIN combines rows from multiple tables based on a related column condition.',
      },
      {
        id: 'q4_5',
        text: 'What is database normalization?',
        options: [
          'Converting data to normal text format',
          'Organizing data to reduce redundancy and improve integrity',
          'Encrypting the database for security',
          'Creating database backups',
        ],
        correctAnswer: 1,
        explanation: 'Normalization organizes tables to reduce data redundancy and dependency.',
      },
      {
        id: 'q4_6',
        text: 'Which SQL clause filters grouped results?',
        options: ['WHERE', 'FILTER', 'HAVING', 'GROUP BY'],
        correctAnswer: 2,
        explanation: 'HAVING filters grouped data, while WHERE filters individual rows.',
      },
      {
        id: 'q4_7',
        text: 'What is a foreign key?',
        options: [
          'A key used from another database system',
          'A column that references the primary key in another table',
          'A composite key made of multiple columns',
          'A unique identifier that cannot be null',
        ],
        correctAnswer: 1,
        explanation: 'A foreign key creates a link between two tables by referencing the primary key of another table.',
      },
      {
        id: 'q4_8',
        text: 'Which JOIN type returns all records from both tables?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        correctAnswer: 3,
        explanation: 'FULL OUTER JOIN returns all records from both tables, with NULLs where no match exists.',
      },
      {
        id: 'q4_9',
        text: 'In database terminology, what is a transaction?',
        options: [
          'A financial payment operation',
          'A sequence of operations that must all succeed or all fail together',
          'A type of complex database query',
          'A scheduled database backup',
        ],
        correctAnswer: 1,
        explanation: 'A transaction is an atomic unit of work — either all operations succeed or all are rolled back.',
      },
      {
        id: 'q4_10',
        text: 'Which ACID property ensures data remains consistent before and after a transaction?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswer: 1,
        explanation: 'Consistency ensures a transaction brings the database from one valid state to another.',
      },
    ],
  },
  {
    id: 'exam5',
    title: 'Operating Systems - Practice Test',
    description: 'Practice test on processes, scheduling, memory management, deadlocks, and file systems.',
    subject: 'OS301',
    category: 'Practice',
    status: 'free',
    duration: 45,
    totalParticipants: 134,
    completionRate: 91,
    averageScore: 7.1,
    createdAt: '2024-10-01',
    questions: [
      {
        id: 'q5_1',
        text: 'What is a process in an operating system?',
        options: ['A stored program on disk', 'A program in execution', 'A file in the filesystem', 'A hardware component'],
        correctAnswer: 1,
        explanation: 'A process is a program that is being executed, with its own memory space and resources.',
      },
      {
        id: 'q5_2',
        text: 'What does the CPU scheduler decide?',
        options: [
          'How to allocate memory to processes',
          'Which process runs on the CPU next',
          'How to handle file read/write operations',
          'How to manage network connections',
        ],
        correctAnswer: 1,
        explanation: 'The CPU scheduler determines which ready process gets to run on the CPU.',
      },
      {
        id: 'q5_3',
        text: 'What is a deadlock?',
        options: [
          'A program crash due to a memory error',
          'A situation where processes wait indefinitely for resources held by each other',
          'A memory overflow condition',
          'A corrupted file system error',
        ],
        correctAnswer: 1,
        explanation: 'A deadlock occurs when processes are in a circular wait, each holding a resource the next needs.',
      },
      {
        id: 'q5_4',
        text: 'What is virtual memory?',
        options: [
          'Memory that is simulated and does not physically exist',
          'A technique that uses disk space to extend available RAM',
          'RAM used by virtual machines',
          'CPU cache memory',
        ],
        correctAnswer: 1,
        explanation: "Virtual memory uses disk (swap space) to extend the system's apparent RAM capacity.",
      },
      {
        id: 'q5_5',
        text: 'Which scheduling algorithm selects the job with the shortest remaining time?',
        options: ['First Come First Served (FCFS)', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling'],
        correctAnswer: 2,
        explanation: 'SJF minimizes average waiting time by prioritizing the shortest next CPU burst.',
      },
      {
        id: 'q5_6',
        text: 'What is a semaphore used for?',
        options: [
          'A type of network signaling protocol',
          'A synchronization primitive for controlling access to shared resources',
          'A memory management data structure',
          'A file system journaling mechanism',
        ],
        correctAnswer: 1,
        explanation: 'Semaphores are integer variables used to synchronize concurrent processes.',
      },
      {
        id: 'q5_7',
        text: 'What is the key difference between a process and a thread?',
        options: [
          'They are identical in all aspects',
          'Threads share the same memory space within a process',
          'Processes always run faster than threads',
          'Threads cannot communicate with each other',
        ],
        correctAnswer: 1,
        explanation: 'Threads within the same process share memory and resources, making communication easier.',
      },
      {
        id: 'q5_8',
        text: 'What does paging in memory management involve?',
        options: [
          'Sending pages to a network printer',
          'Dividing physical memory into fixed-size frames and logical memory into pages',
          'Organizing files in paginated documents',
          'Caching frequently used data in registers',
        ],
        correctAnswer: 1,
        explanation: 'Paging divides memory into fixed-size units to eliminate external fragmentation.',
      },
      {
        id: 'q5_9',
        text: "Which algorithm prevents deadlocks by simulating resource allocation to check system safety?",
        options: ["Banker's Algorithm", 'Round Robin Scheduling', 'LRU Page Replacement', 'Clock Algorithm'],
        correctAnswer: 0,
        explanation: "The Banker's Algorithm avoids deadlocks by only granting requests that keep the system in a safe state.",
      },
      {
        id: 'q5_10',
        text: 'What is the purpose of an interrupt in an operating system?',
        options: [
          'To forcibly stop the computer',
          'To signal the CPU that an event requires immediate attention',
          'To allocate memory to a process',
          'To schedule the next process',
        ],
        correctAnswer: 1,
        explanation: 'Interrupts allow hardware or software to signal the CPU to handle an event asynchronously.',
      },
    ],
  },
  {
    id: 'exam6',
    title: 'Web Development - Final Exam',
    description: 'Final exam covering HTML, CSS, JavaScript, React, REST APIs, and web security fundamentals.',
    subject: 'WEB401',
    category: 'Final',
    status: 'scheduled',
    scheduledTime: '2025-05-25T08:00:00',
    endTime: '2025-05-25T10:00:00',
    duration: 60,
    totalParticipants: 89,
    completionRate: 87,
    averageScore: 7.2,
    createdAt: '2024-10-15',
    questions: [
      {
        id: 'q6_1',
        text: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'High Technology Markup Language',
          'HyperText Module Language',
          'Hyperlink Text Markup Language',
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for HyperText Markup Language.',
      },
      {
        id: 'q6_2',
        text: 'Which CSS property changes the text color of an element?',
        options: ['font-color', 'text-color', 'color', 'text-style'],
        correctAnswer: 2,
        explanation: "The 'color' property sets the text color in CSS.",
      },
      {
        id: 'q6_3',
        text: 'What does the `async` attribute do when added to a <script> tag?',
        options: [
          'Makes the script run synchronously before page load',
          'Downloads and executes the script asynchronously without blocking HTML parsing',
          'Defers script execution until after DOM is ready',
          'Runs the script in a separate Web Worker',
        ],
        correctAnswer: 1,
        explanation: 'async downloads the script in parallel and executes it as soon as it is downloaded.',
      },
      {
        id: 'q6_4',
        text: 'Which HTTP method is typically used to send data to create a new resource?',
        options: ['GET', 'DELETE', 'POST', 'HEAD'],
        correctAnswer: 2,
        explanation: 'POST is used to submit data and create new resources on the server.',
      },
      {
        id: 'q6_5',
        text: 'What is CSS Flexbox primarily used for?',
        options: [
          'Adding 3D transformation effects',
          'Creating one-dimensional (row or column) layouts',
          'Animating CSS properties',
          'Managing asynchronous server requests',
        ],
        correctAnswer: 1,
        explanation: 'Flexbox is a one-dimensional layout model for distributing space along a row or column.',
      },
      {
        id: 'q6_6',
        text: 'Which React hook is used to perform side effects (e.g., data fetching, subscriptions)?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation: 'useEffect runs after render and handles side effects like data fetching or DOM manipulation.',
      },
      {
        id: 'q6_7',
        text: 'What is the Virtual DOM in React?',
        options: [
          'A virtual reality browser interface',
          'A lightweight in-memory representation of the actual DOM',
          'A server-side backup of the DOM',
          'A server-side rendering technique',
        ],
        correctAnswer: 1,
        explanation: 'React maintains a Virtual DOM to efficiently compute and apply minimal real DOM updates.',
      },
      {
        id: 'q6_8',
        text: 'What does REST stand for in web development?',
        options: [
          'Remote Execution of State Transfer',
          'Representational State Transfer',
          'Remote Service Technology',
          'Real-time Service Technology',
        ],
        correctAnswer: 1,
        explanation: 'REST (Representational State Transfer) is an architectural style for designing web APIs.',
      },
      {
        id: 'q6_9',
        text: 'Which JavaScript method converts a JavaScript object to a JSON string?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.encode()', 'JSON.serialize()'],
        correctAnswer: 1,
        explanation: 'JSON.stringify() serializes a JavaScript value to a JSON string.',
      },
      {
        id: 'q6_10',
        text: 'What is CORS (Cross-Origin Resource Sharing)?',
        options: [
          'A JavaScript programming framework',
          'A browser security mechanism controlling cross-origin HTTP requests',
          'A CSS layout technique',
          'A type of database query language',
        ],
        correctAnswer: 1,
        explanation: 'CORS is a browser security feature that restricts web pages from making requests to a different origin.',
      },
    ],
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'student1',
    email: 'student1@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Nguyễn Văn An',
    studentId: 'B21DCCN001',
    createdAt: '2024-09-01',
  },
  {
    id: 'u2',
    username: 'student2',
    email: 'student2@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Trần Thị Bình',
    studentId: 'B21DCCN002',
    createdAt: '2024-09-01',
  },
  {
    id: 'u3',
    username: 'student3',
    email: 'student3@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Lê Quang Cường',
    studentId: 'B21DCCN003',
    createdAt: '2024-09-02',
  },
  {
    id: 'u4',
    username: 'student4',
    email: 'student4@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Phạm Thị Dung',
    studentId: 'B21DCCN004',
    createdAt: '2024-09-02',
  },
  {
    id: 'u5',
    username: 'student5',
    email: 'student5@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Hoàng Văn Em',
    studentId: 'B21DCCN005',
    createdAt: '2024-09-03',
  },
  {
    id: 'u6',
    username: 'student6',
    email: 'student6@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Vũ Thị Phương',
    studentId: 'B21DCCN006',
    createdAt: '2024-09-03',
  },
  {
    id: 'u7',
    username: 'student7',
    email: 'student7@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Đặng Minh Giang',
    studentId: 'B21DCCN007',
    createdAt: '2024-09-04',
  },
  {
    id: 'u8',
    username: 'student8',
    email: 'student8@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Bùi Thị Hoa',
    studentId: 'B21DCCN008',
    createdAt: '2024-09-04',
  },
  {
    id: 'u9',
    username: 'student9',
    email: 'student9@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Dương Văn Khoa',
    studentId: 'B21DCCN009',
    createdAt: '2024-09-05',
  },
  {
    id: 'u10',
    username: 'student10',
    email: 'student10@ptit.edu.vn',
    password: 'password123',
    role: 'student',
    fullName: 'Ngô Thị Lan',
    studentId: 'B21DCCN010',
    createdAt: '2024-09-05',
  },
  {
    id: 'admin1',
    username: 'admin',
    email: 'admin@ptit.edu.vn',
    password: 'admin123',
    role: 'admin',
    fullName: 'Admin PTIT',
    createdAt: '2024-01-01',
  },
];

const generateAnswers = (exam: Exam, correctRatio: number): (number | null)[] => {
  return exam.questions.map((q) => {
    if (Math.random() < correctRatio) return q.correctAnswer;
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.correctAnswer);
    return wrong[Math.floor(Math.random() * wrong.length)];
  });
};

const makeResult = (
  id: string,
  examId: string,
  userId: string,
  correctRatio: number,
  daysAgo: number
): ExamResult => {
  const exam = MOCK_EXAMS.find((e) => e.id === examId)!;
  const answers = generateAnswers(exam, correctRatio);
  const correct = answers.filter((a, i) => a === exam.questions[i].correctAnswer).length;
  const score = Math.round((correct / exam.questions.length) * 10 * 10) / 10;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    examId,
    userId,
    answers,
    score,
    totalQuestions: exam.questions.length,
    correctAnswers: correct,
    completedAt: date.toISOString(),
    timeSpent: Math.floor(Math.random() * (exam.duration * 60 * 0.8) + exam.duration * 60 * 0.2),
    status: 'completed',
  };
};

export const MOCK_RESULTS: ExamResult[] = [
  // Exam 1
  makeResult('r1', 'exam1', 'u1', 0.8, 30),
  makeResult('r2', 'exam1', 'u2', 0.7, 28),
  makeResult('r3', 'exam1', 'u3', 0.9, 25),
  makeResult('r4', 'exam1', 'u4', 0.6, 20),
  makeResult('r5', 'exam1', 'u5', 0.5, 15),
  makeResult('r6', 'exam1', 'u6', 1.0, 10),
  makeResult('r7', 'exam1', 'u7', 0.7, 5),
  // Exam 2
  makeResult('r8', 'exam2', 'u1', 0.7, 14),
  makeResult('r9', 'exam2', 'u2', 0.6, 14),
  makeResult('r10', 'exam2', 'u3', 0.8, 14),
  makeResult('r11', 'exam2', 'u4', 0.5, 14),
  makeResult('r12', 'exam2', 'u5', 0.9, 14),
  // Exam 3
  makeResult('r13', 'exam3', 'u1', 0.6, 7),
  makeResult('r14', 'exam3', 'u3', 0.75, 7),
  makeResult('r15', 'exam3', 'u6', 0.55, 7),
  // Exam 4
  makeResult('r16', 'exam4', 'u2', 0.9, 20),
  makeResult('r17', 'exam4', 'u4', 0.8, 18),
  makeResult('r18', 'exam4', 'u7', 0.7, 15),
  makeResult('r19', 'exam4', 'u8', 0.85, 12),
  makeResult('r20', 'exam4', 'u9', 0.6, 10),
  makeResult('r21', 'exam4', 'u10', 0.95, 8),
  // Exam 5
  makeResult('r22', 'exam5', 'u1', 0.8, 5),
  makeResult('r23', 'exam5', 'u5', 0.65, 5),
  makeResult('r24', 'exam5', 'u8', 0.75, 5),
  makeResult('r25', 'exam5', 'u9', 0.9, 5),
  // Exam 6
  makeResult('r26', 'exam6', 'u2', 0.85, 3),
  makeResult('r27', 'exam6', 'u3', 0.7, 3),
  makeResult('r28', 'exam6', 'u10', 0.6, 3),
];

export const MONTHLY_STATS = [
  { month: 'Sep', participants: 42, completionRate: 88 },
  { month: 'Oct', participants: 78, completionRate: 91 },
  { month: 'Nov', participants: 95, completionRate: 87 },
  { month: 'Dec', participants: 110, completionRate: 85 },
  { month: 'Jan', participants: 88, completionRate: 90 },
  { month: 'Feb', participants: 124, completionRate: 93 },
  { month: 'Mar', participants: 145, completionRate: 89 },
];

export const SCORE_DISTRIBUTION = [
  { range: '0-4', count: 18, label: 'Poor' },
  { range: '4-5', count: 32, label: 'Below Average' },
  { range: '5-6', count: 65, label: 'Average' },
  { range: '6-7', count: 98, label: 'Good' },
  { range: '7-8', count: 112, label: 'Very Good' },
  { range: '8-9', count: 87, label: 'Excellent' },
  { range: '9-10', count: 54, label: 'Outstanding' },
];
