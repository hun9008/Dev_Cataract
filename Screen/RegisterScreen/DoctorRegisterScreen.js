// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Components/Loader';

const DoctorRegisterScreen = ({ route }) => {
  const { doctortype } = route.params;
  const [doctorName, setdoctorName] = useState('');
  const [doctorNickname, setdoctorNickname] = useState('');
  const [doctorEmail, setdoctorEmail] = useState('');
  const [doctorPassword, setdoctorPassword] = useState('');
  const [doctorPN, setdoctorPN] = useState('');
  const [doctorHospital, setdoctorHospital] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const nicknameInputRef = createRef();
  const pnInputRef = createRef();
  const hospitalInputRef = createRef();

  const handleSubmitButton = () => {
    setErrortext('');
    if (!doctorName) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!doctorEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!doctorNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!doctorPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!doctorPN) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    if (!doctorHospital) {
        alert('근무 중인 병원을 입력해주세요.');
    }
    //Show Loader
    setLoading(true);
    /*
        // Not Null
        "_id": "000000000000000",
        "type": "doctor",
        "email": "blablabla@gmail.com",
        "pwd": "test1234",
        "phone_num": "010-1234-5678",
        "name": "hun",
        "nickname": "PhD",
        "sex": "Male",
        "birth": "2001-01-01",

        // User
        "pet": [{
                "p_name": "TT",
                "p_type": "Dog",
                "p_color": "Black",
                "p_age": "5",
        }]

        // Doctor
        "hospital": "zerozeroHosp"
     */
    const dataToSend = {
      type : doctortype,
      email: doctorEmail,
      pwd: doctorPassword,
      phone_num: doctorPN,
      name: doctorName,
      nickname: doctorNickname,
      hospital: doctorHospital,
    };
    console.log(JSON.stringify(dataToSend, ["type", "email", "pwd", "phone_num", "name", "nickname", "hospital"]));


    fetch('http://118.34.163.142:8000/account/signup/doctor', {
      method: 'POST',
      body: JSON.stringify(dataToSend, ["type", "email", "pwd", "phone_num", "name", "nickname", "hospital"]),
      headers: {
        //Header Defination
        'Content-Type':
        'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson._id) {
          setIsRegistraionSuccess(true);
          console.log(
            '회원가입이 완료되었습니다.'
          );
        } else {
          setErrortext(responseJson.msg);
          console.log('회원가입에 실패하였습니다.');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../Image/success.png')}
          style={{
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(doctorName) => setdoctorName(doctorName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(doctorEmail) => setdoctorEmail(doctorEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(doctorPassword) =>
                setdoctorPassword(doctorPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                nicknameInputRef.current &&
                nicknameInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(doctorNickname) => setdoctorNickname(doctorNickname)}
                underlineColorAndroid="#f000"
                placeholder="Enter Nickname"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  pnInputRef.current && pnInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(doctorPN) => setdoctorPN(doctorPN)}
              underlineColorAndroid="#f000"
              placeholder="Enter Phone Number ex) 010-xxxx-xxxx"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                hospitalInputRef.current && hospitalInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(doctorHospital) =>
                  setdoctorHospital(doctorHospital)
                }
                underlineColorAndroid="#f000"
                placeholder="Enter Hospital"
                placeholderTextColor="#8b9cb5"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
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
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>회원가입</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default DoctorRegisterScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 2,
  },
  buttonStyle: {
    backgroundColor: '#084B8A',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#084B8A',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 14,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});