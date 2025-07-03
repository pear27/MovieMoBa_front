import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NowShowingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Now Showing Movies</Text>
    </View>
  );
};

export default NowShowingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
