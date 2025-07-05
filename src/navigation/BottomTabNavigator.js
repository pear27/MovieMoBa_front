import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NowShowingScreen from "../screens/NowShowingScreen";
import PosterScreen from "../screens/PosterScreen";
import AIScreen from "../screens/AIScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="상영작" component={NowShowingScreen} />
      <Tab.Screen name="추천작" component={PosterScreen} />
      <Tab.Screen name="AI추천" component={AIScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
