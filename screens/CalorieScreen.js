import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalorieScreen() {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [meals, setMeals] = useState([]);

  const addMeal = async () => {
    if (foodName && calories) {
      const newMeal = {
        id: Date.now().toString(),
        name: foodName,
        calories: parseInt(calories),
        date: new Date().toLocaleDateString(),
      };

      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      
      setFoodName('');
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

  React.useEffect(() => {
    loadMeals();
  }, []);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Calories Today: {totalCalories}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Food Name"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={styles.input}
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={addMeal}>
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealDetails}>
              Calories: {item.calories}
            </Text>
            <Text style={styles.mealDate}>{item.date}</Text>
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
  mealItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealDetails: {
    fontSize: 16,
    color: '#666',
  },
  mealDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
}); 