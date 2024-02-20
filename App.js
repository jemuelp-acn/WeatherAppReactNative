import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/view/Main';
import LocationManagerScreen from './src/view/LocationManager';
import { ThemeProvider } from './src/utils/ThemeProvider';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="LocationManagerScreen" component={LocationManagerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}
