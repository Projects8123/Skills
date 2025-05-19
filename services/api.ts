import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockSkills, mockLessons } from './mock-data';
import type { Skill, EnrolledSkill, Lesson } from '@/types';

// Base URL for API calls
const API_BASE_URL = 'https://api.skillsprint.example.com'; // This would be replaced with your FastAPI URL

// Authentication APIs
export const loginUser = async (email: string, password: string): Promise<{ token: string }> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // return fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // }).then(res => res.json());

  // For now, we'll simulate a successful login with a mock JWT token
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock JWT token - in a real app, this would come from the backend
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIn0sImlhdCI6MTYxOTk1MjQ3NywiZXhwIjoxNjIwMDM4ODc3fQ.HS7XmDrRUXFSW7ZzeYdG_XeBVIRz0tJQpuGYOsIJ6Wc';
      resolve({ token });
    }, 1000);
  });
};

export const registerUser = async (name: string, email: string, password: string): Promise<{ token: string }> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // return fetch(`${API_BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, password }),
  // }).then(res => res.json());

  // For now, we'll simulate a successful registration with a mock JWT token
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock JWT token - in a real app, this would come from the backend
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIn0sImlhdCI6MTYxOTk1MjQ3NywiZXhwIjoxNjIwMDM4ODc3fQ.HS7XmDrRUXFSW7ZzeYdG_XeBVIRz0tJQpuGYOsIJ6Wc';
      resolve({ token });
    }, 1000);
  });
};

// Helper function to get authorization header with JWT token
const getAuthHeader = async (): Promise<Headers> => {
  const token = await AsyncStorage.getItem('token');
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  return headers;
};

// Skill APIs
export const getAllSkills = async (): Promise<Skill[]> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/skills`, { headers }).then(res => res.json());

  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSkills);
    }, 1000);
  });
};

export const getSkillById = async (id: number): Promise<Skill> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/skills/${id}`, { headers }).then(res => res.json());

  // For now, return mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const skill = mockSkills.find(s => s.id === id);
      if (skill) {
        resolve(skill);
      } else {
        reject(new Error('Skill not found'));
      }
    }, 500);
  });
};

// Lesson APIs
export const getSkillLessons = async (skillId: number): Promise<Lesson[]> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/skills/${skillId}/lessons`, { headers }).then(res => res.json());

  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLessons[skillId] || []);
    }, 800);
  });
};

export const getLessonById = async (skillId: number, lessonId: number): Promise<Lesson> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/skills/${skillId}/lessons/${lessonId}`, { headers }).then(res => res.json());

  // For now, return mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const lessons = mockLessons[skillId];
      if (lessons) {
        const lesson = lessons.find(l => l.id === lessonId);
        if (lesson) {
          resolve(lesson);
        } else {
          reject(new Error('Lesson not found'));
        }
      } else {
        reject(new Error('Skill has no lessons'));
      }
    }, 500);
  });
};

// User enrollment APIs
export const getUserEnrolledSkills = async (): Promise<EnrolledSkill[]> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/user/skills`, { headers }).then(res => res.json());

  // For now, return mock data - assume user is enrolled in Python and Piano
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        mockSkills[0], // Python
        mockSkills[1], // Piano
      ]);
    }, 800);
  });
};

export const enrollInSkill = async (skillId: number): Promise<void> => {
  // In a real app, this would be a fetch call to your FastAPI backend
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/user/skills/${skillId}/enroll`, {
  //   method: 'POST',
  //   headers,
  // }).then(res => {
  //   if (!res.ok) throw new Error('Failed to enroll in skill');
  // });

  // For now, simulate a successful enrollment
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
};

// AI integration placeholder endpoints
export const generateCurriculum = async (topic: string): Promise<void> => {
  // This would connect to your FastAPI backend, which would then call the OpenAI API
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/ai/generate-curriculum`, {
  //   method: 'POST',
  //   headers,
  //   body: JSON.stringify({ topic }),
  // }).then(res => res.json());

  // For now, simulate an API call without actually doing anything
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};

export const getAIFeedback = async (skillId: number, lessonId: number, userAnswer: string): Promise<string> => {
  // This would connect to your FastAPI backend, which would then call the OpenAI API
  // const headers = await getAuthHeader();
  // return fetch(`${API_BASE_URL}/ai/feedback`, {
  //   method: 'POST',
  //   headers,
  //   body: JSON.stringify({ skillId, lessonId, userAnswer }),
  // }).then(res => res.json()).then(data => data.feedback);

  // For now, return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Great work! You've made good progress. Try focusing on [specific aspect] next time.");
    }, 1000);
  });
};