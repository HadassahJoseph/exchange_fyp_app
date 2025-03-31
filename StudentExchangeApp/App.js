// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SignUpScreen from './screens/SignUpScreen';
// import StudentVerificationScreen from './screens/StudentVerificationScreen';
// // import profile from './screens/CompleteProfileScreen'
// import CompleteProfileScreen from './screens/CompleteProfileScreen';
// import LoginScreen from './screens/LoginScreen';
// import ProfileHomeScreen from './screens/ProfileHomeScreen';
// import CompleteProfileStep1 from './screens/CompleteProfileStep1';
// import CompleteProfileStep2 from './screens/CompleteProfileStep2';
// import CompleteProfileStep3 from './screens/CompleteProfileStep3';
// import HomeScreen from'./screens/HomeScreen';
// import AppNavigator from './navigation/AppNavigator';
// //import SellScreen from './screens/SellScreen';


// const Stack = createNativeStackNavigator();

// export default function App() {
//   return <AppNavigator />;
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SignUpScreen">
//         <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="StudentVerificationScreen" component={StudentVerificationScreen} options={{ title: 'Verification' }} />
//         <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="ProfileHomeScreen" component={ProfileHomeScreen} options={{ title: 'Profile'}} />
//         <Stack.Screen name="CompleteProfileStep1" component={CompleteProfileStep1} options={{ title: 'Profile'}} />
//         <Stack.Screen name="CompleteProfileStep2" component={CompleteProfileStep2} options={{ title: 'Profile'}} />
//         <Stack.Screen name="CompleteProfileStep3" component={CompleteProfileStep3} options={{ title: 'Profile'}} />
//         <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// App.js
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Screens
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import StudentVerificationScreen from './screens/StudentVerificationScreen';
import CompleteProfileStep1 from './screens/CompleteProfileStep1';
import CompleteProfileStep2 from './screens/CompleteProfileStep2';
import CompleteProfileStep3 from './screens/CompleteProfileStep3';
import ItemDetailScreen from './screens/ItemDetailScreen';
import AskQuestionScreen from './screens/AskQuestionScreen';
import SellScreen from './screens/SellScreen'; // This will still be used
import CreatePostScreen from './screens/CreatePostScreen';
import CommentScreen from './screens/CommentScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import AppNavigator from './navigation/AppNavigator'; // bottom tab nav

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Main App with Bottom Tabs
          <Stack.Screen name="AppNavigator" component={AppNavigator} />

        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          </>
        )}

        {/* Shared Screens (can be used by both logged in & auth flow) */}
        <Stack.Screen name="StudentVerificationScreen" component={StudentVerificationScreen} />
        <Stack.Screen name="CompleteProfileStep1" component={CompleteProfileStep1} />
        <Stack.Screen name="CompleteProfileStep2" component={CompleteProfileStep2} />
        <Stack.Screen name="CompleteProfileStep3" component={CompleteProfileStep3} />
        <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
        <Stack.Screen name="SellScreen" component={SellScreen} />
        <Stack.Screen name="CreatePostScreen" component={CreatePostScreen}/>
        <Stack.Screen name="AskQuestionScreen" component={AskQuestionScreen} />
        <Stack.Screen name='CommentScreen' component={CommentScreen} />
        <Stack.Screen name='AddPlaceScreen' component={AddPlaceScreen}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
