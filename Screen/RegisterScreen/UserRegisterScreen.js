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
  Button,
  FlatList,
} from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import WheelPicker from 'react-native-wheely';
import Loader from '../Components/Loader';

const years = Array.from({ length: 125 }, (_, i) => (1900 + i).toString()); // 1900부터 2024까지의 배열 생성
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const UserRegisterScreen = ({ route }) => {
  const usertype = route.params.type;
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [userPN, setUserPN] = useState('');
  const [userSex, setUserSex] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [userPet, setUserPet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState('2024'); // 선택된 연도 상태
  const [selectedMonth, setSelectedMonth] = useState('1'); // 선택된 월 상태
  const [selectedDay, setSelectedDay] = useState('1'); // 선택된 일 상태

  const [hospital, sethospital] = useState('');

  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const nicknameInputRef = createRef();
  const pnInputRef = createRef();
  const sexInputRef = createRef();
  const birthInputRef = createRef();

  const hasNotSameError = () => {
      return userPassword !== confirmPassword;
    };

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
    }
    if (!userSex) {
        alert('성별을 선택해주세요.');
    }
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
    //Show Loader
    setLoading(true);

   const dataToSend = {
     role : usertype,
     u_email: userEmail,
     u_pwd: userPassword,
     u_PN: userPN,
     u_birth: `${selectedYear}-${selectedMonth}-${selectedDay}`,
     u_sex: userSex,
     u_name: userName,
     u_nickname: userNickname,
     pet : userPet,
     d_hospital : hospital,
   };
    console.log(JSON.stringify(dataToSend));

    fetch('http://cataractserver.hunian.site/account/signup/user', {
      method: 'POST',
      body: JSON.stringify(dataToSend, ["type", "u_email", "u_pwd", "U_PN", "name", "nickname", "sex", "birth", "d_hospital"]),
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
              onChangeText={(UserName) => setUserName(UserName)}
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
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              rules={{
                  required: true,
                  pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
              }}
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
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
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
                onChangeText={(confirmPassword) =>
                 setconfirmPassword(confirmPassword)
                }
                underlineColorAndroid="#f000"
                placeholder="Confirm Password"
                placeholderTextColor="#8b9cb5"
                secureTextEntry={true}
                blurOnSubmit={false}
              />
              {hasNotSameError() ? (
                <Text style={styles.errorTextStyle}>
                  입력한 비밀번호랑 일치하지 않지롱
                </Text>
              ) : null}
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserNickname) => setUserNickname(UserNickname)}
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
              onChangeText={(UserPN) => setUserPN(UserPN)}
              underlineColorAndroid="#f000"
              placeholder="Enter Phone Number"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                sexInputRef.current && sexInputRef.current.focus()
              }
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
          <View style={styles.SectionStyle}>
              <CheckBox
                style={styles.checkBox}
                disabled={false}
                value={userSex === 'Male'}
                onValueChange={() => setUserSex('Male')}
              />
              <Text style={styles.label}>Male</Text>
              <CheckBox
                style={styles.checkBox}
                disabled={false}
                value={userSex === 'Female'}
                onValueChange={() => setUserSex('Female')}
              />
              <Text style={styles.label}>Female</Text>
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
export default UserRegisterScreen;

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
  checkBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
    },
    checkBox: {
      marginRight: 5,
    },
    label: {
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
        width: 20,
        height: 100,
      },
});