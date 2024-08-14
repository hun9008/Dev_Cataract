import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';

export default function FeedDetail({ route, navigation }) {
  const { po_id } = route.params;  // Access po_id from route params
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesVisible, setLikesVisible] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://cataractserver.hunian.site/posting/feed${po_id}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post details');
        }

        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post details:', error);
        Alert.alert('Error', 'Failed to load post details.');
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [po_id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>No post found</Text>
      </View>
    );
  }

  // Assuming the API returns an array of posts, you may need to adjust this depending on the API response structure
  const { po_detail, user_id, image = [], pet, final_predict, comment_list = [], like_list = [] } = post[0] || {};
  const { u_nickname, profile_image } = post[1] || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profile_image ? (
          <Image source={{ uri: `data:image/png;base64,${profile_image}` }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.nickname}>{u_nickname}</Text>
      </View>

      <Text style={styles.postDetail}>{po_detail}</Text>

      {image.length > 0 && (
        <Image source={{ uri: `data:image/png;base64,${image[0]}` }} style={styles.postImage} />
      )}

      <Text style={styles.petInfo}>Pet: {pet.p_name} ({pet.p_type}, {pet.p_color}, {pet.p_age} years old)</Text>

      {final_predict && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>
            Prediction: {final_predict.predicted_class} ({(final_predict.probability * 100).toFixed(2)}%)
          </Text>
          <Text style={styles.predictionDate}>Date: {final_predict.date}</Text>
        </View>
      )}

      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={() => setLikesVisible(true)}>
          <Text style={styles.likesText}>Likes: {like_list.length}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.commentsHeader}>Comments:</Text>
      {comment_list.length > 0 ? (
        comment_list.map((comment) => (
          <View key={comment._id} style={styles.commentItem}>
            <Text style={styles.commentUserId}>User: {comment.u_nickname}</Text>
            <Text style={styles.commentText}>{comment.co_detail}</Text>
          </View>
        ))
      ) : (
        <Text>No comments yet.</Text>
      )}

      {/* Modal for showing the list of users who liked the post */}
      <Modal
        visible={likesVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLikesVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.likesListContainer}>
            <Text style={styles.likesListTitle}>Liked by:</Text>
            <FlatList
              data={like_list}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => <Text style={styles.likesListItem}>{item.user_id}</Text>}
            />
            <Button title="Close" onPress={() => setLikesVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postDetail: {
    fontSize: 16,
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  petInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  predictionContainer: {
    marginBottom: 20,
  },
  predictionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  predictionDate: {
    fontSize: 14,
    color: '#555',
  },
  likesContainer: {
    marginBottom: 20,
  },
  likesText: {
    fontSize: 16,
    color: '#007BFF',
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  commentUserId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  commentText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  likesListContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  likesListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  likesListItem: {
    fontSize: 16,
    paddingVertical: 5,
  },
});
