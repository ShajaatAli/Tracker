import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 