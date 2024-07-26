// Import React and Component
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const SelectDoctorUser = ({ navigation }) => {
  const handleDoctorPress = () => {
    navigation.navigate('Register', { type: 'doctor' });
  };

  const handleUserPress = () => {
    navigation.navigate('Register', { type: 'user' });
  };

  return (
    <View style={styles.mainBody}>
      <View style={styles.buttonContainer}>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: '#084B8A',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#084B8A',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    width: '45%',
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
