// User types
export type User = {
  id: number;
  name: string;
  email: string;
};

// Skill types
export type Skill = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  tags: string[];
};

export type EnrolledSkill = Skill;

// Lesson types
export type Lesson = {
  id: number;
  skillId: number;
  title: string;
  objective: string;
  explanation: string;
  task: string;
  tip: string;
};

// Progress types
export type LessonProgress = {
  completedAt: string;
};

export type SkillProgress = {
  [lessonId: number]: LessonProgress;
};

export type Progress = {
  [skillId: number]: SkillProgress;
};

// API response types
export type AuthResponse = {
  token: string;
};

// AI types for future implementation
export type AIFeedbackRequest = {
  skillId: number;
  lessonId: number;
  userAnswer: string;
};

export type AIFeedbackResponse = {
  feedback: string;
};

export type GenerateCurriculumRequest = {
  topic: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  numberOfLessons?: number;
};