import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function FeedUpload({ navigation, route }) {
  const [feeds, setFeeds] = useState([]);
  const userId = route.params.userId; // Retrieve userId from route params if available

  useEffect(() => {
    fetch('http://cataractserver.hunian.site/posting/feed_all')
      .then(response => response.json())
      .then(responseJson => {
        setFeeds(responseJson);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const renderFeedItem = ({ item }) => {
    // Safely access the properties and provide default values
    const likeList = item.like_list || [];
    const commentList = item.comment_list || [];
    const truncatedDetail = item.po_detail && item.po_detail.length > 20 ? `${item.po_detail.substring(0, 20)}...` : item.po_detail || '';
    const likeCount = likeList.length;
    const commentCount = commentList.length;

    // Collect up to 3 images
    const images = [
      item.image?.[0]?.image_encoded, // Assuming item.image is an array and taking the first image
      item.pet?.predict?.lime?.[0]?.image_encoded, // First lime image
      item.pet?.predict?.vit?.[0]?.image_encoded // First vit image
    ].filter(Boolean); // Remove undefined/null values

    return (
      <TouchableOpacity
        style={styles.feedItem}
        onPress={() => navigation.navigate('FeedDetail', { po_id: item.po_id })}
      >
        <View style={styles.header}>
          {item.profile_image ? (
            <Image
              style={styles.profileImage}
              source={{ uri: `data:image/png;base64,${item.profile_image}` }}
            />
          ) : (
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle-outline" size={50} color="black" />
            </View>
          )}
          <Text style={styles.nickname}>{item.u_nickname}</Text>
          <Text style={styles.date}>{item.pet?.predict?.date || 'No date'}</Text>
        </View>
        <Text style={styles.description}>{truncatedDetail}</Text>
        <View style={styles.imagesRow}>
          {images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              style={styles.feedImage}
              source={{ uri: `data:image/png;base64,${image}` }}
            />
          ))}
        </View>
        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="heart-outline" size={16} color="black" />
            <Text style={styles.iconText}>{likeCount}</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="comment" size={16} color="black" />
            <Text style={styles.iconText}>{commentCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleUploadPost = () => {
    navigation.navigate('FeedUpload', { userId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPost}>
        <Text style={styles.uploadButtonText}>게시물 올리기</Text>
      </TouchableOpacity>
      <FlatList
        data={feeds}
        renderItem={renderFeedItem}
        keyExtractor={item => item.po_id.toString()}
        contentContainerStyle={styles.feedList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  uploadButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#A0855B',
    padding: 15,
    borderRadius: 5,
    zIndex: 10, // Ensure button is on top of other elements
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  feedList: {
    paddingTop: 70, // Adjust padding to ensure the FlatList does not overlap with the button
  },
  feedItem: {
    backgroundColor: '#A6C09D',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 10,
  },
  nickname: {
    flex: 1,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  description: {
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});
