import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PosterScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Movie Posters</Text>
    </View>
  );
};

export default PosterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
