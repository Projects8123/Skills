import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define progress types
type LessonProgress = {
  completedAt: string;
};

type SkillProgress = {
  [lessonId: number]: LessonProgress;
};

type Progress = {
  [skillId: number]: SkillProgress;
};

type ProgressContextType = {
  progress: Progress;
  markLessonCompleted: (skillId: number, lessonId: number) => void;
  isLessonCompleted: (skillId: number, lessonId: number) => boolean;
  resetProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

type ProgressProviderProps = {
  children: ReactNode;
};

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [progress, setProgress] = useState<Progress>({});

  // Load progress from AsyncStorage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('progress');
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, []);

  // Save progress to AsyncStorage whenever it changes
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem('progress', JSON.stringify(progress));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    saveProgress();
  }, [progress]);

  const markLessonCompleted = (skillId: number, lessonId: number) => {
    setProgress(prevProgress => {
      // Create a copy of the previous progress
      const newProgress = { ...prevProgress };
      
      // If skill doesn't exist in progress, initialize it
      if (!newProgress[skillId]) {
        newProgress[skillId] = {};
      }
      
      // Mark lesson as completed with current timestamp
      newProgress[skillId][lessonId] = {
        completedAt: new Date().toISOString()
      };
      
      return newProgress;
    });
  };

  const isLessonCompleted = (skillId: number, lessonId: number): boolean => {
    if (!progress[skillId]) return false;
    return !!progress[skillId][lessonId];
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('progress');
      setProgress({});
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  };

  return (
    <ProgressContext.Provider value={{ progress, markLessonCompleted, isLessonCompleted, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};