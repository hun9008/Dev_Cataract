import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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

    const handlePetPress = (p_name) => {
        navigation.navigate('PetInform', { userId, p_name });
    };

    return (
        <View style={styles.container}>
            <View style={styles.scrollViewWrapper}>
                <ScrollView horizontal contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
                    {pets.map((pet, index) => (
                        <TouchableOpacity key={index} style={styles.petItem} onPress={() => handlePetPress(pet.p_name)}>
                            {pet.profile_image ? (
                                <Image
                                    style={styles.image}
                                    source={{ uri: `data:image/png;base64,${pet.profile_image}` }}
                                />
                            ) : (
                                <View style={styles.iconWrapper}>
                                    <FontAwesome5 name="dog" size={40} color="black" />
                                </View>
                            )}
                            <Text style={styles.petName}>{pet.p_name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Remove Home Screen text */}
            {/* <Text>Home Screen</Text> */}

            {userNickname && <Text>User Nickname: {userNickname}</Text>}

            {/* 펫 등록하기 버튼 */}
            <TouchableOpacity
                style={styles.longButton}
                onPress={() => navigation.navigate('AddPet', { userId })}>
                <Text style={styles.buttonText}>Pet 등록하기</Text>
            </TouchableOpacity>

            {/* 카메라와 커뮤니티 버튼 */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.rectButton}
                    onPress={() => navigation.navigate('SelectGalleryOrCam', { userId })}>
                    <Text style={styles.buttonText}>카메라</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rectButton}
                    onPress={() => navigation.navigate('Community', { userId })}>
                    <Text style={styles.buttonText}>커뮤니티</Text>
                </TouchableOpacity>
            </View>

            {/* 나머지 버튼 */}
            <View style={styles.buttonColumn}>
                <TouchableOpacity
                    style={styles.normalButton}
                    onPress={() => navigation.navigate('PetInform', { userId })}>
                    <Text style={styles.buttonText}>검사 결과 확인하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.normalButton}
                    onPress={() => navigation.navigate('Mypage', { userNickname })}>
                    <Text style={styles.buttonText}>마이페이지</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 35, // Adjusted paddingTop to reduce top margin
    },
    scrollViewWrapper: {
        width: '100%',
        height: 120,
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 20,
        paddingLeft: 10,
        height: 120,
    },
    petItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    petName: {
        marginTop: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    longButton: {
        width: '80%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#21610B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    rectButton: {
        width: 150, // Adjusted width
        height: 300, // Adjusted height
        borderRadius: 10,
        backgroundColor: '#21610B',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5, // Adjusted spacing between buttons
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '80%',
    },
    buttonColumn: {
        width: '80%',
        marginTop: 20,
        alignItems: 'stretch',
    },
    normalButton: {
        height: 50,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#21610B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
