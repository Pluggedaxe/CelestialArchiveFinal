import React from 'react';
import { StyleSheet, View, SafeAreaView, ImageBackground, Dimensions, Platform, StatusBar } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Use LinearGradient from expo-linear-gradient
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const image = require('../../assets/images/Splash.jpg');

const Login = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerTxt}>Welcome Back</Text>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  headerTxt: {

  }

});
