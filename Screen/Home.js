import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

const Home = ({ navigation, route }) => {
    const { userId, userNickname } = route.params || {};

    const [pets, setPets] = useState([]);

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
                    console.log('Response JSON:', responseJson);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [userId]);

    return (
        <View style={styles.container}>
            <View style={styles.scrollViewWrapper}>
                <ScrollView horizontal contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
                    {pets.map((pet, index) => (
                        <View key={index} style={styles.petItem}>
                            <Image
                                style={styles.image}
                                source={{ uri: `data:image/png;base64,${pet.predict.lime[0].image_encoded}` }}
                            />
                            <Text style={styles.petName}>{pet.p_name}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Text>Home Screen</Text>
            {userNickname && <Text>User Nickname: {userNickname}</Text>}
            <Button title="Pet 등록하기" onPress={() => navigation.navigate('AddPet', { userId })} />
            <Button title="커뮤니티" onPress={() => navigation.navigate('Community')} />
            <Button title="카메라" onPress={() => navigation.navigate('SelectGalleryOrCam')} />
            <Button title="검사 결과 확인하기" onPress={() => navigation.navigate('PetInform', { userId })} />
            <Button title="마이페이지" onPress={() => navigation.navigate('Mypage', { userNickname })} />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 70,
    },
    scrollViewWrapper: {
        width: '100%', // Ensures the ScrollView spans the full width of the screen
        height: 100, // Sets the desired height
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 20,
        paddingLeft: 10,
        height: 100,
    },
    petItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50, // Makes the image circular
        borderWidth: 1,
        borderColor: '#ccc',
    },
    petName: {
        marginTop: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
