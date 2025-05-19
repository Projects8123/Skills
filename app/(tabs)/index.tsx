import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getAllSkills } from '@/services/api';
import { Search, Wand as MagicWand } from 'lucide-react-native';
import type { Skill } from '@/types';

export default function DiscoverScreen() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillPress = (skill: Skill) => {
    router.push({
      pathname: '/(tabs)/curriculum/[id]',
      params: { id: skill.id }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Learner'}</Text>
          <Text style={styles.subtitle}>Discover new skills to master</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadSkills}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.aiSuggestionContainer}>
            <TouchableOpacity style={styles.aiSuggestionButton}>
              <MagicWand size={20} color="#4F46E5" />
              <Text style={styles.aiSuggestionText}>Get AI-suggested skills</Text>
            </TouchableOpacity>
            <Text style={styles.aiSuggestionHint}>Based on your interests and goals</Text>
          </View>

          <Text style={styles.sectionTitle}>Popular Skills</Text>
          <FlatList
            data={skills}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.skillCard}
                onPress={() => handleSkillPress(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.skillImage} />
                <View style={styles.skillContent}>
                  <Text style={styles.skillTitle}>{item.title}</Text>
                  <Text style={styles.skillDescription}>{item.description}</Text>
                  <View style={styles.skillMeta}>
                    <Text style={styles.skillDuration}>{item.duration} days</Text>
                    <View style={[styles.skillLevel, 
                      item.level === 'Beginner' ? styles.beginnerLevel : 
                      item.level === 'Intermediate' ? styles.intermediateLevel : 
                      styles.advancedLevel
                    ]}>
                      <Text style={styles.skillLevelText}>{item.level}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.skillsList}
          />
        </>
      )}
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSuggestionContainer: {
    margin: 24,
    padding: 16,
    backgroundColor: '#F0F0FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0FF',
  },
  aiSuggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4F46E5',
    marginLeft: 8,
  },
  aiSuggestionHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  skillsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    marginBottom: 4,
  },
  skillDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  skillMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillDuration: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B5563',
  },
  skillLevel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});