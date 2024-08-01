import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Community = ({ navigation, route }) => {
    const userId = route.params.userId;

    const navigateToFeedUpload = () => {
        // Navigate to FeedUpload page
        navigation.navigate('FeedUpload', {userId});
      };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={navigateToFeedUpload}>
      <Text style={styles.buttonText}>게시물 올리기</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Community;
