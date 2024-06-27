import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider, Card } from '@rneui/themed';
import { FAB, Portal, PaperProvider, DefaultTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import { launchCamera } from 'react-native-image-picker';
import { fetchTimeCapsules, fetchPhotos, addPhoto } from './firebaseUtils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backdrop: 'rgba(255, 0, 0, 0.5)',
  },
};

const Home = () => {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [isTimeCapsulePresent, setIsTimeCapsulePresent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  const [coverImage, setCoverImage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email);
      loadTimeCapsules();
    }
  }, []);

  const loadTimeCapsules = async () => {
    const capsules = await fetchTimeCapsules();
    setTimeCapsules(capsules);
    const photos = await fetchPhotos();
    setPhotoCount(photos.length);
    if (photos.length > 0) {
      setCoverImage(photos[0].url);
    }
    setIsTimeCapsulePresent(capsules.length > 0);
  };

  const handleCamera = () => {
    if (photoCount >= 10) {
      Alert.alert('Limit Reached', 'You can only upload up to 10 photos.');
      return;
    }
    launchCamera({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        await uploadImage(source.uri);
        loadTimeCapsules();
      }
    });
  };

  const uploadImage = async (uri) => {
    const user = auth().currentUser;
    const currentDate = moment().format('YYYY-MM-DD');
    if (user) {
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`timeCapsule/${user.uid}/${currentDate}/photos/${filename}`);
      await storageRef.putFile(uri);
      const downloadURL = await storageRef.getDownloadURL();
      await addPhoto(downloadURL);
    }
  };

  const getTimeRemainingUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return midnight - now;
  };

  const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = getTimeRemainingUntilMidnight();
      setCountdown(timeRemaining);
      if (timeRemaining <= 0) {
        clearInterval(interval);
        router.replace('/home'); // Refresh the application
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const createTimeCapsule = () => {
    setState({ open: false });
    router.push('home/timecapsuleData');
  };

  const handleNote = () => {
    Alert.alert('Note', 'This is where you would open a screen to input a note.');
  };

  const handleMicrophone = () => {
    Alert.alert('Microphone', 'This is where you would implement audio recording functionality.');
  };

  const handleViewTimeCapsules = () => {
    router.push('home/TimeCapsulesScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <PaperProvider theme={customTheme}>
        {isTimeCapsulePresent && (
          <View style={styles.greetingContainer}>
            <Avatar
              avatarStyle={styles.avatarStyle}
              size={32}
              rounded
              source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
            />
            <Text style={styles.greetingTxt}>
              Welcome back,{"\n"}
              <Text style={{ color: '#e4732b' }}>
                {userEmail}
              </Text>
            </Text>
          </View>
        )}
        {isTimeCapsulePresent && (
          <View>
            <Divider style={styles.DividerStyle} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.countdownTxt}>
                Time remaining until midnight:
              </Text>
              <Text style={styles.countdownStyle}>
                {formatCountdown(countdown)}
              </Text>
            </View>
            {timeCapsules.map((capsule) => (
              <View key={capsule.id}>
                <Text style={styles.timecapsuleTitle}>{capsule.title}</Text>
                <Text style={styles.timecapsuleSubtext}>{capsule.description}</Text>
                <Divider style={styles.DividerStyle} />
                <Text style={styles.uploadedMediaTitle}>Uploaded Media</Text>
                <View style={styles.cardContainer}>
                  <PhotoCard count={photoCount} coverImage={coverImage} key={`photo-${capsule.id}`} />
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={styles.createPromptContainer}>
          {!isTimeCapsulePresent && (
            <Text style={styles.createPromptTxt}>
              The Stars await,{"\n"}Press the + button to store your memories
            </Text>
          )}
        </View>
        <Portal>
          <FAB.Group
            style={styles.fabContainer}
            fabStyle={{ backgroundColor: '#ff8435' }}
            open={open}
            visible
            color="white"
            icon={open ? 'star-face' : 'plus'}
            actions={[
              ...(isTimeCapsulePresent ? [
                {
                  icon: 'note-plus-outline',
                  label: 'Note',
                  onPress: handleNote,
                  style: { backgroundColor: '#ffc700' },
                },
                {
                  icon: 'microphone',
                  label: 'Microphone',
                  onPress: handleMicrophone,
                  style: { backgroundColor: 'lightblue' },
                },
                {
                  icon: 'camera',
                  label: 'Camera',
                  onPress: handleCamera,
                  style: { backgroundColor: 'lightcoral' },
                },
              ] : []),
              {
                icon: 'folder-outline',
                label: 'View TimeCapsules',
                onPress: handleViewTimeCapsules,
                style: { backgroundColor: '#ff9135' },
              },
              ...(!isTimeCapsulePresent ? [{
                color: 'white',
                icon: 'star-shooting-outline',
                label: 'Create New TimeCapsule',
                onPress: createTimeCapsule,
                style: { backgroundColor: '#ff9135' },
              }] : []),
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                console.log('FAB is open');
              }
            }}
          />
        </Portal>
      </PaperProvider>
    </SafeAreaView>
  );
};

const PhotoCard = ({ count, coverImage }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push('home/Gallery')}>
      <Card containerStyle={styles.card}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>No Image</Text>
          </View>
        )}
        <Text style={styles.text}>Photo</Text>
        <Text style={styles.count}>{count}/10</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPromptTxt: {
    textAlign: 'center',
    color: '#8E8E93',
  },
  fabContainer: {
    paddingBottom: hp('3%'),
    paddingRight: wp('5%'),
  },
  greetingContainer: {
    marginTop: hp('8%'),
    marginLeft: wp('5%'),
    flexDirection: 'row',
  },
  avatarStyle: {
    marginRight: wp('0%'),
  },
  greetingTxt: {
    fontSize: wp('3.5%'),
    marginLeft: wp('3%'),
  },
  DividerStyle: {
    marginTop: hp('2.5%'),
    backgroundColor: '#a4abb4',
    height: 1.3,
    alignSelf: 'center',
    width: wp('85%'),
  },
  countdownTxt: {
    marginLeft: wp('7%'),
    marginTop: hp('3%'),
    fontSize: wp('4%'),
    lineHeight: 20,
  },
  timecapsuleTitle: {
    marginLeft: wp('7%'),
    marginTop: hp('3%'),
    paddingRight: wp('5%'),
    fontSize: wp('5%'),
    lineHeight: 20,
    color: '#e4732b',
  },
  timecapsuleSubtext: {
    marginLeft: wp('7.5%'),
    marginTop: hp('0.2%'),
    lineHeight: 20,
    paddingRight: wp('5%'),
    color: '#8E8E93',
  },
  countdownStyle: {
    marginTop: hp('3%'),
    fontSize: wp('4%'),
    lineHeight: 20,
    color: '#e4732b',
  },
  uploadedMediaTitle: {
    marginLeft: wp('7%'),
    marginTop: hp('3%'),
    fontSize: wp('5%'),
    lineHeight: 20,
  },
  cardContainer: {
    marginTop: hp('1%'),
    marginLeft: wp('2.5%'),
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 0,
    width: 150,
    height: 200,
    marginTop: hp('1%'),
  },
  image: {
    width: '100%',
    height: '75%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '80%',
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 5,
  },
  count: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default Home;