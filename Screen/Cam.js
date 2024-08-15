import React, { useState, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera/legacy';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Cam({ navigation, route }) {
  const { userId, selectedPet } = route.params || {};
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>카메라 사용을 위한 권한이 필요합니다</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>권한 허용</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, exif: false };
      const photo = await cameraRef.current.takePictureAsync(options);
      setPhoto(photo);

      let dataToSend = { img: photo.base64, user_id: userId, pet_name: selectedPet };

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
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>카메라 전환</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureButtonText}>사진 촬영</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // 전체 내용을 상단으로 올림
    paddingTop: 50, // 상단 여백을 조정하여 위치를 더 위로 올림
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#21610B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center', // 버튼을 중앙에 배치
  },
  permissionButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
  captureButton: {
    backgroundColor: '#21610B',
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  captureButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
});
