import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NowShowingScreen from '../screens/NowShowingScreen';
import Top3Screen from '../screens/Top3Screen';
import PosterScreen from '../screens/PosterScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="NowShowing" component={NowShowingScreen} />
      <Tab.Screen name="Top3" component={Top3Screen} />
      <Tab.Screen name="Posters" component={PosterScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
