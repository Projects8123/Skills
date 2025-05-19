import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useProgress } from '@/contexts/ProgressContext';
import { getUserEnrolledSkills } from '@/services/api';
import { CirclePlus as PlusCircle, Compass } from 'lucide-react-native';
import type { EnrolledSkill } from '@/types';

export default function CurriculumScreen() {
  const { progress } = useProgress();
  const [enrolledSkills, setEnrolledSkills] = useState<EnrolledSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrolledSkills();
  }, []);

  const loadEnrolledSkills = async () => {
    try {
      setLoading(true);
      const data = await getUserEnrolledSkills();
      setEnrolledSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (skillId: number): number => {
    const skillProgress = progress[skillId];
    if (!skillProgress) return 0;
    
    return (Object.keys(skillProgress).length / 30) * 100;
  };

  const handleSkillPress = (skill: EnrolledSkill) => {
    router.push({
      pathname: '/(tabs)/curriculum/[id]',
      params: { id: skill.id }
    });
  };

  const renderNoSkills = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Compass size={48} color="#4F46E5" />
      </View>
      <Text style={styles.emptyTitle}>No Skills Yet</Text>
      <Text style={styles.emptyText}>
        Enroll in your first skill to start your learning journey
      </Text>
      <TouchableOpacity
        style={styles.discoverButton}
        onPress={() => router.push('/(tabs)/')}
      >
        <Text style={styles.discoverButtonText}>Discover Skills</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Skills</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/')}
        >
          <PlusCircle size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={enrolledSkills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const progressPercent = getProgressPercentage(item.id);
          return (
            <TouchableOpacity
              style={styles.skillCard}
              onPress={() => handleSkillPress(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.skillImage} />
              <View style={styles.skillContent}>
                <Text style={styles.skillTitle}>{item.title}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progressPercent}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{Math.round(progressPercent)}% complete</Text>
                </View>
                
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonCountText}>
                    {Object.keys(progress[item.id] || {}).length} / 30 lessons completed
                  </Text>
                  
                  {Object.keys(progress[item.id] || {}).length > 0 && (
                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={() => {
                        // Navigate to the next incomplete lesson
                        const completedLessons = Object.keys(progress[item.id] || {}).map(Number);
                        const nextLesson = Array.from({ length: 30 }, (_, i) => i + 1)
                          .find(num => !completedLessons.includes(num)) || completedLessons.length + 1;
                        
                        router.push({
                          pathname: '/(tabs)/curriculum/[id]/lesson/[lessonId]',
                          params: { id: item.id, lessonId: nextLesson }
                        });
                      }}
                    >
                      <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={renderNoSkills}
        contentContainerStyle={[
          styles.list,
          enrolledSkills.length === 0 && styles.emptyList
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  skillCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  skillImage: {
    width: 100,
    height: 'auto',
    aspectRatio: 3/4,
  },
  skillContent: {
    flex: 1,
    padding: 16,
  },
  skillTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 12,
  },
  progressContainer: {
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
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B5563',
  },
  lessonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonCountText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  continueButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  continueButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  discoverButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  discoverButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});