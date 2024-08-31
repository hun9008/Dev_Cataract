import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const Mypage = ({ navigation, route }) => {
  const userNickname = route.params.userNickname;
  const userId = route.params.userId; // Assuming userId is also passed in route params
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    // Perform any logout operations here (e.g., clearing user data)
    navigation.navigate('Login'); // Navigate to Login page
  };

  const handleDeleteAccount = () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password.');
      return;
    }

    fetch('http://cataractserver.hunian.site/account/delete/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }), // Send userId and password
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          Alert.alert('Success', 'Your account has been deleted.');
          navigation.navigate('Login'); // Navigate to Login page
        } else {
          Alert.alert('Error', responseJson.message || 'Failed to delete account.');
        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.nicknameContainer}>
        {userNickname && <Text style={styles.nicknameText}>사용자 닉네임: {userNickname}</Text>}
      </View>

      {/* Password Input Field */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>회원탈퇴하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Mypage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // 위에서부터 시작하도록 설정
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  nicknameContainer: {
    width: '100%',
    backgroundColor: '#21610B', // 버튼과 동일한 배경색 적용
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  nicknameText: {
    fontSize: 18,
    color: '#FFFFFF', // 닉네임 텍스트를 흰색으로 변경
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#21610B',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    flex: 1, // 버튼 크기를 균등하게 분배
    marginHorizontal: 5, // 버튼 간의 간격을 위해 추가
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
