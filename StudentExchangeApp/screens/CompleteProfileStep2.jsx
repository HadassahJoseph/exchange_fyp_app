import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
      homeCountry,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Step 2: Country Info</Text>

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
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          selectedItemLabelStyle={styles.selectedItemLabelStyle}
        />

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
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownTextStyle}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          selectedItemLabelStyle={styles.selectedItemLabelStyle}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
          <Text style={styles.submitText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
