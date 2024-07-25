import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function CameraResult({ route }) {
  const { imageBase64 } = route.params;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: `data:image/png;base64,${imageBase64}` }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
