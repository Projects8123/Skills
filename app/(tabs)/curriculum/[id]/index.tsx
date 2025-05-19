import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '@/contexts/ProgressContext';
import { getSkillById, getSkillLessons } from '@/services/api';
import { ChevronLeft, Book, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import type { Skill, Lesson } from '@/types';

export default function SkillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress } = useProgress();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSkillAndLessons(parseInt(id));
    }
  }, [id]);

  const loadSkillAndLessons = async (skillId: number) => {
    try {
      setLoading(true);
      const skillData = await getSkillById(skillId);
      const lessonsData = await getSkillLessons(skillId);
      
      setSkill(skillData);
      setLessons(lessonsData);
    } catch (err) {
      setError('Failed to load skill details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (lessonId: number): boolean => {
    if (!id) return false;
    const skillProgress = progress[parseInt(id)];
    return skillProgress ? !!skillProgress[lessonId] : false;
  };

  const renderLessonItem = ({ item }: { item: Lesson }) => {
    const completed = isLessonCompleted(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.lessonItem, completed && styles.completedLesson]}
        onPress={() => router.push({
          pathname: '/(tabs)/curriculum/[id]/lesson/[lessonId]',
          params: { id, lessonId: item.id }
        })}
      >
        <View style={styles.lessonIcon}>
          {completed ? (
            <CheckCircle2 size={20} color="#4F46E5" />
          ) : (
            <Book size={20} color="#6B7280" />
          )}
        </View>
        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle}>Day {item.id}: {item.title}</Text>
          <Text style={styles.lessonSubtitle}>{item.objective}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error || !skill) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Skill not found'}</Text>
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
          headerTitle: skill.title,
          headerBackTitle: 'Back',
          headerTintColor: '#4F46E5',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <Image source={{ uri: skill.imageUrl }} style={styles.skillImage} />
          <View style={styles.skillHeaderContent}>
            <Text style={styles.skillTitle}>{skill.title}</Text>
            <Text style={styles.skillDescription}>{skill.description}</Text>
            
            <View style={styles.skillMeta}>
              <View style={[
                styles.skillLevel,
                skill.level === 'Beginner' ? styles.beginnerLevel : 
                skill.level === 'Intermediate' ? styles.intermediateLevel : 
                styles.advancedLevel
              ]}>
                <Text style={styles.skillLevelText}>{skill.level}</Text>
              </View>
              <Text style={styles.skillDuration}>{skill.duration} days</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(Object.keys(progress[parseInt(id)] || {}).length / 30) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Object.keys(progress[parseInt(id)] || {}).length} of 30 lessons completed
          </Text>
        </View>
        
        <Text style={styles.lessonListTitle}>30-Day Curriculum</Text>
        
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLessonItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lessonList}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  header: {
    flexDirection: 'row',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  skillImage: {
    width: 100,
    height: 130,
    borderRadius: 8,
    marginRight: 16,
  },
  skillHeaderContent: {
    flex: 1,
  },
  skillTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  skillDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  skillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillLevel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  beginnerLevel: {
    backgroundColor: '#DCFCE7',
  },
  intermediateLevel: {
    backgroundColor: '#FEF3C7',
  },
  advancedLevel: {
    backgroundColor: '#FEE2E2',
  },
  skillLevelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  skillDuration: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B5563',
  },
  progressSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  progressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  lessonListTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  lessonList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
  },
  completedLesson: {
    borderColor: '#E0E0FF',
    backgroundColor: '#F9F9FF',
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});