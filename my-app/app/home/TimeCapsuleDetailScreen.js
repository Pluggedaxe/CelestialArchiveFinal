import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text, Card, Divider } from '@rneui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchTimeCapsules, fetchPhotos } from './firebaseUtils';
import auth from '@react-native-firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TimeCapsuleDetailScreen = () => {
  const [capsule, setCapsule] = useState(null);
  const [photos, setPhotos] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { capsuleId, date } = route.params;

  useEffect(() => {
    const loadCapsuleDetails = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          console.error('No user logged in');
          return;
        }

        console.log(`Fetching capsule details for userId: ${user.uid}, date: ${date}`);
        if (typeof user.uid !== 'string' || typeof date !== 'string') {
          console.error(`Invalid userId or date: userId = ${user.uid}, date = ${date}`);
          return;
        }

        const capsules = await fetchTimeCapsules();
        const capsuleData = capsules.find(capsule => capsule.id === capsuleId);
        setCapsule(capsuleData);

        const fetchedPhotos = await fetchPhotos(user.uid, date);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error('Error loading capsule details:', error);
      }
    };
    loadCapsuleDetails();
  }, [capsuleId, date]);

  if (!capsule) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading capsule details. Please try again later.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPhoto = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capsule.title}</Text>
      <Text style={styles.description}>{capsule.description}</Text>
      <Divider style={styles.divider} />
      <Text style={styles.uploadedMediaTitle}>Uploaded Media</Text>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeCapsuleDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: hp('5%'),
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 10,
  },
  uploadedMediaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: wp('2%'),
  },
  card: {
    width: wp('28%'),
    borderRadius: 10,
    overflow: 'hidden',
    padding: 0,
    marginHorizontal: wp('1%'),
  },
  image: {
    width: '100%',
    height: wp('28%'),
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#ff8435',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: hp('20%'),
  },
  flatListContent: {
    paddingBottom: hp('10%'),
  },
});
