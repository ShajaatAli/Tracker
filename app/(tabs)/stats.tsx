import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function StatsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Your workout stats will appear here</Text>
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
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
}); 