// Home.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const navigateToCamera = () => {
    navigation.navigate('SelectGalleryOrCam');
  };

  const navigateToCommunity = () => {
    navigation.navigate('Community');
  };

  const navigateToMypage = () => {
    navigation.navigate('Mypage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <TouchableOpacity style={styles.communityButton} onPress={navigateToCommunity}>
        <Ionicons name="people" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cameraButton} onPress={navigateToCamera}>
        <AntDesign name="camerao" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mypageButton} onPress={navigateToMypage}>
        <Ionicons name="person" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  communityButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  mypageButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default Home;
