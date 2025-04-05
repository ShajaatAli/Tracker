import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

function TabLayoutContent() {
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

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)/workout');
    }
  }, [user, loading, segments]);

  if (loading) {
    return null; // Or a loading screen
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}
