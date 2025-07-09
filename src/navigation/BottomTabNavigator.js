import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import NowShowingScreen from "../screens/NowShowingScreen";
import PosterScreen from "../screens/PosterScreen";
import AIScreen from "../screens/AIScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '상영중') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === '추천작') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === '모바픽') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: "#141414",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 25,
        },
        tabBarStyle: {
          backgroundColor: "#141414",
          borderTopColor: "#222",
          height: "10%",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#e50914",
        tabBarInactiveTintColor: "#b3b3b3",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="상영중" component={NowShowingScreen} />
      <Tab.Screen name="추천작" component={PosterScreen} />
      <Tab.Screen name="모바픽" component={AIScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
