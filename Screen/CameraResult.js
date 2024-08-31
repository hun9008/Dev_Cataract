import React from 'react';
import { View, Image, StyleSheet,Text, TouchableOpacity } from 'react-native';

export default function CameraResult({ navigation, route }) {
  const { Lime, Vit, Predict, Probability } = route.params || {};

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: `data:image/png;base64,${Lime}` }}
      />
      <Image
          style={styles.image}
          source={{ uri: `data:image/png;base64,${Vit}` }}
        />
      <Text>Predict Result: {Predict}</Text>
      <Text>Predict Probability : {Probability}</Text>
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buttonTextStyle: {
    color: '#000000',
    paddingVertical: 10,
    fontSize: 16,
  },
});
