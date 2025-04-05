import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}
      initialRouteName="workout"
    >
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout Log',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <FontAwesome name="bar-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calorie"
        options={{
          title: 'Calories',
          tabBarIcon: ({ color }) => <FontAwesome name="fire" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 