import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Top3Screen = () => {
  return (
    <View style={styles.container}>
      <Text>Movie Top 3</Text>
    </View>
  );
};

export default Top3Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
