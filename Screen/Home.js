import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

const Home = ({ navigation, route }) => {
    const { userId, userNickname } = route.params || {};
    const [pets, setPets] = useState([]);
    const isFocused = useIsFocused();

    const fetchPets = () => {
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
    };

    useEffect(() => {
        if (isFocused) {
            fetchPets();
        }
    }, [isFocused]);

    const handlePetPress = (p_name) => {
        navigation.navigate('PetInform', { userId, p_name });
    };

    const handleProfilePress = () => {
        navigation.navigate('Mypage', { userNickname });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.myPetText}>My Pet</Text>
                <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
                    <Ionicons name="person-circle-outline" size={40} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.scrollViewWrapper}>
                <ScrollView horizontal contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
                    {pets.map((pet, index) => (
                        <TouchableOpacity key={index} style={[styles.petItem, styles.dropShadow]} onPress={() => handlePetPress(pet.p_name)}>
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
                    <TouchableOpacity style={styles.addPetButton} onPress={() => navigation.navigate('AddPet', { userId })}>
                        <FontAwesome5 name="plus" size={24} color="gray" />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.menuContainer}>
                {/* 첫 번째 줄: 촬영하기와 커뮤니티 */}
                <View style={styles.menuRow}>
                    <TouchableOpacity style={[styles.menuButton, styles.dropShadow, { backgroundColor: '#649054' }]} onPress={() => navigation.navigate('SelectGalleryOrCam', { userId })}>
                        <FontAwesome5 name="camera" size={40} color="white" />
                        <Text style={styles.menuText}>강아지 눈 촬영하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuButton, styles.dropShadow, { backgroundColor: '#A0855B' }]} onPress={() => navigation.navigate('Community', { userId })}>
                        <FontAwesome5 name="users" size={40} color="white" />
                        <Text style={styles.menuText}>커뮤니티</Text>
                    </TouchableOpacity>
                </View>

                {/* 두 번째 줄: 검사 결과 모아보기 */}
                <TouchableOpacity style={[styles.resultButton, styles.dropShadow]} onPress={() => navigation.navigate('PetInform', { userId })}>
                    <FontAwesome5 name="file-alt" size={40} color="black" />
                    <Text style={styles.resultText}>검사 결과 모아보기</Text>
                </TouchableOpacity>

                {/* 세 번째 줄: 가까운 병원 찾기 */}
                <TouchableOpacity style={[styles.hospitalButton, styles.dropShadow]} onPress={() => { /* 버튼 클릭 시 아무 작업도 하지 않음 */ }}>
                    <FontAwesome5 name="hospital" size={40} color="black" />
                    <Text style={styles.hospitalText}>가까운 병원 찾기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    myPetText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileIcon: {
        padding: 10,
    },
    scrollViewWrapper: {
        width: '100%',
        height: 120,
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 20,
        paddingTop: 10,
    },
    petItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    petName: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    addPetButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    menuContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    menuButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        paddingVertical: 15,
        borderRadius: 10,
        marginRight: 10, // 두 버튼 간격
    },
    menuText: {
        marginTop: 10, // 아이콘과 텍스트 사이의 간격
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 15,
        height: 100,
    },
    resultText: {
        marginLeft: 10,
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hospitalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        height: 100,
    },
    hospitalText: {
        marginLeft: 10,
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10, // 안드로이드에서의 그림자 효과
    },
});
