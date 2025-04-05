import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)/workout');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sign In</Text>
      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.text
        }]}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={[styles.label, { color: colors.text }]}>Password</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.text
        }]}
        placeholder="Enter your password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]} 
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/sign-up')}>
        <Text style={[styles.link, { color: colors.primary }]}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
  },
}); 