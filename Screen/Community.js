// Community.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Community = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [likeList, setLikeList] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    if (!selectedImage || !description) {
      Alert.alert("Please select an image and enter a description.");
      return;
    }

    /*
    {
      "post": {
        "po_detail": "string",
        "image": [],
        "like_list": [],
        "predict": {
          "predicted_class": "string",
          "probability": 0,
          "all_probability": [],
          "lime": []
        }
      },
      "user": {
        "u_email": "string",
        "u_pwd": "string",
        "u_PN": "string",
        "u_birth": "string",
        "u_sex": "string",
        "u_name": "string",
        "u_nickname": "string",
        "pet": [],
        "d_hospital": "string" 선택
      }
    }
    */

    let dataToSend = {
        post: {
            po_detail: description,
            image: result.assets[0].base64,
            like_list : likeList,
            predict : {

            }
        }
    };

    fetch('http://cataractserver.hunian.site/posting/feed   ', {
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>게시물 올리기</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
      {selectedImage && (
        <TextInput
          style={styles.input}
          placeholder="게시물 설명을 입력하세요..."
          value={description}
          onChangeText={setDescription}
        />
      )}
      {selectedImage && (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadPost}>
          <Text style={styles.uploadButtonText}>업로드</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Community;
