import React from 'react';
import { StyleSheet, View, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Use LinearGradient from expo-linear-gradient
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const image = require('../assets/images/Splash.jpg');

const Index = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={image} style={styles.backgroundImage}>

        <Text style={styles.taglineTxt}>Your History,</Text>
        <Text style={styles.taglineTxtSub}>Written in the Stars</Text>

        <View style={styles.mainContainer}>
          <Button
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ['#e48448', '#d3533e'],
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },
            }}
            buttonStyle={styles.loginBtn}
            title='SIGN IN'
            onPress={() => router.push("/auth/login")}
          />
          <Text style={styles.createAccountBtn} onPress={() => router.push("/auth/signup")}>Create an Account</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('42%'),
  },

  loginBtn: {
    borderRadius: 13,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    width: wp('70%'),
  },

  taglineTxt: {
    fontSize: wp('8%'),
    color: 'white',
    alignSelf: 'flex-start',
    marginTop: hp('15%'),
    marginLeft: wp('7%'),
  },

  taglineTxtSub: {
    fontSize: wp('8%'),
    color: 'white',
    alignSelf: 'flex-start',
    marginTop: hp('0%'),
    marginLeft: wp('7%'),
    fontStyle: 'italic'
  },

  createAccountBtn: {
    marginTop: hp('2%'),
    fontSize: wp('3.4%'),
    color: 'white',
    textDecorationLine: 'underline'
  },


});
