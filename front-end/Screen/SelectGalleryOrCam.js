import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Image, Text, ScrollView, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function SelectGalleryOrCam({ navigation, route }) {
  const { userId } = route.params || {}; // Get userId from route params
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          // Automatically show the modal if no pet is selected
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
    // Notify user of selection
    Alert.alert('Pet Selected', `You selected: ${petName}`);
  };

  const handleSelectAgain = () => {
    setModalVisible(true); // Reopen the modal to select a pet again
  };

  return (
    <View style={styles.container}>
      {/* Always visible buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate('Cam', { userId, selectedPet })}
        >
          <Text style={styles.buttonTextStyle}>사진 촬영하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate('Gallery', { userId, selectedPet })}
        >
          <Text style={styles.buttonTextStyle}>갤러리에서 가져오기</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render pet selection UI */}
      {selectedPet ? (
        <>
          <Text style={styles.selectedPetText}>반려동물 이름: {selectedPet}</Text>
          <TouchableOpacity style={styles.selectAgainButton} onPress={handleSelectAgain}>
            <Text style={styles.selectAgainButtonText}>다시 선택하기</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {/* Modal for pet selection */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  buttonStyle: {
    backgroundColor: '#21610B',
    padding: 15,
    borderRadius: 30, // 모서리를 둥글게
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 16,
  },
  selectedPetText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectAgainButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  selectAgainButtonText: {
    color: 'white',
    fontSize: 16,
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
  icon: {
    borderRadius: 50,
  },
  petName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
