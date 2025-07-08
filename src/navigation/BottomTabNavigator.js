import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NowShowingScreen from "../screens/NowShowingScreen";
import PosterScreen from "../screens/PosterScreen";
import AIScreen from "../screens/AIScreen";

const Tab = createBottomTabNavigator();

const tabBarOptions = {
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
    height: "15%",
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
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="상영작" component={NowShowingScreen} />
      <Tab.Screen name="추천작" component={PosterScreen} />
      <Tab.Screen name="AI추천" component={AIScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
