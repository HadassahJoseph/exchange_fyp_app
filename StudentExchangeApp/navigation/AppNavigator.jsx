import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import styles from '../styles/AppNavigatorStyles';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileHomeScreen from '../screens/ProfileHomeScreen';
import SellScreen from '../screens/SellScreen'; // This will still be used
import CreatePostScreen from '../screens/CreatePostScreen';
import AskQuestionScreen from '../screens/AskQuestionScreen';

const Tab = createBottomTabNavigator();

function FloatingMenu() {
  const navigation = useNavigation(); // 👈 get navigation from the hook
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <View style={styles.fabMenu}>
      {isOpen && (
        <View style={styles.fabMenu}>
          <TouchableOpacity style={styles.fabOption} onPress={() => {
            setIsOpen(false);
            navigation.navigate('CreatePostScreen');
          }}>
            <Feather name="edit" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabOption} onPress={() => {
            setIsOpen(false);
            navigation.navigate('AskQuestionScreen');
          }}>
            <Feather name="help-circle" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Ask</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabOption} onPress={() => {
            setIsOpen(false);
            navigation.navigate('SellScreen');
          }}>
            <MaterialIcons name="sell" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabOption} onPress={() => {
            setIsOpen(false);
            navigation.navigate('AddPlaceScreen');
          }}>
            <Feather name="map-pin" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Add Place</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={toggleMenu} style={styles.fabMain}>
        <Ionicons name={isOpen ? 'close' : 'add'} size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}


export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
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
      <Tab.Screen
        name="Sell"
        component={HomeScreen} // Placeholder — logic is in FAB
        options={{
          tabBarButton: (props) => <FloatingMenu {...props} />,
        }}
      />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileHomeScreen} />
    </Tab.Navigator>
  );
}