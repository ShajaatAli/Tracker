import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

interface Workout {
  id: string;
  name: string;
  duration: string;
  date: string;
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem('workouts');
      if (savedWorkouts) {
        const parsedWorkouts = JSON.parse(savedWorkouts);
        setWorkouts(parsedWorkouts);
        setTotalWorkouts(parsedWorkouts.length);
        
        // Calculate total duration
        const total = parsedWorkouts.reduce((sum: number, workout: Workout) => 
          sum + parseInt(workout.duration), 0);
        setTotalDuration(total);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalWorkouts}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total Workouts</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalDuration}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total Minutes</Text>
        </View>
      </View>

      <View style={[styles.recentWorkouts, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Workouts</Text>
        {workouts.slice(0, 5).map((workout) => (
          <View 
            key={workout.id} 
            style={[styles.workoutItem, { 
              backgroundColor: colors.background,
              borderColor: colors.border
            }]}
          >
            <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
            <Text style={[styles.workoutDetails, { color: colors.text + 'CC' }]}>
              Duration: {workout.duration} minutes
            </Text>
            <Text style={[styles.workoutDate, { color: colors.text + '99' }]}>{workout.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 20,
  },
  statCard: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
  },
  recentWorkouts: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  workoutItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutDetails: {
    fontSize: 16,
  },
  workoutDate: {
    fontSize: 14,
    marginTop: 5,
  },
}); 