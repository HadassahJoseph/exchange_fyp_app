import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import StudentVerificationScreen from './screens/StudentVerificationScreen';
import CompleteProfileStep1 from './screens/CompleteProfileStep1';
import CompleteProfileStep2 from './screens/CompleteProfileStep2';
import CompleteProfileStep3 from './screens/CompleteProfileStep3';
import ItemDetailScreen from './screens/ItemDetailScreen';
import AskQuestionScreen from './screens/AskQuestionScreen';
import SellScreen from './screens/SellScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import CommentScreen from './screens/CommentScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import FavouritesScreen from './screens/FavouritesScreen';
import AppNavigator from './navigation/AppNavigator';
import ChatRoom from './screens/ChatRoom';
import OnboardingScreen from './screens/OnboardingScreen';
import SplashScreen from './screens/SplashScreenView';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EditProfileStep1 from './screens/EditProfileStep1';
import EditProfileStep2 from './screens/EditProfileStep2';
import PostDetailScreen from './screens/PostDetailScreen';
import PostCard from './screens/PostCard';
import ItemCard from './screens/ItemCard';
import DiscussionCard from './screens/DiscussionCard';
import MapTab from './screens/MapTab';
import ConnectionsTab from  './screens/ConnectionsTab';
import AccommodationTab from './screens/AccommodationTab';


const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loadingSplash, setLoadingSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const determineInitialRoute = async () => {
      const seen = await AsyncStorage.getItem('onboardingSeen');
      const showOnboarding = !seen;

      const auth = getAuth();
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          setInitialRoute('LoginScreen');
        } else {
          try {
            await firebaseUser.getIdToken(true);
            console.log('[App] Firebase user authenticated. Token refreshed.');

            const userRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
              console.warn('[App] No Firestore doc found.');
              setInitialRoute('LoginScreen');
              return;
            }

            const userData = docSnap.data();
            const isVerified = userData.status === 'Verified';

            if (!isVerified) {
              setInitialRoute('StudentVerificationScreen');
            } else if (showOnboarding) {
              setInitialRoute('OnboardingScreen');
            } else {
              setInitialRoute('AppNavigator');
            }
          } catch (err) {
            console.error('[App] Error during user check:', err);
            setInitialRoute('LoginScreen');
          }
        }
      });
    };

    determineInitialRoute();
  }, []);

  if (loadingSplash || initialRoute === null) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="StudentVerificationScreen" component={StudentVerificationScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="AppNavigator" component={AppNavigator} />
        <Stack.Screen name="CompleteProfileStep1" component={CompleteProfileStep1} />
        <Stack.Screen name="CompleteProfileStep2" component={CompleteProfileStep2} />
        <Stack.Screen name="CompleteProfileStep3" component={CompleteProfileStep3} />
        <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
        <Stack.Screen name="SellScreen" component={SellScreen} />
        <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
        <Stack.Screen name="AskQuestionScreen" component={AskQuestionScreen} />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
        <Stack.Screen name="AddPlaceScreen" component={AddPlaceScreen} />
        <Stack.Screen name="FavouritesScreen" component={FavouritesScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="EditProfileStep1" component={EditProfileStep1} />
        <Stack.Screen name="EditProfileStep2" component={EditProfileStep2} />
        <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
        <Stack.Screen name="PostCard" component={PostCard}/>
        <Stack.Screen name="ItemCard" component={ItemCard}/>
        <Stack.Screen name="DiscussionCard" component={DiscussionCard}/>
        <Stack.Screen name="MapTab" component={MapTab}/>
        <Stack.Screen name="ConnectionsTab" component= {ConnectionsTab}/>
        <Stack.Screen name="AccommodationTab" component={AccommodationTab}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
