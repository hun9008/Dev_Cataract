import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SelectGalleryOrCam from './Screen/SelectGalleryOrCam';
import Cam from './Screen/Cam';
import Gallery from './Screen/Gallery';
import CameraResult from './Screen/CameraResult';
import Login from './Screen/Login';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SelectGalleryOrCam" component={SelectGalleryOrCam} />
        <Stack.Screen name="Cam" component={Cam} />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="CameraResult" component={CameraResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
