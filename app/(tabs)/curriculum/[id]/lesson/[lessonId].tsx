import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '@/contexts/ProgressContext';
import { getLessonById } from '@/services/api';
import { ChevronLeft, ChevronRight, CircleCheck as CheckCircle2, Wand as MagicWand } from 'lucide-react-native';
import type { Lesson } from '@/types';

export default function LessonScreen() {
  const { id, lessonId } = useLocalSearchParams<{ id: string; lessonId: string }>();
  const { markLessonCompleted, isLessonCompleted } = useProgress();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (id && lessonId) {
      loadLesson(parseInt(id), parseInt(lessonId));
      setCompleted(isLessonCompleted(parseInt(id), parseInt(lessonId)));
    }
  }, [id, lessonId]);

  const loadLesson = async (skillId: number, lessonNumber: number) => {
    try {
      setLoading(true);
      const lessonData = await getLessonById(skillId, lessonNumber);
      setLesson(lessonData);
    } catch (err) {
      setError('Failed to load lesson');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (id && lessonId) {
      markLessonCompleted(parseInt(id), parseInt(lessonId));
      setCompleted(true);
    }
  };

  const navigateToNextLesson = () => {
    if (id && lessonId) {
      const nextLessonId = parseInt(lessonId) + 1;
      if (nextLessonId <= 30) {
        router.push({
          pathname: '/(tabs)/curriculum/[id]/lesson/[lessonId]',
          params: { id, lessonId: nextLessonId.toString() }
        });
      } else {
        // If it's the last lesson, go back to the curriculum
        router.push({
          pathname: '/(tabs)/curriculum/[id]',
          params: { id }
        });
      }
    }
  };

  const navigateToPreviousLesson = () => {
    if (id && lessonId) {
      const prevLessonId = parseInt(lessonId) - 1;
      if (prevLessonId >= 1) {
        router.push({
          pathname: '/(tabs)/curriculum/[id]/lesson/[lessonId]',
          params: { id, lessonId: prevLessonId.toString() }
        });
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Lesson not found'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: `Day ${lessonId}`,
          headerBackTitle: 'Back',
          headerTintColor: '#4F46E5',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objective</Text>
            <Text style={styles.sectionText}>{lesson.objective}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explanation</Text>
            <Text style={styles.sectionText}>{lesson.explanation}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task</Text>
            <Text style={styles.sectionText}>{lesson.task}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pro Tip</Text>
            <Text style={styles.sectionText}>{lesson.tip}</Text>
          </View>

          {/* AI Feedback section (placeholder) */}
          <TouchableOpacity style={styles.aiFeedbackButton}>
            <MagicWand size={20} color="#4F46E5" />
            <Text style={styles.aiButtonText}>Get AI Feedback on Your Task</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.navigationBar}>
          <TouchableOpacity 
            style={[styles.navButton, parseInt(lessonId) === 1 && styles.disabledButton]}
            onPress={navigateToPreviousLesson}
            disabled={parseInt(lessonId) === 1}
          >
            <ChevronLeft 
              size={20} 
              color={parseInt(lessonId) === 1 ? '#D1D5DB' : '#4F46E5'} 
            />
            <Text 
              style={[
                styles.navButtonText, 
                parseInt(lessonId) === 1 && styles.disabledButtonText
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {completed ? (
            <View style={styles.completedButton}>
              <CheckCircle2 size={20} color="#FFFFFF" />
              <Text style={styles.completedButtonText}>Completed</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.navButton, parseInt(lessonId) === 30 && styles.disabledButton]}
            onPress={navigateToNextLesson}
            disabled={parseInt(lessonId) === 30}
          >
            <Text 
              style={[
                styles.navButtonText, 
                parseInt(lessonId) === 30 && styles.disabledButtonText
              ]}
            >
              Next
            </Text>
            <ChevronRight 
              size={20} 
              color={parseInt(lessonId) === 30 ? '#D1D5DB' : '#4F46E5'} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  lessonTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 12,
  },
  sectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  aiFeedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#E0E0FF',
  },
  aiButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4F46E5',
    marginLeft: 8,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4F46E5',
  },
  disabledButtonText: {
    color: '#D1D5DB',
  },
  completeButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  completedButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
});