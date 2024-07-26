import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function SelectGalleryOrCam({ navigation, route }) {
  const { _id, u_nickname } = route.params;

  return (
    <View style={styles.container}>
      <Button
        title="사진 촬영하기"
        onPress={() => navigation.navigate('Cam')}
      />
      <Button
        title="갤러리에서 가져오기"
        onPress={() => navigation.navigate('Gallery')}
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
});
