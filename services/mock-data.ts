import type { Skill, Lesson } from '@/types';

// Mock skills data
export const mockSkills: Skill[] = [
  {
    id: 1,
    title: 'Python Fundamentals',
    description: 'Learn the basics of Python programming with practical examples and exercises.',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    level: 'Beginner',
    duration: 30,
    tags: ['Programming', 'Python', 'Computer Science'],
  },
  {
    id: 2,
    title: 'Piano Basics',
    description: 'Master the fundamentals of piano playing from notes to simple melodies.',
    imageUrl: 'https://images.pexels.com/photos/45718/pexels-photo-45718.jpeg',
    level: 'Beginner',
    duration: 30,
    tags: ['Music', 'Piano', 'Instrument'],
  },
  {
    id: 3,
    title: 'PyTorch for AI',
    description: 'Build neural networks and machine learning models with PyTorch.',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    level: 'Intermediate',
    duration: 30,
    tags: ['AI', 'Machine Learning', 'PyTorch', 'Programming'],
  }
];

// Mock lessons data - 30 lessons for each skill
// We'll generate structured mock data for the first few lessons of each skill
export const mockLessons: { [key: number]: Lesson[] } = {
  // Python Fundamentals Lessons
  1: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    
    if (day === 1) {
      return {
        id: day,
        skillId: 1,
        title: 'Getting Started with Python',
        objective: 'Set up Python and run your first program',
        explanation: 'Python is a high-level, interpreted programming language known for its readability and simplicity. Today we\'ll install Python and write our first "Hello, World!" program.',
        task: 'Install Python on your computer and create a simple script that prints "Hello, World!" to the console.',
        tip: 'Use a code editor like VSCode or PyCharm to make writing Python code easier.',
      };
    } else if (day === 2) {
      return {
        id: day,
        skillId: 1,
        title: 'Variables and Data Types',
        objective: 'Learn how to create variables and understand basic data types',
        explanation: 'Variables are used to store data in a program. Python has several built-in data types including strings, integers, floats, and booleans.',
        task: 'Create variables for each basic data type and print them out with descriptions.',
        tip: 'Remember that Python is dynamically typed, so the type is determined by the value assigned.',
      };
    } else if (day === 3) {
      return {
        id: day,
        skillId: 1,
        title: 'Lists and Basic Operations',
        objective: 'Understand how to create and manipulate lists',
        explanation: 'Lists are ordered, mutable collections that can store different types of data. They\'re one of Python\'s most versatile data structures.',
        task: 'Create a shopping list and perform basic operations like adding items, removing items, and sorting the list.',
        tip: 'Use methods like append(), remove(), and sort() to manipulate lists efficiently.',
      };
    } else {
      return {
        id: day,
        skillId: 1,
        title: `Python Lesson ${day}`,
        objective: `Learn Python concept #${day}`,
        explanation: `This is the explanation for Python lesson ${day}. It covers important concepts that build on previous lessons.`,
        task: `Complete a coding exercise that demonstrates your understanding of today's Python concept.`,
        tip: `Remember to test your code frequently as you write it to catch errors early.`,
      };
    }
  }),
  
  // Piano Basics Lessons
  2: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    
    if (day === 1) {
      return {
        id: day,
        skillId: 2,
        title: 'Introduction to the Piano',
        objective: 'Familiarize yourself with the piano keyboard and proper posture',
        explanation: 'The piano is a versatile instrument with 88 keys. Today we\'ll learn about the layout of white and black keys, and how to sit properly at the piano.',
        task: 'Identify the notes on the piano keyboard and practice sitting with proper posture and hand position.',
        tip: 'Your wrists should be level with your hands, not drooping down or raised too high.',
      };
    } else if (day === 2) {
      return {
        id: day,
        skillId: 2,
        title: 'Playing Your First Notes',
        objective: 'Learn to play C, D, and E with your right hand',
        explanation: 'We\'ll focus on the notes C, D, and E, which are three consecutive white keys. The C note is located just to the left of a group of two black keys.',
        task: 'Practice playing C, D, and E individually, then in sequence, focusing on even pressure and clean sound.',
        tip: 'Use the tips of your fingers to press the keys, keeping your fingers curved as if holding a small ball.',
      };
    } else if (day === 3) {
      return {
        id: day,
        skillId: 2,
        title: 'Reading Basic Sheet Music',
        objective: 'Understand how notes are represented on the musical staff',
        explanation: 'Sheet music uses a five-line staff to represent notes. The position of a note on the staff indicates its pitch, while its shape indicates its duration.',
        task: 'Practice identifying notes on the treble clef and play a simple melody using C, D, and E.',
        tip: 'Remember the notes on the lines spell FACE, while the notes in the spaces are E, G, B, D, F (Every Good Boy Does Fine).',
      };
    } else {
      return {
        id: day,
        skillId: 2,
        title: `Piano Lesson ${day}`,
        objective: `Master piano technique #${day}`,
        explanation: `This lesson covers important piano concepts that build on your previous practice sessions.`,
        task: `Practice playing the exercise provided, focusing on rhythm and finger placement.`,
        tip: `Regular, focused practice for even 5 minutes daily is better than occasional long sessions.`,
      };
    }
  }),
  
  // PyTorch for AI Lessons
  3: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    
    if (day === 1) {
      return {
        id: day,
        skillId: 3,
        title: 'Introduction to PyTorch',
        objective: 'Understand what PyTorch is and set up your environment',
        explanation: 'PyTorch is an open-source machine learning library developed by Facebook\'s AI Research lab. It\'s known for its flexibility and dynamic computational graph.',
        task: 'Install PyTorch and its dependencies, and create a simple tensor to verify your installation.',
        tip: 'Make sure to install the correct version of PyTorch for your CUDA version if you\'re using a GPU.',
      };
    } else if (day === 2) {
      return {
        id: day,
        skillId: 3,
        title: 'Working with Tensors',
        objective: 'Learn how to create and manipulate tensors in PyTorch',
        explanation: 'Tensors are multi-dimensional arrays similar to NumPy\'s ndarrays, but with the ability to perform operations on GPUs. They form the foundation of PyTorch.',
        task: 'Create tensors of different dimensions, perform basic operations, and practice converting between tensors and NumPy arrays.',
        tip: 'Remember that tensor operations that modify a tensor in-place usually have an underscore suffix (e.g., add_()).',
      };
    } else if (day === 3) {
      return {
        id: day,
        skillId: 3,
        title: 'Automatic Differentiation with Autograd',
        objective: 'Understand PyTorch\'s automatic differentiation system',
        explanation: 'Autograd is PyTorch\'s automatic differentiation engine that powers neural network training. It allows you to compute gradients automatically.',
        task: 'Create a simple computation graph using tensors that require gradients, then compute derivatives with respect to input variables.',
        tip: 'Use the requires_grad=True parameter when creating tensors that you\'ll need gradients for.',
      };
    } else {
      return {
        id: day,
        skillId: 3,
        title: `PyTorch Lesson ${day}`,
        objective: `Master PyTorch concept #${day}`,
        explanation: `This lesson focuses on advanced PyTorch techniques and builds upon previous concepts.`,
        task: `Implement a machine learning algorithm using the PyTorch features learned in this lesson.`,
        tip: `When debugging PyTorch code, print the shape of your tensors at each step to catch dimension mismatches early.`,
      };
    }
  }),
};