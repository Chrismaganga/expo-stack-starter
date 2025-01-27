/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import '../global.css';
import 'expo-dev-client';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PortalProvider } from '@gorhom/portal';
import { Provider } from 'react-native-paper';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ActionSheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <PortalProvider>
            <Provider>
              <Tabs
                screenOptions={{
                  tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#2196F3',
                  tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#666',
                  tabBarStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
                  },
                  headerStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
                  },
                  headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                }}
              >
                <Tabs.Screen
                  name="index"
                  options={{
                    title: 'Create Certificate',
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="certificate"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="certificates/index"
                  options={{
                    title: 'My Certificates',
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="folder"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
              </Tabs>
            </Provider>
          </PortalProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}
