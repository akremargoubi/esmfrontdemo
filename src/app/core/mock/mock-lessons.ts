export interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  content: string;
  quiz?: LessonQuiz;
}

export interface LessonQuiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export const MOCK_LESSONS: Record<number, Lesson[]> = {
  1: [
    {
      id: 101, title: 'Introduction to Business Communication', duration: '1:15',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Learn the fundamentals of professional business communication including tone, clarity, and audience awareness.',
      quiz: {
        questions: [
          { id: 1, text: 'What is the most important factor in business communication?', options: ['Length', 'Clarity', 'Complex words', 'Speed'], correctIndex: 1 },
          { id: 2, text: 'Which of these is a formal greeting?', options: ['Hey', 'Dear Sir/Madam', 'What\'s up', 'Yo'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 102, title: 'Email Etiquette and Formal Tone', duration: '1:30',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Master the art of writing professional emails with proper structure, tone, and etiquette.',
    },
    {
      id: 103, title: 'Negotiation Vocabulary and Phrases', duration: '1:20',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Essential vocabulary and phrases for successful negotiations in English.',
      quiz: {
        questions: [
          { id: 3, text: 'What does "to meet halfway" mean?', options: ['To cancel', 'To compromise', 'To argue', 'To withdraw'], correctIndex: 1 },
          { id: 4, text: '\"We are open to discussing this further\" is an example of:', options: ['Aggression', 'Flexibility', 'Closure', 'Rejection'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 104, title: 'Practical Writing Exercises', duration: '1:30',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Apply what you have learned with hands-on writing exercises covering real business scenarios.',
    },
  ],
  2: [
    {
      id: 201, title: 'IELTS Reading Strategies', duration: '2:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Effective strategies to tackle IELTS reading passages including skimming, scanning, and time management.',
      quiz: {
        questions: [
          { id: 5, text: 'What is skimming?', options: ['Reading every word', 'Reading for general idea', 'Checking spelling', 'Counting words'], correctIndex: 1 },
          { id: 6, text: 'How much time is recommended per reading passage?', options: ['10 min', '20 min', '30 min', '5 min'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 202, title: 'Writing Task 1 & 2 Mastery', duration: '2:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Learn how to structure and write high-scoring IELTS Task 1 and Task 2 essays.',
      quiz: {
        questions: [
          { id: 7, text: 'How many paragraphs should Task 2 have?', options: ['2', '3', '4-5', '6+'], correctIndex: 2 },
          { id: 8, text: 'What is the minimum word count for Task 2?', options: ['150', '200', '250', '300'], correctIndex: 2 },
        ]
      }
    },
  ],
  3: [
    {
      id: 301, title: 'Everyday Vocabulary & Phrases', duration: '1:30',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Build your everyday vocabulary with commonly used phrases and expressions.',
      quiz: {
        questions: [
          { id: 9, text: 'What does "break the ice" mean?', options: ['To get angry', 'To start a conversation', 'To end a meeting', 'To fall down'], correctIndex: 1 },
          { id: 10, text: '"Piece of cake" means:', options: ['Very difficult', 'Very easy', 'Delicious', 'Expensive'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 302, title: 'Role-Play Scenarios', duration: '2:05',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Practice real-life conversations through guided role-play scenarios.',
    },
  ],
  4: [
    {
      id: 401, title: 'Grammar Foundations', duration: '1:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Solidify your understanding of English grammar fundamentals.',
      quiz: {
        questions: [
          { id: 11, text: 'Which sentence is correct?', options: ['He go to school', 'He goes to school', 'He going school', 'He gone school'], correctIndex: 1 },
          { id: 12, text: 'The past tense of "run" is:', options: ['Runed', 'Ran', 'Runned', 'Running'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 402, title: 'Sentence Structure & Clarity', duration: '0:50',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Learn to construct clear, well-structured sentences for effective writing.',
    },
    {
      id: 403, title: 'Essay Planning & Outlining', duration: '0:50',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Master the art of planning and outlining essays before writing.',
      quiz: {
        questions: [
          { id: 13, text: 'A thesis statement should appear in which paragraph?', options: ['Conclusion', 'Body', 'Introduction', 'Anywhere'], correctIndex: 2 },
          { id: 14, text: 'How many body paragraphs does a standard essay have?', options: ['1', '2-3', '5-6', '10'], correctIndex: 1 },
        ]
      }
    },
  ],
  5: [
    {
      id: 501, title: 'Opening and Closing Meetings', duration: '1:15',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Learn professional phrases and techniques for opening and closing meetings.',
      quiz: {
        questions: [
          { id: 15, text: 'Which phrase is appropriate for starting a meeting?', options: ['Let\'s call it a day', 'Shall we begin?', 'See you later', 'Good night'], correctIndex: 1 },
          { id: 16, text: '"To sum up" is used when:', options: ['Starting', 'Interrupting', 'Concluding', 'Questioning'], correctIndex: 2 },
        ]
      }
    },
    {
      id: 502, title: 'Presentation Structure', duration: '1:20',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Structure compelling presentations with clear introductions, body, and conclusions.',
    },
    {
      id: 503, title: 'Handling Q&A Sessions', duration: '1:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Techniques for confidently handling questions and answers after presentations.',
    },
    {
      id: 504, title: 'Professional Small Talk', duration: '1:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Master the art of professional small talk to build rapport and network effectively.',
      quiz: {
        questions: [
          { id: 17, text: 'Which topic is safe for professional small talk?', options: ['Salary', 'Weather', 'Politics', 'Religion'], correctIndex: 1 },
          { id: 18, text: 'What is a good icebreaker at a conference?', options: ['Silence', 'Ask about their role', 'Discuss salaries', 'Complain about work'], correctIndex: 1 },
        ]
      }
    },
  ],
  6: [
    {
      id: 601, title: 'American Vowel Sounds', duration: '1:00',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Practice the distinct vowel sounds of American English with audio examples.',
      quiz: {
        questions: [
          { id: 19, text: 'Which word has the same vowel sound as "cat"?', options: ['Bat', 'Boat', 'Bite', 'Beat'], correctIndex: 0 },
          { id: 20, text: 'The vowel in "see" is:', options: ['Short', 'Long', 'Diphthong', 'Silent'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 602, title: 'Consonant Clusters', duration: '0:45',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Master difficult consonant clusters for clearer speech.',
    },
    {
      id: 603, title: 'Word Stress & Rhythm', duration: '0:55',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Understand word stress patterns and sentence rhythm in American English.',
      quiz: {
        questions: [
          { id: 21, text: 'Which syllable is stressed in "record" (noun)?', options: ['First', 'Second', 'Both', 'Neither'], correctIndex: 0 },
          { id: 22, text: 'Content words are typically:', options: ['Unstressed', 'Stressed', 'Silent', 'Removed'], correctIndex: 1 },
        ]
      }
    },
    {
      id: 604, title: 'Intonation Patterns', duration: '0:55',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'Learn rising and falling intonation patterns for natural-sounding speech.',
    },
  ],
};
