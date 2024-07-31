import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Ionicons from '@expo/vector-icons/Ionicons';

const AddPet = ({ route, navigation }) => {
    const { userId } = route.params || {};

    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('');
    const [petColor, setPetColor] = useState('');
    const [petAge, setPetAge] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);

    const handleAddPet = async () => {
        if (!petName || !petType || !petColor || !petAge) {
            Alert.alert('All fields are required!');
            return;
        }

        const petData = {
            user: userId,
            pet: {
                p_name: petName,
                p_type: petType,
                p_color: petColor,
                p_age: petAge,
                image: imageBase64, // Add the base64 image data here
            }
        };

        try {
            const response = await fetch('http://cataractserver.hunian.site/account/user/pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(petData),
            });

            if (response.ok) {
                Alert.alert('Pet added successfully!');
                navigation.goBack(); // Navigate back to the previous screen
            } else {
                Alert.alert('Failed to add pet');
            }
        } catch (error) {
            Alert.alert('Error:', error.message);
        }
    };

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
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {!imageUri && <Ionicons name="person-circle-outline" size={100} color="black" />}
                {imageUri && (
                                    <Image source={{ uri: imageUri }} style={styles.image} />
                                  )}
            </View>
            <Button title="Pick Profile Picture" onPress={pickImage} />
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                value={petName}
                onChangeText={setPetName}
            />
            <Text style={styles.label}>Type:</Text>
            <TextInput
                style={styles.input}
                value={petType}
                onChangeText={setPetType}
            />
            <Text style={styles.label}>Color:</Text>
            <TextInput
                style={styles.input}
                value={petColor}
                onChangeText={setPetColor}
            />
            <Text style={styles.label}>Age:</Text>
            <TextInput
                style={styles.input}
                value={petAge}
                onChangeText={setPetAge}
            />
            <Button title="Add Pet" onPress={handleAddPet} />
        </View>
    );
};

export default AddPet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 50,
    },
    iconContainer: {
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        marginBottom: 20, // Add space below the icon if needed
    },
});
