import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';

import WheelPicker from 'react-native-wheely';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const years = Array.from({ length: 125 }, (_, i) => (1900 + i).toString());
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const UserRegisterScreen = ({ route }) => {
  const usertype = route.params.type;

  // State variables
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPN, setUserPN] = useState('');
  const [userSex, setUserSex] = useState('');
  const [userPet, setUserPet] = useState([]);
  const [errortext, setErrortext] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedDay, setSelectedDay] = useState('1');
  const [hospital, setHospital] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const nicknameInputRef = createRef();
  const pnInputRef = createRef();
  const sexInputRef = createRef();
  const birthInputRef = createRef();
  const hospitalInputRef = createRef();

  const hasNotSameError = () => userPassword !== confirmPassword;

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!userEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!userNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!userPN) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    if (!userSex) {
      alert('성별을 선택해주세요.');
      return;
    }
    if (usertype === 'doctor' && !hospital) {
      alert('근무 중인 병원을 입력해주세요.');
      return;
    }

    const dataToSend = {
      u_email: userEmail,
      u_pwd: userPassword,
      u_PN: userPN,
      u_birth: `${selectedYear}-${selectedMonth}-${selectedDay}`,
      u_sex: userSex,
      u_name: userName,
      u_nickname: userNickname,
      pet: userPet,
      type: usertype,
      // image: imageBase64,
    };

    if (usertype === 'doctor') {
      dataToSend.d_hospital = hospital;
    }

    console.log(JSON.stringify(dataToSend));

    fetch('http://cataractserver.hunian.site/account/signup/user', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson._id) {
          setIsRegistraionSuccess(true);
          console.log('회원가입이 완료되었습니다.');
        } else {
          setErrortext(responseJson.msg);
          console.log('회원가입에 실패하였습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isRegistraionSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
        <Text style={styles.successTextStyle}>Registration Successful</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonTextStyle}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        {currentPage === 1 && (
          <>
            <View style={styles.iconContainer}>
              {!imageUri && <Ionicons name="person-circle-outline" size={100} color="black" />}
              {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
            <Button title="Pick Profile Picture" onPress={pickImage} />
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={setUserName}
                placeholder="Enter Name"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={setUserEmail}
                placeholder="Enter Email"
                placeholderTextColor="#8b9cb5"
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={setUserPassword}
                placeholder="Enter Password"
                placeholderTextColor="#8b9cb5"
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={() => nicknameInputRef.current && nicknameInputRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#8b9cb5"
                secureTextEntry={true}
                blurOnSubmit={false}
              />
              {hasNotSameError() && (
                <Text style={styles.errorTextStyle}>입력한 비밀번호랑 일치하지 않지롱</Text>
              )}
            </View>
            <View style={styles.ButtonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => setCurrentPage(2)}
            >
              <Text style={styles.buttonTextStyle}>다음</Text>
            </TouchableOpacity>
            </View>
          </>
        )}

        {currentPage === 2 && (
          <>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={setUserNickname}
                placeholder="Enter Nickname"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() => pnInputRef.current && pnInputRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={setUserPN}
                placeholder="Enter Phone Number"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() => sexInputRef.current && sexInputRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.birthPickerContainer}>
              <WheelPicker
                style={styles.wheelPicker}
                selectedIndex={years.indexOf(selectedYear)}
                options={years}
                onChange={(index) => setSelectedYear(years[index])}
              />
              <WheelPicker
                style={styles.wheelPicker}
                selectedIndex={months.indexOf(selectedMonth)}
                options={months}
                onChange={(index) => setSelectedMonth(months[index])}
              />
              <WheelPicker
                style={styles.wheelPicker}
                selectedIndex={days.indexOf(selectedDay)}
                options={days}
                onChange={(index) => setSelectedDay(days[index])}
              />
            </View>
            <View style={styles.sexPickerContainer}>
              <View style={styles.checkBoxContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={userSex === 'Male'}
                  onValueChange={() => setUserSex(userSex === 'Male' ? '' : 'Male')}
                  color={userSex === 'Male' ? '#084B8A' : undefined}
                />
                <Text style={styles.checkboxText}>Male</Text>
              </View>
              <View style={styles.checkBoxContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={userSex === 'Female'}
                  onValueChange={() => setUserSex(userSex === 'Female' ? '' : 'Female')}
                  color={userSex === 'Female' ? '#084B8A' : undefined}
                />
                <Text style={styles.checkboxText}>Female</Text>
              </View>
            </View>
            {usertype === 'doctor' && (
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={setHospital}
                  placeholder="Enter Hospital"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
              </View>
            )}
            {errortext !== '' && (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            )}
            <View style={styles.ButtonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => setCurrentPage(1)}
            >
              <Text style={styles.buttonTextStyle}>이전</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitButton}
            >
              <Text style={styles.buttonTextStyle}>회원가입</Text>
            </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
  );
};

export default UserRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  ButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    width: 100,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 50,
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
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxText: {
    marginRight: 10,
    marginTop: 5,
    fontSize: 15,
    color: '#8b9cb5',
  },
  birthPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 80,
    marginRight: 80,
    marginTop: 20,
  },
  wheelPicker: {
    width: 100,
    height: 100,
  },
  sexPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  sexButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: '#084B8A',
  },
  sexButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 50,
  },
});
