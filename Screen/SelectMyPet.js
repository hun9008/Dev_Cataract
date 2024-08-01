import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView, Button, Alert  } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const SelectMyPet = ({route}) => {
    const userId = route.params.userId;

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
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            }
        }, [userId]);

        const handlePetSelect = (petName) => {
            setSelectedPet(petName);
            setModalVisible(false);
        };

        return (
            <View style={styles.container}>
                <Button title="Select My Pet" onPress={() => setModalVisible(true)} />
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
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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

    export default SelectMyPet;