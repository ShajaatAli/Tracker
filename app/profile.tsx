import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

interface UserProfile {
  name: string;
  weight: string;
  height: string;
  goal: string;
}

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    weight: '',
    height: '',
    goal: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <FontAwesome 
              name={theme === 'light' ? 'moon-o' : 'sun-o'} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor={colors.text + '80'}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Weight (kg)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={profile.weight}
            onChangeText={(text) => setProfile({ ...profile, weight: text })}
            placeholder="Enter your weight"
            placeholderTextColor={colors.text + '80'}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Height (cm)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={profile.height}
            onChangeText={(text) => setProfile({ ...profile, height: text })}
            placeholder="Enter your height"
            placeholderTextColor={colors.text + '80'}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Fitness Goal</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={profile.goal}
            onChangeText={(text) => setProfile({ ...profile, goal: text })}
            placeholder="Enter your fitness goal"
            placeholderTextColor={colors.text + '80'}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]} 
        onPress={saveProfile}
      >
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    padding: 15,
    borderRadius: 10,
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
}); 