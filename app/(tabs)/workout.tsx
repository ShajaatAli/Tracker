import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: string;
  name: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
  bodyweight: string;
  notes: string;
  exercises: Exercise[];
  duration?: number; // in minutes
}

const exerciseCategories = [
  'Abs',
  'Back',
  'Biceps',
  'Cardio',
  'Chest',
  'Legs',
];

export default function WorkoutScreen() {
  const { colors } = useTheme();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const startNewWorkout = () => {
    const now = new Date();
    setCurrentWorkout({
      id: Date.now().toString(),
      name: '',
      date: now,
      startTime: now,
      endTime: null,
      bodyweight: '',
      notes: '',
      exercises: []
    });
    setShowNewWorkout(true);
  };

  const handleFinishWorkout = () => {
    if (currentWorkout) {
      const finishedWorkout = {
        ...currentWorkout,
        endTime: new Date()
      };
      setWorkouts([...workouts, finishedWorkout]);
      setCurrentWorkout(null);
      setShowNewWorkout(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupWorkoutsByMonth = (workouts: Workout[]) => {
    const grouped = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date);
      const key = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(workout);
      return acc;
    }, {} as Record<string, Workout[]>);

    return Object.entries(grouped).map(([month, workouts]) => ({
      month,
      workouts,
      count: workouts.length
    }));
  };

  const handleDeleteWorkout = (workoutId: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setWorkouts(workouts.filter(w => w.id !== workoutId));
          }
        }
      ]
    );
  };

  const renderWorkoutCard = (workout: Workout) => {
    const date = new Date(workout.date);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    
    return (
      <View key={workout.id} style={styles.workoutCard}>
        {isEditing && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteWorkout(workout.id)}
          >
            <Text style={styles.deleteButtonText}>－</Text>
          </TouchableOpacity>
        )}
        <View style={[
          styles.workoutContent,
          isEditing && styles.workoutContentEditing
        ]}>
          <View style={styles.workoutHeader}>
            <View style={styles.dateBox}>
              <Text style={[styles.dayOfWeek, { color: colors.text }]}>{dayOfWeek}</Text>
              <Text style={[styles.dayOfMonth, { color: colors.text }]}>{dayOfMonth}</Text>
            </View>
            <View style={styles.workoutInfo}>
              <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
              {workout.duration && (
                <Text style={[styles.duration, { color: '#666' }]}>{workout.duration} min</Text>
              )}
            </View>
          </View>
          <View style={styles.exerciseList}>
            {workout.exercises.map((exercise, index) => (
              <Text key={index} style={[styles.exerciseItem, { color: colors.text }]}>
                {exercise.sets}x {exercise.name}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderMainScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={[styles.editButton, { color: colors.primary }]}>
            {isEditing ? "Done" : "Edit"}
          </Text>
        </TouchableOpacity>
        {!isEditing && (
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={startNewWorkout}
          >
            <FontAwesome name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.mainTitle, { color: colors.text }]}>Log</Text>

      {groupWorkoutsByMonth(workouts).map(({ month, workouts, count }) => (
        <View key={month} style={styles.monthSection}>
          <View style={styles.monthHeader}>
            <Text style={[styles.monthTitle, { color: '#666' }]}>{month}</Text>
            <Text style={[styles.workoutCount, { color: '#666' }]}>{count} Workouts</Text>
          </View>
          {workouts.map(renderWorkoutCard)}
        </View>
      ))}
    </ScrollView>
  );

  const renderNewWorkoutScreen = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => setShowNewWorkout(false)}
            style={styles.backButton}
          >
            <FontAwesome name="chevron-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleFinishWorkout}
            style={styles.finishButton}
          >
            <Text style={[styles.finishText, { color: colors.primary }]}>Finish</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.dateText, { color: colors.text }]}>
          {currentWorkout?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="clock-o" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="ellipsis-h" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.card}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Name"
            placeholderTextColor="#666"
            value={currentWorkout?.name}
            onChangeText={(text) => currentWorkout && setCurrentWorkout({...currentWorkout, name: text})}
          />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Start Time</Text>
            <Text style={[styles.value, { color: colors.text }]}>{formatTime(currentWorkout?.startTime || new Date())}</Text>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>End Time</Text>
            <Text style={[styles.value, { color: colors.text }]}>-</Text>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Bodyweight (lb)</Text>
            <TextInput
              style={[styles.weightInput, { color: colors.text }]}
              value={currentWorkout?.bodyweight}
              onChangeText={(text) => currentWorkout && setCurrentWorkout({...currentWorkout, bodyweight: text})}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#666"
            />
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </View>
          <TouchableOpacity style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addExerciseCard]}
          onPress={() => setShowExerciseModal(true)}
        >
          <Text style={[styles.addExerciseText, { color: colors.primary }]}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderExerciseModal = () => (
    <Modal
      animationType="slide"
      visible={showExerciseModal}
      onRequestClose={() => setShowExerciseModal(false)}
    >
      <SafeAreaView style={[styles.modalView, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={() => setShowExerciseModal(false)}
            style={styles.cancelButton}
          >
            <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Exercise</Text>
          <View style={styles.addExerciseButton} />
        </View>

        {exerciseCategories.map((category) => (
          <TouchableOpacity 
            key={category}
            style={[styles.categoryItem, { borderBottomColor: '#333' }]}
            onPress={() => {
              // Handle category selection
              setShowExerciseModal(false);
            }}
          >
            <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showNewWorkout ? (
        <Modal
          animationType="slide"
          visible={showNewWorkout}
          onRequestClose={() => setShowNewWorkout(false)}
        >
          {renderNewWorkoutScreen()}
        </Modal>
      ) : (
        renderMainScreen()
      )}

      {renderExerciseModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  finishButton: {
    padding: 8,
  },
  finishText: {
    fontSize: 17,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
    marginLeft: 16,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    fontSize: 17,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  label: {
    fontSize: 17,
    flex: 1,
  },
  value: {
    fontSize: 17,
    marginRight: 8,
  },
  weightInput: {
    fontSize: 17,
    textAlign: 'right',
    marginRight: 8,
    minWidth: 60,
  },
  addExerciseCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginTop: 20,
    padding: 16,
  },
  addExerciseText: {
    fontSize: 17,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cancelButton: {
    width: 70,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 17,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  addExerciseButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  categoryText: {
    fontSize: 17,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  editButton: {
    fontSize: 17,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  workoutCount: {
    fontSize: 17,
  },
  workoutCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dateBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayOfWeek: {
    fontSize: 13,
    fontWeight: '500',
  },
  dayOfMonth: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  workoutInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutName: {
    fontSize: 17,
    fontWeight: '600',
  },
  duration: {
    fontSize: 15,
  },
  exerciseList: {
    marginLeft: 62, // dateBox width + marginRight
  },
  exerciseItem: {
    fontSize: 15,
    marginBottom: 4,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  workoutContent: {
    marginLeft: 0,
  },
  workoutContentEditing: {
    marginLeft: 24,
  },
}); 