// Central mock data store — replaces all backend API dependencies

export const MOCK_CREDENTIALS: Record<string, { id: string; role: string; firstName: string; lastName: string; emailVerified: boolean; status: string }> = {
  'admin@fluencity.com':   { id: '1', role: 'ADMIN',   firstName: 'Ahmed',  lastName: 'Dridi',    emailVerified: true, status: 'ACTIVE' },
  'tutor@fluencity.com':   { id: '2', role: 'TUTOR',   firstName: 'Sonia',  lastName: 'Ben Ali',  emailVerified: true, status: 'ACTIVE' },
  'student@fluencity.com': { id: '3', role: 'STUDENT', firstName: 'Karim',  lastName: 'Mansouri', emailVerified: true, status: 'ACTIVE' },
  'parent@fluencity.com':  { id: '4', role: 'PARENT',  firstName: 'Fatma',  lastName: 'Mansouri', emailVerified: true, status: 'ACTIVE' },
  // Legacy test credentials kept for backward compatibility
  'admin@test.com':        { id: '1', role: 'ADMIN',   firstName: 'Ahmed',  lastName: 'Dridi',    emailVerified: true, status: 'ACTIVE' },
  'student@test.com':      { id: '3', role: 'STUDENT', firstName: 'Karim',  lastName: 'Mansouri', emailVerified: true, status: 'ACTIVE' },
  'parent@test.com':       { id: '4', role: 'PARENT',  firstName: 'Fatma',  lastName: 'Mansouri', emailVerified: true, status: 'ACTIVE' },
};

export const MOCK_PASSWORD = 'demo123';
// Accept these passwords for demo
export const ACCEPTED_PASSWORDS = new Set(['demo123', 'admin123', 'student123', 'parent123', 'tutor123', 'password', 'test123']);

// ── Classes ────────────────────────────────────────────────────────────────────
export const MOCK_CLASSES = [
  { id: 1, name: 'TWIN1',  level: 'B1', specialty: 'General English',  studentCount: 18, tutorId: '2', tutorName: 'Sonia Ben Ali' },
  { id: 2, name: 'TWIN2',  level: 'B2', specialty: 'Business English', studentCount: 15, tutorId: '2', tutorName: 'Sonia Ben Ali' },
  { id: 3, name: 'IELTS3', level: 'C1', specialty: 'IELTS Prep',       studentCount: 12, tutorId: '5', tutorName: 'Omar Khelifi' },
  { id: 4, name: 'A2-KIDS',level: 'A2', specialty: 'Kids English',      studentCount: 20, tutorId: '6', tutorName: 'Leila Amri' },
  { id: 5, name: 'C1-ADV', level: 'C1', specialty: 'Advanced English',  studentCount: 9,  tutorId: '5', tutorName: 'Omar Khelifi' },
];

// ── Courses ────────────────────────────────────────────────────────────────────
export const MOCK_COURSES = [
  { courseId: 1, name: 'English for Beginners',   description: 'Start your English journey with fundamentals.',   level: 'A1', category: 'General', price: 0,    instructorId: '6', instructorName: 'Leila Amri',    ratingAvg: 4.7, ratingCount: 234, enrollmentCount: 312 },
  { courseId: 2, name: 'Business Communication',  description: 'Master professional English for the workplace.',  level: 'B2', category: 'Business',price: 120,  instructorId: '2', instructorName: 'Sonia Ben Ali',  ratingAvg: 4.9, ratingCount: 187, enrollmentCount: 198 },
  { courseId: 3, name: 'IELTS Complete Prep',     description: 'Full preparation course for IELTS Band 7+.',      level: 'C1', category: 'Exam',    price: 180,  instructorId: '5', instructorName: 'Omar Khelifi',   ratingAvg: 4.8, ratingCount: 312, enrollmentCount: 445 },
  { courseId: 4, name: 'Conversational English',  description: 'Build fluency through practical conversation.',    level: 'B1', category: 'General', price: 80,   instructorId: '2', instructorName: 'Sonia Ben Ali',  ratingAvg: 4.6, ratingCount: 156, enrollmentCount: 267 },
  { courseId: 5, name: 'Grammar Masterclass',     description: 'Deep dive into English grammar rules & usage.',   level: 'B1', category: 'General', price: 60,   instructorId: '6', instructorName: 'Leila Amri',    ratingAvg: 4.5, ratingCount: 98,  enrollmentCount: 143 },
  { courseId: 6, name: 'English for Kids (A2)',   description: 'Fun and interactive English for young learners.',  level: 'A2', category: 'Kids',    price: 0,    instructorId: '6', instructorName: 'Leila Amri',    ratingAvg: 4.9, ratingCount: 201, enrollmentCount: 389 },
  { courseId: 7, name: 'TOEFL Exam Preparation',  description: 'Targeted TOEFL practice and strategies.',         level: 'C1', category: 'Exam',    price: 160,  instructorId: '5', instructorName: 'Omar Khelifi',   ratingAvg: 4.7, ratingCount: 134, enrollmentCount: 176 },
  { courseId: 8, name: 'Academic Writing',        description: 'Essay writing, reports and academic register.',   level: 'C2', category: 'Academic',price: 100,  instructorId: '2', instructorName: 'Sonia Ben Ali',  ratingAvg: 4.6, ratingCount: 89,  enrollmentCount: 112 },
];

// ── Assessments ────────────────────────────────────────────────────────────────
const now = new Date();
const d = (offsetDays: number, hour = 10) => {
  const dt = new Date(now); dt.setDate(dt.getDate() + offsetDays); dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
};

export const MOCK_ASSESSMENTS = [
  { id: 1, title: 'Midterm Grammar Test',     courseName: 'English for Beginners',  type: 'EXAM',    status: 'PUBLISHED', className: 'TWIN1',  startDate: d(-5),  endDate: d(-5, 12), duration: 90 },
  { id: 2, title: 'Business Writing Quiz',    courseName: 'Business Communication', type: 'QUIZ',    status: 'PUBLISHED', className: 'TWIN2',  startDate: d(1),   endDate: d(1, 12),  duration: 45 },
  { id: 3, title: 'IELTS Speaking Practice',  courseName: 'IELTS Complete Prep',    type: 'PROJECT', status: 'DRAFT',     className: 'IELTS3', startDate: d(3),   endDate: d(3, 14),  duration: 60 },
  { id: 4, title: 'Vocabulary Sprint',        courseName: 'Conversational English', type: 'QUIZ',    status: 'PUBLISHED', className: 'TWIN1',  startDate: d(0, 15), endDate: d(0, 16), duration: 30 },
  { id: 5, title: 'Final Reading Assessment', courseName: 'Grammar Masterclass',    type: 'EXAM',    status: 'PUBLISHED', className: 'TWIN2',  startDate: d(7),   endDate: d(7, 14),  duration: 120 },
  { id: 6, title: 'Listening Comprehension',  courseName: 'IELTS Complete Prep',    type: 'EXAM',    status: 'CLOSED',    className: 'IELTS3', startDate: d(-14), endDate: d(-14, 12), duration: 60 },
  { id: 7, title: 'Writing Task 2 Draft',     courseName: 'Academic Writing',       type: 'PROJECT', status: 'DRAFT',     className: 'C1-ADV', startDate: d(5),   endDate: d(12),     duration: 180 },
  { id: 8, title: 'Kids Alphabet Quiz',       courseName: 'English for Kids (A2)',  type: 'QUIZ',    status: 'PUBLISHED', className: 'A2-KIDS',startDate: d(2),   endDate: d(2, 11),  duration: 20 },
];

// ── Students ───────────────────────────────────────────────────────────────────
export const MOCK_STUDENTS = [
  { id: 10, firstName: 'Karim',   lastName: 'Mansouri',  email: 'student@fluencity.com', className: 'TWIN1',  walletBalance: 250, parentId: '4' },
  { id: 11, firstName: 'Amira',   lastName: 'Chebbi',    email: 'amira.c@school.tn',     className: 'TWIN1',  walletBalance: 180, parentId: '7' },
  { id: 12, firstName: 'Youssef', lastName: 'Trabelsi',  email: 'youssef.t@school.tn',   className: 'TWIN2',  walletBalance: 320, parentId: '8' },
  { id: 13, firstName: 'Nadia',   lastName: 'Hamdi',     email: 'nadia.h@school.tn',     className: 'TWIN2',  walletBalance: 90,  parentId: '9' },
  { id: 14, firstName: 'Sami',    lastName: 'Gharbi',    email: 'sami.g@school.tn',      className: 'IELTS3', walletBalance: 410, parentId: '10' },
  { id: 15, firstName: 'Ines',    lastName: 'Bougarra',  email: 'ines.b@school.tn',      className: 'IELTS3', walletBalance: 150, parentId: '11' },
  { id: 16, firstName: 'Fares',   lastName: 'Maaloul',   email: 'fares.m@school.tn',     className: 'A2-KIDS',walletBalance: 200, parentId: '4' },
  { id: 17, firstName: 'Rania',   lastName: 'Jebali',    email: 'rania.j@school.tn',     className: 'C1-ADV', walletBalance: 560, parentId: '12' },
  { id: 18, firstName: 'Malek',   lastName: 'Oueslati',  email: 'malek.o@school.tn',     className: 'TWIN1',  walletBalance: 75,  parentId: '13' },
  { id: 19, firstName: 'Salma',   lastName: 'Ferchichi', email: 'salma.f@school.tn',     className: 'TWIN2',  walletBalance: 300, parentId: '14' },
];

// ── Grades ─────────────────────────────────────────────────────────────────────
export const MOCK_GRADES = [
  { id: 1, studentId: 10, studentName: 'Karim Mansouri',  assessmentId: 1, assessmentTitle: 'Midterm Grammar Test',    score: 78,  maxScore: 100, grade: 'B',  courseName: 'English for Beginners',  className: 'TWIN1',  submittedAt: d(-4) },
  { id: 2, studentId: 11, studentName: 'Amira Chebbi',    assessmentId: 1, assessmentTitle: 'Midterm Grammar Test',    score: 92,  maxScore: 100, grade: 'A',  courseName: 'English for Beginners',  className: 'TWIN1',  submittedAt: d(-4) },
  { id: 3, studentId: 10, studentName: 'Karim Mansouri',  assessmentId: 4, assessmentTitle: 'Vocabulary Sprint',       score: 85,  maxScore: 100, grade: 'B+', courseName: 'Conversational English', className: 'TWIN1',  submittedAt: d(-1) },
  { id: 4, studentId: 12, studentName: 'Youssef Trabelsi',assessmentId: 5, assessmentTitle: 'Final Reading Assessment',score: 71,  maxScore: 100, grade: 'C+', courseName: 'Grammar Masterclass',    className: 'TWIN2',  submittedAt: d(-3) },
  { id: 5, studentId: 14, studentName: 'Sami Gharbi',     assessmentId: 6, assessmentTitle: 'Listening Comprehension', score: 88,  maxScore: 100, grade: 'B+', courseName: 'IELTS Complete Prep',    className: 'IELTS3', submittedAt: d(-13) },
  { id: 6, studentId: 15, studentName: 'Ines Bougarra',   assessmentId: 6, assessmentTitle: 'Listening Comprehension', score: 65,  maxScore: 100, grade: 'C',  courseName: 'IELTS Complete Prep',    className: 'IELTS3', submittedAt: d(-13) },
  { id: 7, studentId: 13, studentName: 'Nadia Hamdi',     assessmentId: 5, assessmentTitle: 'Final Reading Assessment',score: 94,  maxScore: 100, grade: 'A',  courseName: 'Grammar Masterclass',    className: 'TWIN2',  submittedAt: d(-3) },
  { id: 8, studentId: 18, studentName: 'Malek Oueslati',  assessmentId: 1, assessmentTitle: 'Midterm Grammar Test',    score: 58,  maxScore: 100, grade: 'D',  courseName: 'English for Beginners',  className: 'TWIN1',  submittedAt: d(-4) },
];

// ── Attendance ─────────────────────────────────────────────────────────────────
export const MOCK_ATTENDANCE = [
  { id: 1,  studentId: 10, studentName: 'Karim Mansouri',  studentEmail: 'student@fluencity.com', courseId: 1, courseName: 'English for Beginners',  className: 'TWIN1',  date: d(-7),  status: 'PRESENT' },
  { id: 2,  studentId: 11, studentName: 'Amira Chebbi',    studentEmail: 'amira.c@school.tn',     courseId: 1, courseName: 'English for Beginners',  className: 'TWIN1',  date: d(-7),  status: 'PRESENT' },
  { id: 3,  studentId: 18, studentName: 'Malek Oueslati',  studentEmail: 'malek.o@school.tn',     courseId: 1, courseName: 'English for Beginners',  className: 'TWIN1',  date: d(-7),  status: 'ABSENT' },
  { id: 4,  studentId: 10, studentName: 'Karim Mansouri',  studentEmail: 'student@fluencity.com', courseId: 4, courseName: 'Conversational English', className: 'TWIN1',  date: d(-3),  status: 'PRESENT' },
  { id: 5,  studentId: 12, studentName: 'Youssef Trabelsi',studentEmail: 'youssef.t@school.tn',   courseId: 2, courseName: 'Business Communication', className: 'TWIN2',  date: d(-5),  status: 'LATE' },
  { id: 6,  studentId: 13, studentName: 'Nadia Hamdi',     studentEmail: 'nadia.h@school.tn',     courseId: 2, courseName: 'Business Communication', className: 'TWIN2',  date: d(-5),  status: 'PRESENT' },
  { id: 7,  studentId: 14, studentName: 'Sami Gharbi',     studentEmail: 'sami.g@school.tn',      courseId: 3, courseName: 'IELTS Complete Prep',    className: 'IELTS3', date: d(-2),  status: 'PRESENT' },
  { id: 8,  studentId: 15, studentName: 'Ines Bougarra',   studentEmail: 'ines.b@school.tn',      courseId: 3, courseName: 'IELTS Complete Prep',    className: 'IELTS3', date: d(-2),  status: 'ABSENT' },
  { id: 9,  studentId: 10, studentName: 'Karim Mansouri',  studentEmail: 'student@fluencity.com', courseId: 1, courseName: 'English for Beginners',  className: 'TWIN1',  date: d(-14), status: 'PRESENT' },
  { id: 10, studentId: 11, studentName: 'Amira Chebbi',    studentEmail: 'amira.c@school.tn',     courseId: 1, courseName: 'English for Beginners',  className: 'TWIN1',  date: d(-14), status: 'LATE' },
];

// ── Schedule ───────────────────────────────────────────────────────────────────
export const MOCK_SCHEDULE = [
  { id: 1, className: 'TWIN1',  courseId: 1, courseName: 'English for Beginners',  tutorName: 'Leila Amri',   dayOfWeek: 'Monday',    startTime: '09:00', endTime: '10:30', room: 'Room 101' },
  { id: 2, className: 'TWIN1',  courseId: 4, courseName: 'Conversational English', tutorName: 'Sonia Ben Ali',dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '15:30', room: 'Room 102' },
  { id: 3, className: 'TWIN2',  courseId: 2, courseName: 'Business Communication', tutorName: 'Sonia Ben Ali',dayOfWeek: 'Tuesday',   startTime: '10:00', endTime: '11:30', room: 'Room 201' },
  { id: 4, className: 'TWIN2',  courseId: 5, courseName: 'Grammar Masterclass',    tutorName: 'Leila Amri',   dayOfWeek: 'Thursday',  startTime: '13:00', endTime: '14:30', room: 'Room 103' },
  { id: 5, className: 'IELTS3', courseId: 3, courseName: 'IELTS Complete Prep',    tutorName: 'Omar Khelifi', dayOfWeek: 'Monday',    startTime: '11:00', endTime: '13:00', room: 'Room 301' },
  { id: 6, className: 'IELTS3', courseId: 7, courseName: 'TOEFL Exam Preparation', tutorName: 'Omar Khelifi', dayOfWeek: 'Friday',    startTime: '09:00', endTime: '11:00', room: 'Room 302' },
  { id: 7, className: 'A2-KIDS',courseId: 6, courseName: 'English for Kids (A2)',  tutorName: 'Leila Amri',   dayOfWeek: 'Saturday',  startTime: '10:00', endTime: '11:00', room: 'Room 104' },
  { id: 8, className: 'C1-ADV', courseId: 8, courseName: 'Academic Writing',       tutorName: 'Sonia Ben Ali',dayOfWeek: 'Wednesday', startTime: '16:00', endTime: '18:00', room: 'Room 202' },
];

// ── Payments ───────────────────────────────────────────────────────────────────
export const MOCK_PAYMENTS = [
  { id: 1,  studentId: 10, studentName: 'Karim Mansouri',  parentName: 'Fatma Mansouri', amount: 180, currency: 'TND', status: 'PAID',    type: 'TUITION',  description: 'TWIN1 — Monthly Tuition Jan',   date: d(-30), dueDate: d(-30) },
  { id: 2,  studentId: 16, studentName: 'Fares Maaloul',   parentName: 'Fatma Mansouri', amount: 120, currency: 'TND', status: 'PAID',    type: 'TUITION',  description: 'A2-KIDS — Monthly Tuition Jan', date: d(-30), dueDate: d(-30) },
  { id: 3,  studentId: 10, studentName: 'Karim Mansouri',  parentName: 'Fatma Mansouri', amount: 180, currency: 'TND', status: 'PENDING', type: 'TUITION',  description: 'TWIN1 — Monthly Tuition Feb',   date: null,   dueDate: d(5) },
  { id: 4,  studentId: 11, studentName: 'Amira Chebbi',    parentName: 'Hind Chebbi',    amount: 180, currency: 'TND', status: 'PAID',    type: 'TUITION',  description: 'TWIN1 — Monthly Tuition Jan',   date: d(-28), dueDate: d(-28) },
  { id: 5,  studentId: 12, studentName: 'Youssef Trabelsi',parentName: 'Riadh Trabelsi', amount: 200, currency: 'TND', status: 'OVERDUE', type: 'TUITION',  description: 'TWIN2 — Monthly Tuition Dec',   date: null,   dueDate: d(-35) },
  { id: 6,  studentId: 14, studentName: 'Sami Gharbi',     parentName: 'Hajer Gharbi',   amount: 250, currency: 'TND', status: 'PAID',    type: 'TUITION',  description: 'IELTS3 — Monthly Tuition Jan',  date: d(-25), dueDate: d(-25) },
  { id: 7,  studentId: 13, studentName: 'Nadia Hamdi',     parentName: 'Khaled Hamdi',   amount: 200, currency: 'TND', status: 'PAID',    type: 'TUITION',  description: 'TWIN2 — Monthly Tuition Jan',   date: d(-20), dueDate: d(-20) },
  { id: 8,  studentId: 17, studentName: 'Rania Jebali',    parentName: 'Sarra Jebali',   amount: 220, currency: 'TND', status: 'PENDING', type: 'TUITION',  description: 'C1-ADV — Monthly Tuition Feb',  date: null,   dueDate: d(3) },
];

// ── Enrollments ────────────────────────────────────────────────────────────────
export const MOCK_ENROLLMENTS = [
  { id: 1,  studentId: 10, studentName: 'Karim Mansouri',  courseId: 1, courseName: 'English for Beginners',  status: 'ACTIVE',   enrolledAt: d(-60), progress: 65 },
  { id: 2,  studentId: 10, studentName: 'Karim Mansouri',  courseId: 4, courseName: 'Conversational English', status: 'ACTIVE',   enrolledAt: d(-45), progress: 40 },
  { id: 3,  studentId: 11, studentName: 'Amira Chebbi',    courseId: 1, courseName: 'English for Beginners',  status: 'ACTIVE',   enrolledAt: d(-60), progress: 82 },
  { id: 4,  studentId: 12, studentName: 'Youssef Trabelsi',courseId: 2, courseName: 'Business Communication', status: 'ACTIVE',   enrolledAt: d(-50), progress: 55 },
  { id: 5,  studentId: 12, studentName: 'Youssef Trabelsi',courseId: 5, courseName: 'Grammar Masterclass',    status: 'ACTIVE',   enrolledAt: d(-30), progress: 25 },
  { id: 6,  studentId: 14, studentName: 'Sami Gharbi',     courseId: 3, courseName: 'IELTS Complete Prep',    status: 'ACTIVE',   enrolledAt: d(-90), progress: 78 },
  { id: 7,  studentId: 14, studentName: 'Sami Gharbi',     courseId: 7, courseName: 'TOEFL Exam Preparation', status: 'ACTIVE',   enrolledAt: d(-60), progress: 50 },
  { id: 8,  studentId: 16, studentName: 'Fares Maaloul',   courseId: 6, courseName: 'English for Kids (A2)',  status: 'ACTIVE',   enrolledAt: d(-30), progress: 35 },
  { id: 9,  studentId: 17, studentName: 'Rania Jebali',    courseId: 8, courseName: 'Academic Writing',       status: 'ACTIVE',   enrolledAt: d(-20), progress: 18 },
  { id: 10, studentId: 15, studentName: 'Ines Bougarra',   courseId: 3, courseName: 'IELTS Complete Prep',    status: 'ACTIVE',   enrolledAt: d(-90), progress: 60 },
];

// ── Resources ──────────────────────────────────────────────────────────────────
export const MOCK_RESOURCES = [
  { id: 1, title: 'Grammar Rules PDF',           assessmentId: 1, type: 'PDF',   url: '#', uploadedAt: d(-10), size: '2.4 MB' },
  { id: 2, title: 'Business Vocabulary List',    assessmentId: 2, type: 'PDF',   url: '#', uploadedAt: d(-8),  size: '1.1 MB' },
  { id: 3, title: 'IELTS Speaking Samples',      assessmentId: 3, type: 'VIDEO', url: '#', uploadedAt: d(-6),  size: '48 MB' },
  { id: 4, title: 'Vocabulary Flash Cards',      assessmentId: 4, type: 'PDF',   url: '#', uploadedAt: d(-5),  size: '800 KB' },
  { id: 5, title: 'Reading Strategies Guide',    assessmentId: 5, type: 'PDF',   url: '#', uploadedAt: d(-4),  size: '3.2 MB' },
  { id: 6, title: 'Listening Exercise Audio',    assessmentId: 6, type: 'AUDIO', url: '#', uploadedAt: d(-15), size: '12 MB' },
  { id: 7, title: 'Academic Writing Templates',  assessmentId: 7, type: 'DOCX',  url: '#', uploadedAt: d(-3),  size: '456 KB' },
  { id: 8, title: 'Kids Activity Worksheets',    assessmentId: 8, type: 'PDF',   url: '#', uploadedAt: d(-2),  size: '1.8 MB' },
];

// ── Certificates ───────────────────────────────────────────────────────────────
export const MOCK_CERTIFICATES = [
  { id: 1, studentId: 10, studentName: 'Karim Mansouri', courseName: 'English for Beginners', level: 'B1', issuedAt: d(-30), grade: 'B+', certificateNumber: 'ESM-2024-0341' },
  { id: 2, studentId: 14, studentName: 'Sami Gharbi',    courseName: 'IELTS Complete Prep',   level: 'C1', issuedAt: d(-60), grade: 'A',  certificateNumber: 'ESM-2024-0298' },
  { id: 3, studentId: 11, studentName: 'Amira Chebbi',   courseName: 'English for Beginners', level: 'B1', issuedAt: d(-25), grade: 'A',  certificateNumber: 'ESM-2024-0355' },
];

// ── Users (admin list) ─────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: '1',  email: 'admin@fluencity.com',   firstName: 'Ahmed',   lastName: 'Dridi',    role: 'ADMIN',   status: 'ACTIVE',   phone: '+216 71 234 567', joinedAt: d(-365) },
  { id: '2',  email: 'tutor@fluencity.com',   firstName: 'Sonia',   lastName: 'Ben Ali',  role: 'TUTOR',   status: 'ACTIVE',   phone: '+216 99 876 543', joinedAt: d(-300) },
  { id: '3',  email: 'student@fluencity.com', firstName: 'Karim',   lastName: 'Mansouri', role: 'STUDENT', status: 'ACTIVE',   phone: '+216 55 111 222', joinedAt: d(-120) },
  { id: '4',  email: 'parent@fluencity.com',  firstName: 'Fatma',   lastName: 'Mansouri', role: 'PARENT',  status: 'ACTIVE',   phone: '+216 55 111 333', joinedAt: d(-120) },
  { id: '5',  email: 'omar.k@fluencity.com',  firstName: 'Omar',    lastName: 'Khelifi',  role: 'TUTOR',   status: 'ACTIVE',   phone: '+216 22 345 678', joinedAt: d(-250) },
  { id: '6',  email: 'leila.a@fluencity.com', firstName: 'Leila',   lastName: 'Amri',     role: 'TUTOR',   status: 'ACTIVE',   phone: '+216 50 456 789', joinedAt: d(-280) },
  { id: '7',  email: 'hind.c@school.tn',      firstName: 'Hind',    lastName: 'Chebbi',   role: 'PARENT',  status: 'ACTIVE',   phone: '+216 71 234 100', joinedAt: d(-90) },
  { id: '8',  email: 'riadh.t@school.tn',     firstName: 'Riadh',   lastName: 'Trabelsi', role: 'PARENT',  status: 'SUSPENDED',phone: '+216 98 765 432', joinedAt: d(-80) },
  { id: '10', email: 'sami.g@school.tn',      firstName: 'Sami',    lastName: 'Gharbi',   role: 'STUDENT', status: 'ACTIVE',   phone: '+216 54 321 098', joinedAt: d(-150) },
  { id: '11', email: 'ines.b@school.tn',      firstName: 'Ines',    lastName: 'Bougarra', role: 'STUDENT', status: 'ACTIVE',   phone: '+216 97 654 321', joinedAt: d(-150) },
];

// ── Parents with children ──────────────────────────────────────────────────────
export const MOCK_PARENT_CHILDREN: Record<string, any[]> = {
  '4': [
    { id: 10, firstName: 'Karim',  lastName: 'Mansouri', className: 'TWIN1',   walletBalance: 250, email: 'student@fluencity.com' },
    { id: 16, firstName: 'Fares',  lastName: 'Maaloul',  className: 'A2-KIDS', walletBalance: 200, email: 'fares.m@school.tn' },
  ],
};

// ── Planning / Calendar ────────────────────────────────────────────────────────
export const MOCK_PLANNING = [
  { id: 1, title: 'Midterm Exam Week',     startDate: d(-5),  endDate: d(-3),  type: 'EXAM',      className: 'TWIN1,TWIN2', description: 'Written exams for all B-level classes' },
  { id: 2, title: 'Business Seminar',      startDate: d(2),   endDate: d(2),   type: 'EVENT',     className: 'TWIN2',       description: 'Guest speaker: Business English in Practice' },
  { id: 3, title: 'IELTS Mock Test Day',   startDate: d(5),   endDate: d(5),   type: 'EXAM',      className: 'IELTS3',      description: 'Full mock IELTS under exam conditions' },
  { id: 4, title: 'Parents Information Evening', startDate: d(7), endDate: d(7), type: 'EVENT', className: 'ALL',         description: 'Q1 progress reports and parent meetings' },
  { id: 5, title: 'School Closed — Public Holiday', startDate: d(10), endDate: d(10), type: 'HOLIDAY', className: 'ALL', description: 'No classes' },
  { id: 6, title: 'Grammar Workshop',      startDate: d(14),  endDate: d(14),  type: 'WORKSHOP',  className: 'TWIN1',       description: 'Extra session: complex tenses' },
];

// ── ML / Analytics mock data ───────────────────────────────────────────────────
export const MOCK_ML = {
  dso1Summary: {
    totalStudents: 74, criticalCount: 8, highCount: 15, moderateCount: 21, lowCount: 30,
    overallDropoutRate: 0.108, retentionRate: 0.892
  },
  dso1WeeklyTrend: Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    dropoutRate: +(0.06 + Math.sin(i * 0.8) * 0.04 + Math.random() * 0.02).toFixed(3)
  })),
  dso1Students: [
    { id: 18, name: 'Malek Oueslati',   level: 'B1', absenceRate: 0.42, predictedDropout: 0.87, riskLevel: 'CRITICAL', className: 'TWIN1' },
    { id: 15, name: 'Ines Bougarra',    level: 'C1', absenceRate: 0.35, predictedDropout: 0.72, riskLevel: 'HIGH',     className: 'IELTS3' },
    { id: 12, name: 'Youssef Trabelsi', level: 'B2', absenceRate: 0.28, predictedDropout: 0.61, riskLevel: 'HIGH',     className: 'TWIN2' },
    { id: 13, name: 'Nadia Hamdi',      level: 'B2', absenceRate: 0.15, predictedDropout: 0.38, riskLevel: 'MODERATE', className: 'TWIN2' },
    { id: 10, name: 'Karim Mansouri',   level: 'B1', absenceRate: 0.08, predictedDropout: 0.14, riskLevel: 'LOW',      className: 'TWIN1' },
    { id: 11, name: 'Amira Chebbi',     level: 'B1', absenceRate: 0.05, predictedDropout: 0.09, riskLevel: 'LOW',      className: 'TWIN1' },
    { id: 14, name: 'Sami Gharbi',      level: 'C1', absenceRate: 0.06, predictedDropout: 0.11, riskLevel: 'LOW',      className: 'IELTS3' },
    { id: 17, name: 'Rania Jebali',     level: 'C1', absenceRate: 0.12, predictedDropout: 0.22, riskLevel: 'MODERATE', className: 'C1-ADV' },
  ],
  dso2Summary: { avgGrade: 76.4, improving: 28, stable: 31, declining: 15 },
  dso2Students: [
    { id: 11, name: 'Amira Chebbi',     level: 'B1', currentGrade: 92, predictedGrade: 94, trend: 'improving', status: 'IMPROVING', className: 'TWIN1', confidence: 0.91 },
    { id: 10, name: 'Karim Mansouri',   level: 'B1', currentGrade: 78, predictedGrade: 81, trend: 'improving', status: 'IMPROVING', className: 'TWIN1', confidence: 0.85 },
    { id: 13, name: 'Nadia Hamdi',      level: 'B2', currentGrade: 94, predictedGrade: 93, trend: 'stable',    status: 'STABLE',    className: 'TWIN2', confidence: 0.92 },
    { id: 14, name: 'Sami Gharbi',      level: 'C1', currentGrade: 88, predictedGrade: 86, trend: 'declining', status: 'DECLINING', className: 'IELTS3',confidence: 0.78 },
    { id: 12, name: 'Youssef Trabelsi', level: 'B2', currentGrade: 71, predictedGrade: 66, trend: 'declining', status: 'DECLINING', className: 'TWIN2', confidence: 0.82 },
    { id: 15, name: 'Ines Bougarra',    level: 'C1', currentGrade: 65, predictedGrade: 60, trend: 'declining', status: 'DECLINING', className: 'IELTS3',confidence: 0.75 },
    { id: 17, name: 'Rania Jebali',     level: 'C1', currentGrade: 79, predictedGrade: 82, trend: 'improving', status: 'IMPROVING', className: 'C1-ADV',confidence: 0.88 },
    { id: 18, name: 'Malek Oueslati',   level: 'B1', currentGrade: 58, predictedGrade: 52, trend: 'declining', status: 'DECLINING', className: 'TWIN1', confidence: 0.80 },
  ],
  dso3Clusters: [
    { id: 0, label: 'High Performers',  count: 22, percentage: 29.7, avgGrade: 89, avgAbsence: 0.05, paymentDelay: 3,  dropoutRate: 0.04, color: '#22c55e' },
    { id: 1, label: 'Average Students', count: 30, percentage: 40.5, avgGrade: 74, avgAbsence: 0.12, paymentDelay: 8,  dropoutRate: 0.10, color: '#3b82f6' },
    { id: 2, label: 'At-Risk Group',    count: 14, percentage: 18.9, avgGrade: 61, avgAbsence: 0.28, paymentDelay: 22, dropoutRate: 0.35, color: '#f59e0b' },
    { id: 3, label: 'Critical Cases',  count: 8,  percentage: 10.8, avgGrade: 48, avgAbsence: 0.45, paymentDelay: 45, dropoutRate: 0.72, color: '#ef4444' },
  ],
  dso4Summary: {
    highRiskCount: 12, totalOverdue: 4850, sixtyPlusDays: 5, collectionRate: 0.84
  },
  dso4Students: [
    { id: 12, name: 'Youssef Trabelsi', level: 'B2', riskScore: 0.88, riskLevel: 'HIGH',     overdueAmount: 400, delayDays: 65, className: 'TWIN2' },
    { id: 18, name: 'Malek Oueslati',   level: 'B1', riskScore: 0.76, riskLevel: 'HIGH',     overdueAmount: 360, delayDays: 42, className: 'TWIN1' },
    { id: 8,  name: 'Rania Jebali',     level: 'C1', riskScore: 0.54, riskLevel: 'MODERATE', overdueAmount: 220, delayDays: 18, className: 'C1-ADV' },
    { id: 10, name: 'Karim Mansouri',   level: 'B1', riskScore: 0.22, riskLevel: 'LOW',      overdueAmount: 0,   delayDays: 0,  className: 'TWIN1' },
    { id: 14, name: 'Sami Gharbi',      level: 'C1', riskScore: 0.18, riskLevel: 'LOW',      overdueAmount: 0,   delayDays: 0,  className: 'IELTS3' },
  ],
};

// ── Activity feed ──────────────────────────────────────────────────────────────
export const MOCK_ACTIVITY = [
  { icon: 'assignment_turned_in', message: 'Business Writing Quiz published for TWIN2',       time: d(-1),   type: 'assessment' },
  { icon: 'person_add',           message: 'New student Rania Jebali enrolled in C1-ADV',     time: d(-1, 14), type: 'enrollment' },
  { icon: 'payments',             message: 'Payment received: 250 TND from Hajer Gharbi',     time: d(-2),   type: 'payment' },
  { icon: 'event_available',      message: 'Attendance recorded for TWIN1 — 16/18 present',   time: d(-3),   type: 'attendance' },
  { icon: 'upload_file',          message: 'Reading Strategies Guide uploaded by Leila Amri', time: d(-3, 15), type: 'resource' },
  { icon: 'grade',                message: 'Grades published for Midterm Grammar Test',        time: d(-4),   type: 'grade' },
  { icon: 'warning',              message: 'Overdue payment alert: Youssef Trabelsi (65 days)', time: d(-5), type: 'alert' },
  { icon: 'school',               message: 'New class C1-ADV created with 9 students',         time: d(-7),   type: 'class' },
];
