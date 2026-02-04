import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppThemeProvider, useAppTheme } from '@/ctx/ThemeContext';
import { MissionProvider } from '@/ctx/MissionContext';
import { AlertQueueProvider } from '@/ctx/AlertQueueContext';
import { OfflineProvider } from '@/ctx/OfflineContext';
import { PatrolProvider } from '@/ctx/PatrolContext';
import AlertOverlay from '@/components/AlertOverlay';
import OfflineIndicator from '@/components/OfflineIndicator';
import MissionNavigationHandler from '@/components/MissionNavigationHandler';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OfflineProvider>
        <AlertQueueProvider>
          <PatrolProvider>
            <MissionProvider>
              <AppThemeProvider>
                {/* Helper component to inject current theme into Navigation */}
                <NavigationThemeWrapper />
                <MissionNavigationHandler />
                {/* <AlertOverlay /> */}
                <OfflineIndicator />
              </AppThemeProvider>
            </MissionProvider>
          </PatrolProvider>
        </AlertQueueProvider>
      </OfflineProvider>
    </GestureHandlerRootView>
  );
}

// Wrapper to consume context and pass to NavigationContainer (via Stack)
function NavigationThemeWrapper() {
  const { colorScheme } = useAppTheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="auth/login">
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="incident-report" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="occurrence-report" options={{ headerShown: false, presentation: 'modal' }} />
        {/* MAINTENANCE ROUTES - ẨN KHỎI MVP */}
        {/* <Stack.Screen name="ticket-detail" options={{ headerShown: false }} /> */}
        <Stack.Screen name="checkpoint-scanner" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="alert-queue" options={{ headerShown: false }} />
        <Stack.Screen name="incident-list" options={{ headerShown: false }} />
        {/* <Stack.Screen name="maintenance-list" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="alert-list" options={{ headerShown: false }} /> */}
        <Stack.Screen name="patrol-details" options={{ headerShown: false }} />
        <Stack.Screen name="patrol-history-detail" options={{ headerShown: false }} />
        <Stack.Screen name="patrol-incidents-summary" options={{ headerShown: false }} />
        <Stack.Screen name="patrol-location-log" options={{ headerShown: false }} />
        <Stack.Screen name="patrol-report" options={{ headerShown: false }} />
        <Stack.Screen name="alert-list" options={{ headerShown: false }} />
        <Stack.Screen name="alert-detail" options={{ headerShown: false }} />
        <Stack.Screen name="alert-resolved-detail" options={{ headerShown: false }} />
        <Stack.Screen name="tactical-mission" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

