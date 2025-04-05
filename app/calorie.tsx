import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

interface Meal {
  id: string;
  name: string;
  calories: string;
  date: string;
}

export default function CalorieScreen() {
  const { colors } = useTheme();
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = async () => {
    if (mealName && calories) {
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: mealName,
        calories: calories,
        date: new Date().toLocaleDateString(),
      };

      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      
      setMealName('');
      setCalories('');
    }
  };

  const loadMeals = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem('meals');
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const totalCalories = meals.reduce((sum, meal) => sum + parseInt(meal.calories), 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryText, { color: colors.text }]}>Total Calories Today: {totalCalories}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border
          }]}
          placeholder="Meal Name"
          placeholderTextColor={colors.text + '80'}
          value={mealName}
          onChangeText={setMealName}
        />
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border
          }]}
          placeholder="Calories"
          placeholderTextColor={colors.text + '80'}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={addMeal}
        >
          <Text style={styles.buttonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.mealItem, { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }]}>
            <Text style={[styles.mealName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.mealDetails, { color: colors.text + 'CC' }]}>
              Calories: {item.calories}
            </Text>
            <Text style={[styles.mealDate, { color: colors.text + '99' }]}>{item.date}</Text>
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
  },
  summaryContainer: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mealItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealDetails: {
    fontSize: 16,
  },
  mealDate: {
    fontSize: 14,
    marginTop: 5,
  },
}); 