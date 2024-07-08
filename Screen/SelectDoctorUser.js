// Import React and Component
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const SelectDoctorUser = ({ navigation }) => {
  const handleDoctorPress = () => {
    navigation.navigate('DoctorRegisterScreen');
  };

  const handleUserPress = () => {
    navigation.navigate('UserRegisterScreen');
  };

  return (
    <View style={styles.mainBody}>
      <Text style={styles.titleText}>Select Your Role</Text>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleDoctorPress}>
        <Text style={styles.buttonTextStyle}>Doctor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleUserPress}>
        <Text style={styles.buttonTextStyle}>User</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectDoctorUser;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonStyle: {
    backgroundColor: '#084B8A',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#084B8A',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 25,
    width: '80%',
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
