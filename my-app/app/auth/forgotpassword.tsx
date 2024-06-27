import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Text, Input, Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = () => {
    // Reset errors
    setEmailError('');

    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Send password reset email
    auth().sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          'Password Reset',
          'A password reset link has been sent to your email.',
          [{ text: 'OK' }]
        );
        setEmail('')
        router.push('/auth/login');
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          'Failed to send password reset email. Please try again later.',
          [{ text: 'OK' }]
        );

        console.debug('Detailed error:', error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <Icon
        name="arrow-back"
        type="ionicon"
        color="#000"
        onPress={() => router.back()} // Handle back navigation
        containerStyle={styles.backIcon}
      />

      <Text style={styles.headerTxt}>Forgot Password</Text>
      <Text style={styles.headerSubTxt}>Enter your email to reset your password</Text>

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

      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#e48448', '#d3533e'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        buttonStyle={styles.resetBtn}
        title='RESET PASSWORD'
        onPress={handleResetPassword} // Handle the password reset
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTxt: {
    fontSize: wp('9%'),
    marginTop: hp('5%'),
    marginBottom: hp('2%'),
    lineHeight: 36,
    textAlign: 'center',
  },
  headerSubTxt: {
    marginBottom: hp('5%'),
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 20,
    textAlign: 'center',
  },
  inputEmail: {
    width: wp('85%'),
    marginBottom: hp('3%'),
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
  resetBtn: {
    borderRadius: 6,
    alignSelf: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    width: wp('70%'),
  },

  backIcon: {
    position: 'absolute',
    top: hp('10%'),
    left: wp('10%'),
  }
});
