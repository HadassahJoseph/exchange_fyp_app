// navigation/AppNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/AppNavigatorStyles';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileHomeScreen from '../screens/ProfileHomeScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={24} color={color} />;
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
              return <Ionicons name={iconName} size={24} color={color} />;
            } else if (route.name === 'Chats') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              return <Ionicons name={iconName} size={24} color={color} />;
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
              return <Ionicons name={iconName} size={24} color={color} />;
            }
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: styles.tabBar,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />

        {/* Empty FAB center slot */}
        <Tab.Screen
          name="CreatePostButton"
          component={CreatePostScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                style={styles.fabContainer}
                onPress={props.onPress}
              >
                <MaterialIcons name="add-circle" size={60} color="#4CAF50" />
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen name="Chats" component={ChatsScreen} />
        <Tab.Screen name="Profile" component={ProfileHomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
