import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { LayoutEditorScreen } from './src/screens/LayoutEditorScreen';
import { ContentManagerScreen } from './src/screens/ContentManagerScreen';
import { WidgetConfigScreen } from './src/screens/WidgetConfigScreen';
import { PanelConfigScreen } from './src/screens/PanelConfigScreen';
import { NetworkDiscoveryScreen } from './src/screens/NetworkDiscoveryScreen';
import { DeviceManagerScreen } from './src/screens/DeviceManagerScreen';
import { theme } from './src/utils/theme';

const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: theme.colors.background, card: theme.colors.surface, text: theme.colors.text, border: theme.colors.border, primary: theme.colors.primary } };

export default function App() {
  return <NavigationContainer theme={navTheme}><Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, cardStyle: { backgroundColor: theme.colors.background } }}><Stack.Screen name="Home" component={HomeScreen} /><Stack.Screen name="LayoutEditor" component={LayoutEditorScreen} options={{ title: 'Layout Editor' }} /><Stack.Screen name="ContentManager" component={ContentManagerScreen} options={{ title: 'Content Manager' }} /><Stack.Screen name="WidgetConfig" component={WidgetConfigScreen} options={{ title: 'Widgets' }} /><Stack.Screen name="PanelConfig" component={PanelConfigScreen} options={{ title: 'Panels' }} /><Stack.Screen name="NetworkDiscovery" component={NetworkDiscoveryScreen} options={{ title: 'Network Discovery' }} /><Stack.Screen name="DeviceManager" component={DeviceManagerScreen} options={{ title: 'Devices' }} /></Stack.Navigator></NavigationContainer>;
}
