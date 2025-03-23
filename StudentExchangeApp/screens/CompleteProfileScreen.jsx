// screens/CompleteProfileScreen.jsx
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import countries from 'world-countries';
import ISO6391 from 'iso-639-1';
import styles from '../styles/completeProfileStyles';

DropDownPicker.setMode('SCROLLVIEW');

const hobbiesList = ['Crochet', 'Movies', 'Yoga', 'Painting', 'Cooking', 'Reading'];
const interestList = ['Accommodation', 'Sightseeing', 'Language Exchange', 'Student Deals'];

export default function CompleteProfileScreen({ route, navigation }) {
  const { userId } = route.params;

  const [studyChoice, setStudyChoice] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [hostCountry, setHostCountry] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [countryItems, setCountryItems] = useState([]);
  const [languageItems, setLanguageItems] = useState([]);
  const [studyItems, setStudyItems] = useState([
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Business', value: 'Business' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Art', value: 'Art' },
    { label: 'Other', value: 'Other' },
  ]);

  const [studyOpen, setStudyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);

  useEffect(() => {
    const countryList = countries.map((country) => ({
      label: country.name.common,
      value: country.name.common,
    })).sort((a, b) => a.label.localeCompare(b.label));
    setCountryItems(countryList);

    const languageList = ISO6391.getAllNames().map((name) => ({
      label: name,
      value: name,
    })).sort((a, b) => a.label.localeCompare(b.label));
    setLanguageItems(languageList);
  }, []);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    if (!studyChoice || !preferredLanguage || !hostCountry || !homeCountry) {
      Alert.alert('Please complete all fields');
      return;
    }

    await updateDoc(doc(db, 'users', userId), {
      studyChoice,
      preferredLanguage,
      hostCountry,
      homeCountry,
      hobbies: selectedHobbies,
      interests: selectedInterests,
    });

    Alert.alert('Profile completed!');
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complete Your Profile</Text>

      <View style={{ zIndex: 5000 }}>
        <DropDown
          label="Study Choice"
          items={studyItems}
          value={studyChoice}
          setValue={setStudyChoice}
          open={studyOpen}
          setOpen={setStudyOpen}
          setItems={setStudyItems}
          searchable={true}
          searchablePlaceholder="Search or type a study choice"
          disableBorderRadius={false}
          showArrowIcon={true}
          allowCustomValue={true} // Allow typing "Other"
        />
      </View>

      <View style={{ zIndex: 4000 }}>
        <DropDown
          label="Preferred Language"
          items={languageItems}
          value={preferredLanguage}
          setValue={setPreferredLanguage}
          open={languageOpen}
          setOpen={setLanguageOpen}
          setItems={setLanguageItems}
          searchable={true}
          searchablePlaceholder="Search language"
        />
      </View>

      <View style={{ zIndex: 3000 }}>
        <DropDown
          label="Host Country"
          items={countryItems}
          value={hostCountry}
          setValue={setHostCountry}
          open={hostOpen}
          setOpen={setHostOpen}
          setItems={setCountryItems}
          searchable={true}
          searchablePlaceholder="Search country"
        />
      </View>

      <View style={{ zIndex: 2000 }}>
        <DropDown
          label="Home Country"
          items={countryItems}
          value={homeCountry}
          setValue={setHomeCountry}
          open={homeOpen}
          setOpen={setHomeOpen}
          setItems={setCountryItems}
          searchable={true}
          searchablePlaceholder="Search country"
        />
      </View>

      <Text style={styles.subHeader}>Select Your Hobbies</Text>
      <View style={styles.grid}>
        {hobbiesList.map((hobby) => (
          <TouchableOpacity
            key={hobby}
            style={[styles.tag, selectedHobbies.includes(hobby) && styles.tagSelected]}
            onPress={() => toggleSelection(hobby, selectedHobbies, setSelectedHobbies)}>
            <Text style={styles.tagText}>{hobby}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>Select Your Interests</Text>
      <View style={styles.grid}>
        {interestList.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[styles.tag, selectedInterests.includes(interest) && styles.tagSelected]}
            onPress={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}>
            <Text style={styles.tagText}>{interest}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Finish</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: '#FF5252', marginTop: 15 }]}
        onPress={() => {
          signOut(auth).then(() => {
            navigation.replace('LoginScreen');
          });
        }}
      >
        <Text style={styles.submitText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function DropDown({ label, items, value, setValue, open, setOpen, setItems, ...props }) {
  return (
    <View style={{ marginBottom: 16, width: '100%' }}>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        dropDownDirection="BOTTOM"
        autoScroll={true}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={`Select ${label}`}
        containerStyle={{ marginTop: 4 }}
        {...props}
      />
    </View>
  );
}
