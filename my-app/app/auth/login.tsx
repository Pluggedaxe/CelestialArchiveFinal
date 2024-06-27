import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, ToastAndroid } from 'react-native';
import { Text, Input, Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Divider } from '@rneui/base';
import { router } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Signin
GoogleSignin.configure({
  webClientId: '116019692853-v0sk76vvh2vpr9gnb94vfgao7msmfgjt.apps.googleusercontent.com',
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    let valid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    // Validate password
    if (!password || password === null) {
      setPasswordError('Please enter a valid password.');
      valid = false;
    }

    if (valid) {
      // Firebase authentication signIn
      auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('User signed in:', userCredential);
          router.push("/home/home")
          ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
          setEmail('')
          setPassword('')
        })
        .catch((error) => {
          // Display an alert box with a generic message
          Alert.alert(
            'Authentication Error',
            'Authentication failed. Please check your credentials and try again.',
            [{ text: 'OK' }]
          );

          // Optionally log the specific error for internal debugging
          console.debug('Detailed error:', error);
        });
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the user's ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('Signed in with Google:', userCredential);
      router.push("/home/home")
      ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert(
        'Google Sign-In Error',
        'Failed to sign in with Google. Please try again later.',
        [{ text: 'OK' }]
      );

      // Optionally log the specific error for internal debugging
      console.debug('Detailed error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerTxt}>Welcome Back</Text>
      <Text style={styles.headerSubTxt}>Login to Your Account</Text>

      <Input
        containerStyle={styles.inputEmail}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
        errorMessage={emailError}
        errorStyle={styles.errorText}
      />

      <Input
        containerStyle={styles.inputPassword}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
        errorMessage={passwordError}
        errorStyle={styles.errorText}
      />

      <Text style={styles.forgotPasswordTxt} onPress={() => router.push('/auth/forgotpassword')}>Forgot Password?</Text>

      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#e48448', '#d3533e'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        buttonStyle={styles.loginBtn}
        title='LOG IN'
        onPress={handleLogin}
      />

      <Divider style={styles.DividerStyle} />

      <Button
        buttonStyle={styles.googleBtn}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#e48448', '#d3533e'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        radius="sm"
        type="solid"
        onPress={onGoogleButtonPress}
      >
        <Icon
          name="google"
          type="font-awesome-5"
          color="white"
          size={22}
          style={styles.googleIcon}
        /> Sign in With Google
      </Button>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpTxt}>Don't have an account?</Text>
        <Text style={styles.signUpBtn} onPress={() => router.push('/auth/signup')}> Sign Up</Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTxt: {
    fontSize: wp('9%'),
    marginTop: hp('25%'),
    marginLeft: wp('10%'),
    lineHeight: 36,
  },
  headerSubTxt: {
    marginTop: 3,
    marginLeft: wp('11%'),
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 20,
  },
  inputEmail: {
    width: wp('85%'),
    alignSelf: 'center',
    marginTop: hp('5%'),
  },
  inputPassword: {
    width: wp('85%'),
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    borderRadius: 6,
    backgroundColor: '#e1e1e1',
    paddingLeft: 10,
  },
  inputTextStyle: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  forgotPasswordTxt: {
    marginTop: 0,
    marginRight: wp('10%'),
    marginBottom: hp('5%'),
    color: '#f47a17',
    textAlign: 'right',
    lineHeight: 20,
  },
  loginBtn: {
    borderRadius: 6,
    alignSelf: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    width: wp('70%'),
  },
  DividerStyle: {
    marginTop: hp('4%'),
    backgroundColor: '#d3d5da',
    height: 1,
    alignSelf: 'center',
    width: wp('85%'),
  },
  googleBtn: {
    alignSelf: 'center',
    marginTop: hp('3%'),
    width: wp('70%'),
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp('7%'),
  },
  signUpTxt: {
    alignSelf: 'center',
    lineHeight: 20,
  },
  signUpBtn: {
    color: '#f47a17',
  },
});
