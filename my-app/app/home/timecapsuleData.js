// TimeCapsuleData.js
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import { Text, Input, Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Divider } from '@rneui/base';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { useTimeCapsules } from './TimeCapsuleContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimeCapsuleData = ({ title = '', description = '', openDate = '' }) => {
  const [titleState, setTitle] = useState(title);
  const [descriptionState, setDescription] = useState(description);
  const [openDateState, setOpenDate] = useState(openDate);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [openDateError, setOpenDateError] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();
  const { addTimeCapsule } = useTimeCapsules();

  const handleCreateTimeCapsule = async () => {
    let valid = true;

    setTitleError('');
    setDescriptionError('');
    setOpenDateError('');

    if (!titleState) {
      setTitleError('Please enter a title.');
      valid = false;
    }

    if (!descriptionState) {
      setDescriptionError('Please enter a description.');
      valid = false;
    }

    if (!openDateState) {
      setOpenDateError('Please select a date.');
      valid = false;
    }

    if (valid) {
      const timeCapsuleData = {
        title: titleState,
        description: descriptionState,
        openDate: moment(openDateState).format('MM/DD/YY'),
        createdAt: moment().format('YYYY-MM-DD'),
      };

      await addTimeCapsule(timeCapsuleData);

      Alert.alert('Success', 'Time capsule created successfully!');
      router.push({ pathname: '/home/home', params: { created: true } });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setOpenDate(date);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerTxt}>Create Time Capsule</Text>
      <Text style={styles.headerSubTxt}>Store your memories</Text>
      <Icon
        name="arrow-back"
        type="ionicon"
        color="#000"
        onPress={() => router.back()}
        containerStyle={styles.backIcon}
      />
      <Input
        containerStyle={styles.inputEmail}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Title'
        value={titleState}
        onChangeText={setTitle}
        leftIcon={{ type: 'ionicon', name: 'bookmark-outline' }}
        errorMessage={titleError}
        errorStyle={styles.errorText}
      />
      <Input
        containerStyle={styles.inputDescription}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Description'
        value={descriptionState}
        onChangeText={setDescription}
        leftIcon={{ type: 'ionicon', name: 'document-text-outline' }}
        errorMessage={descriptionError}
        errorStyle={styles.errorText}
        multiline={true}
      />
      <Input
        containerStyle={styles.inputPassword}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputTextStyle}
        placeholder='Open Date'
        value={openDateState ? moment(openDateState).format('MM/DD/YY') : ''}
        editable={false}
        leftIcon={{ type: 'ionicon', name: 'calendar-outline' }}
        rightIcon={
          <View style={{ marginRight: 10 }}>
            <Icon
              name="open-outline"
              type="ionicon"
              color="#000"
              onPress={showDatePicker}
            />
          </View>
        }
        errorMessage={openDateError}
        errorStyle={styles.errorText}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date(moment().add(1, 'days').startOf('day'))}
      />
      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#e48448', '#d3533e'],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        buttonStyle={styles.registerBtn}
        title='CREATE'
        onPress={handleCreateTimeCapsule}
      />
      <Divider style={styles.DividerStyle} />
    </SafeAreaView>
  );
};

export default TimeCapsuleData;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTxt: {
    fontSize: wp('9%'),
    marginTop: hp('30%'),
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
  inputDescription: {
    width: wp('85%'),
    alignSelf: 'center',
    marginTop: hp('1%'),
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
  backIcon: {
    position: 'absolute',
    top: hp('10%'),
    left: wp('8%'),
  },
});
