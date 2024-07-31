import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Mypage = ({ navigation, route }) => {
  const userNickname = route.params.userNickname;
  const handleLogout = () => {
    // Perform any logout operations here (e.g., clearing user data)
    navigation.navigate('Login'); // Navigate to Login page
  };

  return (
    <View style={styles.container}>
    {userNickname && <Text>User Nickname: {userNickname}</Text>}
      <Text style={styles.text}>Mypage</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Mypage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#21610B',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
