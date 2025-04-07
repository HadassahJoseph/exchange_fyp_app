import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/AppNavigatorStyles';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileHomeScreen from '../screens/ProfileHomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import AskQuestionScreen from '../screens/AskQuestionScreen';
import SellScreen from '../screens/SellScreen';
import AddPlaceScreen from '../screens/AddPlaceScreen';

const Tab = createBottomTabNavigator();

function CustomFABTabButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.fabButton}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

function FloatingMenuTab() {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <View style={styles.fabMenuWrapper}>
      {isOpen && (
        <View style={styles.fabMenuOptions}>
          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setIsOpen(false);
              navigation.navigate('CreatePostScreen');
            }}
          >
            <Feather name="edit" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setIsOpen(false);
              navigation.navigate('AskQuestionScreen');
            }}
          >
            <Feather name="help-circle" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Ask</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setIsOpen(false);
              navigation.navigate('SellScreen');
            }}
          >
            <MaterialIcons name="sell" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setIsOpen(false);
              navigation.navigate('AddPlaceScreen');
            }}
          >
            <Feather name="map-pin" size={20} color="#fff" />
            <Text style={styles.fabOptionText}>Place</Text>
          </TouchableOpacity>
        </View>
      )}

      <CustomFABTabButton onPress={toggleMenu}>
        <Ionicons name={isOpen ? 'close' : 'add'} size={28} color="#fff" />
      </CustomFABTabButton>
    </View>
  );
}

export default function AppNavigator() {
  return (
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
      <Tab.Screen
        name="Sell"
        component={FloatingMenuTab}
        options={{
          tabBarButton: (props) => <FloatingMenuTab {...props} />,
        }}
      />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileHomeScreen} />
    </Tab.Navigator>
  );
}
