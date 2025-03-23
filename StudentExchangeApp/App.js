import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import StudentVerificationScreen from './screens/StudentVerificationScreen';
// import profile from './screens/CompleteProfileScreen'
import CompleteProfileScreen from './screens/CompleteProfileScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileHomeScreen from './screens/ProfileHomeScreen';
import CompleteProfileStep1 from './screens/CompleteProfileStep1';
import CompleteProfileStep2 from './screens/CompleteProfileStep2';
import CompleteProfileStep3 from './screens/CompleteProfileStep3';
import HomeScreen from'./screens/HomeScreen';
import AppNavigator from './navigation/AppNavigator';


const Stack = createNativeStackNavigator();

export default function App() {
  return <AppNavigator />;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpScreen">
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentVerificationScreen" component={StudentVerificationScreen} options={{ title: 'Verification' }} />
        <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileHomeScreen" component={ProfileHomeScreen} options={{ title: 'Profile'}} />
        <Stack.Screen name="CompleteProfileStep1" component={CompleteProfileStep1} options={{ title: 'Profile'}} />
        <Stack.Screen name="CompleteProfileStep2" component={CompleteProfileStep2} options={{ title: 'Profile'}} />
        <Stack.Screen name="CompleteProfileStep3" component={CompleteProfileStep3} options={{ title: 'Profile'}} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
