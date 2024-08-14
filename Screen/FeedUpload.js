import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function FeedUpload({ navigation, route }) {
  const { userId } = route.params || {};
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState({ lime: null, gradCam: null });
  const [predictResults, setPredictResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    if (userId) {
      const url = `http://cataractserver.hunian.site/account/user/all_pet?user_id=${userId}`;
      fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((responseJson) => {
          setPets(responseJson);
          if (!selectedPet) {
            setModalVisible(true);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [userId]);

  const handlePetSelect = (petName) => {
    setSelectedPet(petName);
    setModalVisible(false);
    fetchPetResults(petName);
  };

  const fetchPetResults = (petName) => {
    const url = `http://cataractserver.hunian.site/account/user/pet?user_id=${userId}&pet_name=${petName}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPredictResults(data.predict);
      })
      .catch((error) => {
        console.error('Error fetching pet results:', error);
      });
  };

  const handleResultSelect = (result) => {
    setSelectedResult(result);
    setSelectedImages({
      lime: `data:image/png;base64,${result.lime[0].image_encoded}`,
      gradCam: `data:image/png;base64,${result.GradCam[0].image_encoded}`,
    });
    setResultModalVisible(false);
  };

  const handlePostUpload = () => {
    if (!selectedResult || !selectedPet) {
      Alert.alert('Error', 'Please select a pet and a result before uploading.');
      return;
    }

    const url = `http://cataractserver.hunian.site/posting/feed?user_id=${userId}&predict_id=${selectedResult._id}&pet_name=${selectedPet}`;

    const postData = {
      po_detail: postText,
      image: [],
      like_list: [],
      comment_list: [],
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        Alert.alert('Success', 'Post uploaded successfully');
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error uploading post:', error);
        Alert.alert('Error', 'Failed to upload post');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Write your post..."
        multiline
        value={postText}
        onChangeText={setPostText}
      />

      {selectedResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Class: {selectedResult.predicted_class}</Text>
          <Text style={styles.resultText}>Date: {selectedResult.date}</Text>
          <Image source={{ uri: selectedImages.lime }} style={styles.resultImage} />
          <Image source={{ uri: selectedImages.gradCam }} style={styles.resultImage} />
        </View>
      )}

      <Button title="결과지 가져오기" onPress={() => setResultModalVisible(true)} />

      {selectedPet && (
        <Text style={styles.selectedPetText}>Selected Pet: {selectedPet}</Text>
      )}

      {selectedPet && (
        <TouchableOpacity style={styles.selectAgainButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.selectAgainButtonText}>Select Pet Again</Text>
        </TouchableOpacity>
      )}

      <Button title="업로드하기" onPress={handlePostUpload} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {pets.map((pet, index) => (
              <TouchableOpacity
                key={index}
                style={styles.petItem}
                onPress={() => handlePetSelect(pet.p_name)}
              >
                {pet.profile_image ? (
                  <Image
                    style={styles.image}
                    source={{ uri: `data:image/png;base64,${pet.profile_image}` }}
                  />
                ) : (
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name="dog" size={50} color="black" style={styles.icon} />
                  </View>
                )}
                <Text style={styles.petName}>{pet.p_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={resultModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setResultModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {predictResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.resultItem}
                onPress={() => handleResultSelect(result)}
              >
                <Text style={styles.resultText}>Class: {result.predicted_class}</Text>
                <Text style={styles.resultText}>Date: {result.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  petItem: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 120,
    height: 120,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  petName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedPetText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectAgainButton: {
    backgroundColor: '#000', // Button color
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  selectAgainButtonText: {
    color: 'white',
    fontSize: 16,
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultImage: {
    width:150,
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
});

