import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Study Exchange',
    text: 'Connect, explore, and thrive with other exchange students worldwide.',
  },
  {
    title: 'Find Study Buddies',
    text: 'Match with students before arriving. Break the ice early!',
  },
  {
    title: 'Discover + Share',
    text: 'Explore favourite spots, donate, or trade items on the go.',
  },
  {
    title: 'Let’s Get Started',
    text: 'Where would you like to begin your journey?',
    isFinal: true,
  },
];

export default function OnboardingScreen({ navigation }) {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = () => {
    swiperRef.current.scrollBy(slides.length - 1 - currentIndex, true);
  };

  const handleGoHome = async () => {
    await AsyncStorage.setItem('onboardingSeen', 'true');
    navigation.replace('AppNavigator');
  };

  const handleGoProfile = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      console.warn('[Onboarding] No authenticated user found');
      return;
    }
  
    await AsyncStorage.setItem('onboardingSeen', 'true');
    navigation.replace('CompleteProfileStep1', { userId: currentUser.uid });
  };

  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      onIndexChanged={setCurrentIndex}
      dotColor="#888"
      activeDotColor="#A8E9DC"
      showsButtons={false}
      index={0}
    >
      {slides.map((slide, i) => (
        <View style={styles.container} key={i}>
          {i < slides.length - 1 && (
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.text}>{slide.text}</Text>

          {slide.isFinal && (
            <View style={styles.finalBtnContainer}>
              <TouchableOpacity onPress={handleGoProfile} style={styles.actionButton}>
                <Text style={styles.actionText}>Complete Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGoHome} style={styles.outlineButton}>
                <Text style={styles.outlineText}>Go to Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 24,
  },
  skipText: {
    color: '#A8E9DC',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  finalBtnContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#A8E9DC',
    padding: 14,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionText: {
    color: '#1e1e1e',
    fontWeight: '600',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#A8E9DC',
    padding: 14,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  outlineText: {
    color: '#A8E9DC',
    fontSize: 16,
  },
});
