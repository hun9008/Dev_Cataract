import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Home = ({ navigation, route }) => {
    const { userId, userNickname } = route.params || {};

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            {userNickname && <Text>User Nickname: {userNickname}</Text>}
            <Button title="Pet 등록하기" onPress={() => navigation.navigate('AddPet', { userId })} />
            <Button title="커뮤니티" onPress={() => navigation.navigate('Community')} />
            <Button title="카메라" onPress={() => navigation.navigate('SelectGalleryOrCam')} />
            <Button title="검사 결과 확인하기" onPress={() => navigation.navigate('PetInform', { userId })} />
            <Button title="마이페이지" onPress={() => navigation.navigate('Mypage', {userNickname})} />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
