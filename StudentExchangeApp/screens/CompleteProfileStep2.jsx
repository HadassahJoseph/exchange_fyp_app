// screens/CompleteProfileStep2.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/completeProfileStyles';
import countries from 'world-countries';

DropDownPicker.setMode('SCROLLVIEW');

export default function CompleteProfileStep2({ navigation, route }) {
  const { studyChoice, preferredLanguage, userId } = route.params;


  const [hostCountry, setHostCountry] = useState('');
  const [homeCountry, setHomeCountry] = useState('');

  const [hostOpen, setHostOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([]);

  useEffect(() => {
    const countryList = countries.map((country) => ({
      label: country.name.common,
      value: country.name.common,
    })).sort((a, b) => a.label.localeCompare(b.label));
    setCountryItems(countryList);
  }, []);

  const handleNext = () => {
    if (!hostCountry || !homeCountry) {
      alert('Please select both host and home countries.');
      return;
    }

    navigation.navigate('CompleteProfileStep3', {
      userId,   
      studyChoice,
      preferredLanguage,
      hostCountry,
      homeCountry
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step 2: Country Info</Text>

      <View style={{ zIndex: 1000 }}>
        <Text style={styles.label}>Host Country</Text>
        <DropDownPicker
          open={hostOpen}
          value={hostCountry}
          items={countryItems}
          setOpen={setHostOpen}
          setValue={setHostCountry}
          setItems={setCountryItems}
          placeholder="Select Host Country"
          searchable={true}
        />
      </View>

      <View style={{ zIndex: 500, marginTop: 20 }}>
        <Text style={styles.label}>Home Country</Text>
        <DropDownPicker
          open={homeOpen}
          value={homeCountry}
          items={countryItems}
          setOpen={setHomeOpen}
          setValue={setHomeCountry}
          setItems={setCountryItems}
          placeholder="Select Home Country"
          searchable={true}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
