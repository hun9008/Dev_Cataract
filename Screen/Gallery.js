import { useState } from 'react';
import { Button, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Gallery({ navigation, route }) {
  const { userId, selectedPet } = route.params || {};
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async () => {
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64);

      let dataToSend = {
        img: result.assets[0].base64,
        user_id: userId,
        pet_name: selectedPet,
      };
      console.log(
        JSON.stringify(dataToSend).slice(0, 100) + '...' + JSON.stringify(dataToSend).slice(-100)
      );

      fetch('http://cataractmodel.hunian.site/inference', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          navigation.navigate('CameraResult', {
            Lime: responseJson.lime,
            Vit: responseJson.vit,
            Predict: responseJson.predicted_class,
            Probability: responseJson.probability,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      {!status?.granted && (
        <Text style={styles.permissionText}>갤러리 접근을 위한 권한이 필요합니다</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>갤러리에서 이미지 선택</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // 전체 내용을 상단으로 올림
    paddingTop: 20, // 추가적인 상단 여백
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#21610B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10, // 버튼과 상단 텍스트 사이의 간격 조정
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
