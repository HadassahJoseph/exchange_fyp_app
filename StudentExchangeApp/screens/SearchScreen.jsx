// SearchScreen.js (Refactored skeleton)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import styles from '../styles/SearchStyles';
import ConnectionsTab from './ConnectionsTab';
import AccommodationTab from './AccommodationTab';
import MapTab from './MapTab';

export default function SearchScreen() {
  const [tab, setTab] = useState('connections');

  const renderTabButton = (label) => (
    <TouchableOpacity style={styles.tab} onPress={() => setTab(label)}>
      <Text style={[styles.tabText, tab === label && styles.activeTabText]}>{label}</Text>
      {tab === label && <View style={styles.activeTabUnderline} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>      
      <View style={styles.tabContainer}>
        {renderTabButton('connections')}
        {renderTabButton('accommodation')}
        {renderTabButton('map')}
      </View>

      {tab === 'connections' && <ConnectionsTab />}
      {tab === 'accommodation' && <AccommodationTab />}
      {tab === 'map' && <MapTab />}
    </SafeAreaView>
  );
}
