import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const addWorkout = async () => {
    if (workoutName && duration) {
      const newWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        duration: duration,
        date: new Date().toLocaleDateString(),
      };

      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      
      setWorkoutName('');
      setDuration('');
    }
  };

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem('workouts');
      if (savedWorkouts) {
        setWorkouts(JSON.parse(savedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  React.useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={addWorkout}>
          <Text style={styles.buttonText}>Add Workout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.workoutName}>{item.name}</Text>
            <Text style={styles.workoutDetails}>
              Duration: {item.duration} minutes
            </Text>
            <Text style={styles.workoutDate}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutDetails: {
    fontSize: 16,
    color: '#666',
  },
  workoutDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
}); 