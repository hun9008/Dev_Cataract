import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList } from 'react-native';

const Home = ({ navigation, route }) => {
    const { userId, userNickname } = route.params || {};
    /*
    const [pets, setPets] = useState([]);

    useEffect(() => {
        // Fetch pet data when component mounts
        fetch(`http://cataractserver.hunian.site/${userId}/all_Pets`)
          .then((response) => response.json())
          .then((data) => {
            if (data.pets) {
              setPets(data.pets);
            }
          })
          .catch((error) => console.error(error));
      }, [userId]);

    const renderPetItem = ({ item }) => (
        <View style={styles.petContainer}>
          <Image source={{ uri: item.img }} style={styles.petImage} />
          <Text style={styles.petName}>{item.name}</Text>
        </View>
      );
     */

     /*
         <View style={styles.container}>
           <FlatList
             data={pets}
             renderItem={renderPetItem}
             keyExtractor={(item) => item.id.toString()}
             horizontal={true}
             showsHorizontalScrollIndicator={false}
           />
         </View>
     */

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
