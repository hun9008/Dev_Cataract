import React, {useState, useEffect, useCallback} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View, Text } from 'react-native';

import Login from './Screen/Login';
import Register from './Screen/Register';
import SelectUserOrDoctor from './Screen/SelectUserOrDoctor';
import Home from './Screen/Home';
import Mypage from './Screen/Mypage';
import Community from './Screen/Community';
import SelectGalleryOrCam from './Screen/SelectGalleryOrCam';
import Cam from './Screen/Cam';
import Gallery from './Screen/Gallery';
import CameraResult from './Screen/CameraResult';
import AddPet from './Screen/AddPet';
import PetInform from './Screen/PetInform';
import FeedUpload from './Screen/FeedUpload';
import FeedDetail from './Screen/FeedDetail';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="SelectGalleryOrCam" component={SelectGalleryOrCam} />
      <Stack.Screen name="Cam" component={Cam} />
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="CameraResult" component={CameraResult} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SelectUserOrDoctor" component={SelectUserOrDoctor} />
        <Stack.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen name="AddPet" component={AddPet} />
        <Stack.Screen name="PetInform" component={PetInform} />
        <Stack.Screen name="Mypage" component={Mypage} />
        <Stack.Screen name="FeedUpload" component={FeedUpload} />
        <Stack.Screen name="FeedDetail" component={FeedDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}