import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Platform, Modal, Animated, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Exercise {
  name: string;
  sets: number;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: string;
  exercises: Exercise[];
  notes?: string;
  startTime: string;
  endTime?: string;
}

const exerciseCategories = [
  'Abs',
  'Back',
  'Biceps',
  'Cardio',
  'Chest',
  'Legs'
];

export default function WorkoutScreen() {
  const { colors } = useTheme();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity

  useEffect(() => {
    loadWorkouts();
  }, []);

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

  const startNewWorkout = () => {
    const now = new Date();
    setCurrentWorkout({
      id: Date.now().toString(),
      name: '',
      date: now.toLocaleDateString(),
      startTime: now.toLocaleTimeString(),
      duration: '0',
      exercises: [],
      notes: ''
    });
    setIsAddingWorkout(true);
  };

  const goBack = () => {
    if (currentWorkout) {
      setIsAddingWorkout(false);
    }
    if (selectedWorkout) {
      setSelectedWorkout(null);
    }
  };

  const viewWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsAddingWorkout(true);
  };

  const addExercise = () => {
    setShowExerciseModal(true);
  };

  const closeExerciseModal = () => {
    setShowExerciseModal(false);
    setExerciseSearch('');
  };

  const selectExerciseCategory = (category: string) => {
    // TODO: Handle category selection
    console.log('Selected category:', category);
  };

  const finishWorkout = async () => {
    if (currentWorkout) {
      const now = new Date();
      const startTime = new Date(currentWorkout.date + ' ' + currentWorkout.startTime);
      const duration = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60)); // Convert to minutes

      const completedWorkout = {
        ...currentWorkout,
        exercises,
        endTime: now.toLocaleTimeString(),
        duration: duration.toString()
      };

      const updatedWorkouts = [...workouts, completedWorkout];
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setIsAddingWorkout(false);
      setCurrentWorkout(null);
      setExercises([]);
    }
  };

  const formatMonth = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const deleteWorkout = async (workoutId: string) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
    setWorkouts(updatedWorkouts);
    await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  const onDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(false);
    if (selected && currentWorkout) {
      const newDate = selected;
      setSelectedDate(newDate);
      setCurrentWorkout({
        ...currentWorkout,
        date: newDate.toLocaleDateString(),
        startTime: newDate.toLocaleTimeString()
      });
    }
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
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setWorkouts(workouts.filter(w => w.id !== workoutId));
            });
          }
        }
      ]
    );
  };

  const renderWorkoutForm = () => (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={goBack}
        >
          <FontAwesome name="chevron-left" size={20} color={colors.primary} />
          <Text style={[styles.headerButton, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {new Date().toLocaleDateString('default', { month: 'short', day: 'numeric' })}
        </Text>
        <View style={styles.headerRight}>
          {!selectedWorkout && (
            <TouchableOpacity 
              style={[styles.finishButton, { backgroundColor: colors.primary }]}
              onPress={finishWorkout}
            >
              <Text style={[styles.finishText, { color: 'white' }]}>Finish</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerIcon}>
            <FontAwesome name="ellipsis-h" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        <View style={styles.formField}>
          <TextInput
            style={[styles.input, { 
              color: colors.text, 
              borderColor: colors.border,
              fontSize: 18,
              paddingVertical: 12
            }]}
            value={currentWorkout?.name}
            onChangeText={(text) => setCurrentWorkout(prev => prev ? {...prev, name: text} : null)}
            placeholder="Name"
            placeholderTextColor={colors.text + '80'}
          />
        </View>

        <TouchableOpacity 
          style={styles.formField}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.label, { color: colors.text }]}>Start Time</Text>
          <View style={styles.timeButton}>
            <Text style={[styles.timeText, { color: colors.text }]}>
              {currentWorkout ? `${currentWorkout.date} ${currentWorkout.startTime}` : ''}
            </Text>
            <FontAwesome name="chevron-right" size={16} color={colors.text} />
          </View>
        </TouchableOpacity>

        <View style={styles.formField}>
          <Text style={[styles.label, { color: colors.text }]}>End Time</Text>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={[styles.timeText, { color: colors.text }]}>-</Text>
            <FontAwesome name="chevron-right" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.formField}>
          <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
          <TouchableOpacity style={styles.notesButton}>
            <FontAwesome name="chevron-right" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.addExerciseButton, { backgroundColor: colors.card }]}
        onPress={addExercise}
      >
        <Text style={[styles.addExerciseText, { color: colors.primary }]}>Add Exercise</Text>
      </TouchableOpacity>

      {showDatePicker && (Platform.OS === 'android' ? (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display="default"
          onChange={onDateChange}
        />
      ) : (
        <Modal
          transparent={true}
          visible={showDatePicker}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                onChange={onDateChange}
                textColor={colors.text}
              />
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ))}
    </ScrollView>
  );

  const renderWorkoutList = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.listHeader}>
        <TouchableOpacity onPress={toggleEditMode}>
          <Text style={[styles.editButton, { color: colors.primary }]}>
            {isEditMode ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.addButton, { 
            backgroundColor: colors.background,
            borderColor: colors.primary,
            borderWidth: 2
          }]}
          onPress={startNewWorkout}
        >
          <FontAwesome name="plus" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.headerTitle, { color: colors.text, marginLeft: 20, marginBottom: 20 }]}>Log</Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.workoutCardContainer}>
              {isEditMode && (
                <TouchableOpacity 
                  style={[styles.deleteButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleDeleteWorkout(item.id)}
                >
                  <FontAwesome name="trash" size={20} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[
                  styles.workoutCard, 
                  { 
                    backgroundColor: colors.card,
                    marginLeft: isEditMode ? 50 : 10 // Add margin when in edit mode
                  }
                ]}
                onPress={() => !isEditMode && viewWorkout(item)}
              >
                <View style={styles.dateContainer}>
                  <Text style={[styles.dayNumber, { color: colors.text }]}>
                    {new Date(item.date).getDate()}
                  </Text>
                  <Text style={[styles.dayName, { color: colors.text }]}>
                    {new Date(item.date).toLocaleDateString('default', { weekday: 'short' })}
                  </Text>
                </View>
                <View style={styles.workoutDetails}>
                  <Text style={[styles.workoutTitle, { color: colors.text }]}>{item.name}</Text>
                  {item.exercises.map((exercise, index) => (
                    <Text key={index} style={[styles.exerciseText, { color: colors.text + 'CC' }]}>
                      {exercise.sets}x {exercise.name}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.duration, { color: colors.text }]}>{item.duration} min</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );

  const renderExerciseModal = () => (
    <Modal
      visible={showExerciseModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.exerciseModalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.exerciseModalHeader, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={closeExerciseModal}>
            <Text style={[styles.modalCancelButton, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Exercise</Text>
          <TouchableOpacity>
            <FontAwesome name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOptionsButton}>
            <FontAwesome name="ellipsis-h" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
            <FontAwesome name="search" size={16} color={colors.text + '80'} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search"
              placeholderTextColor={colors.text + '80'}
              value={exerciseSearch}
              onChangeText={setExerciseSearch}
            />
          </View>
        </View>

        <FlatList
          data={exerciseCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryItem, { backgroundColor: colors.card }]}
              onPress={() => selectExerciseCategory(item)}
            >
              <Text style={[styles.categoryText, { color: colors.text }]}>{item}</Text>
              <FontAwesome name="chevron-right" size={16} color={colors.text} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
        />
      </View>
    </Modal>
  );

  return (
    <>
      {isAddingWorkout ? renderWorkoutForm() : renderWorkoutList()}
      {renderExerciseModal()}
    </>
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    fontSize: 16,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
  },
  formContainer: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  formField: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 8,
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
  },
  notesButton: {
    alignItems: 'flex-end',
  },
  addExerciseButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.8, // Slight transparency
  },
  workoutCard: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 16,
    borderRadius: 12,
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dayName: {
    fontSize: 14,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseText: {
    fontSize: 14,
    marginTop: 4,
  },
  duration: {
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  finishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  finishText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseModalContainer: {
    flex: 1,
  },
  exerciseModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  modalCancelButton: {
    fontSize: 17,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  modalOptionsButton: {
    marginLeft: 16,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    padding: 0,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryText: {
    fontSize: 17,
  },
  separator: {
    height: 1,
  },
}); 