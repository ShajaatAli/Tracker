import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Fitness Tracker</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Workout')}
      >
        <Text style={styles.buttonText}>Track Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Calorie')}
      >
        <Text style={styles.buttonText}>Track Calories</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 