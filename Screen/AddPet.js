import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
            p_name: petName,
            p_type: petType,
            p_color: petColor,
            p_age: petAge,
            profile_image: imageBase64,
        };

        const url = `http://cataractserver.hunian.site/account/user/pet?user_id=${userId}`;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(petData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    Alert.alert('Failed to add pet');
                    return;
                }
                return response.json();
            })
            .then((responseJson) => {
                Alert.alert('Pet added successfully!');
                navigation.goBack();
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                Alert.alert('Failed to add pet');
            });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {!imageUri && <Ionicons name="person-circle-outline" size={100} color="black" />}
                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}>
                    <Text style={styles.buttonTextStyle}>반려동물 사진 선택</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>이름:</Text>
            <TextInput
                style={styles.input}
                value={petName}
                onChangeText={setPetName}
            />
            <Text style={styles.label}>견종:</Text>
            <TextInput
                style={styles.input}
                value={petType}
                onChangeText={setPetType}
            />
            <Text style={styles.label}>털 색깔:</Text>
            <TextInput
                style={styles.input}
                value={petColor}
                onChangeText={setPetColor}
            />
            <Text style={styles.label}>나이:</Text>
            <TextInput
                style={styles.input}
                value={petAge}
                onChangeText={setPetAge}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonStyle} onPress={handleAddPet}>
                    <Text style={styles.buttonTextStyle}>반려동물 추가</Text>
                </TouchableOpacity>
            </View>
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
        borderRadius: 5, // Optional: rounding input fields
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 50,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    buttonStyle: {
        backgroundColor: '#21610B',
        paddingVertical: 15, // Adjusted padding for height
        paddingHorizontal: 20,
        borderRadius: 30, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
