import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from './src/screens/GalleryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Gallery" 
          component={GalleryScreen} 
          options={{ title: 'Image Gallery with Object Detection' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
