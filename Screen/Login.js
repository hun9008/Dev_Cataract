// Import React and Component
import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//import AsyncStorage from '@react-native-async-storage/async-storage';
//import Loader from './Components/Loader';

const Login = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
//  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('이메일 형식이 아닙니다.');
      return;
    }
    if (!userPassword) {
      alert('비밀번호 형식을 확인해주세요.');
      return;
    }
//    setLoading(true);

    let dataToSend = { u_email: userEmail, u_pwd: userPassword };
    console.log('Data to send:', JSON.stringify(dataToSend)); // 수정된 부분: 디버깅 출력 추가

    fetch('http://cataractserver.hunian.site/account/login/user', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        // Header Definition
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // Hide Loader
//        setLoading(false);
        console.log('Response JSON:', responseJson); // 수정된 부분: 디버깅 출력 추가
        // If server response message same as Data Matched
        if (responseJson._id) {
          navigation.navigate('SelectGalleryOrCam', {
            _id: responseJson._id,
            u_nickname: responseJson.u_nickname
          });
        } else {
          setErrortext(responseJson.msg);
          console.log('입력하신 아이디나 비밀번호가 존재하지 않습니다');
        }
      })
      .catch((error) => {
        // Hide Loader
//        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="dog" size={100} color='#D3D3D3' />
        </View>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Email" //dummy@abc.com
                placeholderTextColor="#D3D3D3"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={userEmail} // 수정된 부분: value 속성 추가
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                placeholder="Password" //12345
                placeholderTextColor="#D3D3D3"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>로그인</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('SelectUserOrDoctor')}>
              회원가입하기
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
    alignContent: 'center',
  },
  iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 60, // 아이콘 아래에 여유 공간 추가
    },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#D3D3D3',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#8B4513',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#000000',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#D3D3D3',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#D3D3D3',
  },
  registerTextStyle: {
    color: '#D3D3D3',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
