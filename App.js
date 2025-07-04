import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailScreen from "./src/screens/DetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          {/* 탭 네비게이터 */}
          <Stack.Screen
            name="Tabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          {/* 영화 상세 정보 화면 */}
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{ title: "영화 상세 정보" }}
          />
        </Stack.Navigator>

        {/*<BottomTabNavigator />*/}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
