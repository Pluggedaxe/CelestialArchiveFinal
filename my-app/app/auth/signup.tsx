import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import { Text, Input, Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Divider } from '@rneui/base';
import { router } from "expo-router";
import auth from '@react-native-firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    let valid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    // Validate password (example: minimum 6 characters)
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (valid) {
      // Firebase authentication signUp
      auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('User registered:', userCredential);
          // Optionally, navigate to another screen or show a success message
        })
        .catch((error) => {
          let errorMessage = 'Registration failed. Please check your information and try again.';

          // Check for specific Firebase error codes
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists. Please use a different email.';
          }

          // Display an alert box with the appropriate error message
          Alert.alert(
            'Registration Error',
            errorMessage,
            [{ text: 'OK' }]
          );

          // Optionally log the specific error for internal debugging
          console.debug('Detailed error:', error);
        });
    }

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerTxt}>Create Account</Text>
      <Text style={styles.headerSubTxt}>Register to Get Started</Text>

      <Input
        containerStyle={styles.inputEmail}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
        errorMessage={emailError} // Display email error
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
        errorMessage={passwordError} // Display password error
        errorStyle={styles.errorText}
      />

      <Input
        containerStyle={styles.inputPassword}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Confirm Password'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
        errorMessage={confirmPasswordError} // Display confirm password error
        errorStyle={styles.errorText}
      />

      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#e48448', '#d3533e'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        buttonStyle={styles.registerBtn}
        title='REGISTER'
        onPress={() => {
          handleRegister();
        }}
        onPressIn={() => {
          router.push("/auth/login");
        }}
      />

      <Divider style={styles.DividerStyle} />

      <View style={styles.signInContainer}>
        <Text style={styles.signInTxt}>Already have an account?</Text>
        <Text style={styles.signInBtn} onPress={() => router.push("/auth/login")}> Sign In</Text>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTxt: {
    fontSize: wp('9%'),
    marginTop: hp('20%'),
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
  registerBtn: {
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
  signInContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp('7%'),
  },
  signInTxt: {
    alignSelf: 'center',
    lineHeight: 20,
  },
  signInBtn: {
    color: '#f47a17',
  },
});
