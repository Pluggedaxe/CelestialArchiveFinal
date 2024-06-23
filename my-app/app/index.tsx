import { StyleSheet, View, SafeAreaView, ImageBackground } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from "expo-router";
import React from 'react';

// Use the require directly
const image = require('../assets/images/Splash.jpg');

const Index = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={image} style={styles.backgroundImage}>
        <View style={styles.mainContainer}>
          <Button title='Click me' onPress={() => router.push("/auth/login")} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
