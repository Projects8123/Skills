import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import { getUserEnrolledSkills } from '@/services/api';
import { Trophy, Medal, Share2 } from 'lucide-react-native';
import type { EnrolledSkill } from '@/types';

type ProgressStats = {
  totalLessons: number;
  completedLessons: number;
  averageCompletion: number;
  streak: number;
};

export default function ProgressScreen() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const [enrolledSkills, setEnrolledSkills] = useState<EnrolledSkill[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalLessons: 0,
    completedLessons: 0,
    averageCompletion: 0,
    streak: 0,
  });

  useEffect(() => {
    loadEnrolledSkills();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [enrolledSkills, progress]);

  const loadEnrolledSkills = async () => {
    try {
      const data = await getUserEnrolledSkills();
      setEnrolledSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStats = () => {
    if (enrolledSkills.length === 0) return;

    const totalSkills = enrolledSkills.length;
    const totalPossibleLessons = totalSkills * 30;
    let completedLessonsCount = 0;

    Object.keys(progress).forEach(skillId => {
      completedLessonsCount += Object.keys(progress[parseInt(skillId)]).length;
    });

    // This is a mock streak calculation - in a real app, you would track daily completions
    const streak = Math.min(completedLessonsCount, 14);

    setStats({
      totalLessons: totalPossibleLessons,
      completedLessons: completedLessonsCount,
      averageCompletion: totalSkills ? (completedLessonsCount / totalPossibleLessons) * 100 : 0,
      streak,
    });
  };

  const getSkillProgress = (skillId: number): number => {
    const skillProgress = progress[skillId];
    if (!skillProgress) return 0;
    return (Object.keys(skillProgress).length / 30) * 100;
  };

  const renderAchievements = () => {
    const achievements = [
      { 
        title: 'First Lesson',
        description: 'Completed your first lesson',
        unlocked: stats.completedLessons >= 1,
        icon: <Trophy size={24} color={stats.completedLessons >= 1 ? '#F59E0B' : '#D1D5DB'} />
      },
      { 
        title: '5-Day Streak',
        description: 'Learned for 5 consecutive days',
        unlocked: stats.streak >= 5,
        icon: <Medal size={24} color={stats.streak >= 5 ? '#F59E0B' : '#D1D5DB'} />
      },
      { 
        title: '10-Day Streak',
        description: 'Learned for 10 consecutive days',
        unlocked: stats.streak >= 10,
        icon: <Medal size={24} color={stats.streak >= 10 ? '#F59E0B' : '#D1D5DB'} />
      },
      { 
        title: 'Skill Master',
        description: 'Completed an entire 30-day skill curriculum',
        unlocked: Object.values(progress).some(skillProgress => Object.keys(skillProgress).length === 30),
        icon: <Trophy size={24} color={Object.values(progress).some(skillProgress => Object.keys(skillProgress).length === 30) ? '#F59E0B' : '#D1D5DB'} />
      },
    ];

    return (
      <View style={styles.achievementsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
        </View>
        <View style={styles.achievements}>
          {achievements.map((achievement, index) => (
            <View 
              key={index} 
              style={[
                styles.achievementCard, 
                achievement.unlocked ? styles.unlockedAchievement : styles.lockedAchievement
              ]}
            >
              <View style={styles.achievementIcon}>
                {achievement.icon}
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedLessons}</Text>
            <Text style={styles.statLabel}>Lessons Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(stats.averageCompletion)}%</Text>
            <Text style={styles.statLabel}>Average Completion</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.skillProgressContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills Progress</Text>
          </View>
          
          {enrolledSkills.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                You haven't enrolled in any skills yet
              </Text>
            </View>
          ) : (
            enrolledSkills.map(skill => {
              const progressPercent = getSkillProgress(skill.id);
              return (
                <View key={skill.id} style={styles.skillProgressCard}>
                  <Image source={{ uri: skill.imageUrl }} style={styles.skillImage} />
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillTitle}>{skill.title}</Text>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${progressPercent}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{Math.round(progressPercent)}%</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {renderAchievements()}
      </ScrollView>
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#4F46E5',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  skillProgressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  skillProgressCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  skillImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  skillInfo: {
    flex: 1,
  },
  skillTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 8,
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
    color: '#6B7280',
    width: 36,
    textAlign: 'right',
  },
  achievementsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 24,
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  unlockedAchievement: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  lockedAchievement: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});