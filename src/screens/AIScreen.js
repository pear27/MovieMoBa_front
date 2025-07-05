import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AIScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Movie Top 3</Text>
    </View>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
