import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Divider } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { fetchTimeCapsules } from './firebaseUtils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TimeCapsulesScreen = () => {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadTimeCapsules = async () => {
      const capsules = await fetchTimeCapsules();
      setTimeCapsules(capsules);
    };
    loadTimeCapsules();
  }, []);

  const handlePress = (capsule) => {
    router.push({
      pathname: 'home/TimeCapsuleDetailScreen',
      params: { capsuleId: capsule.id, date: capsule.createdAt },
    });
  };

  return (
    <View style={styles.container}>
      {timeCapsules.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            It seems the time hasn't come yet,{"\n"}the stars will arrive someday
          </Text>
        </View>
      ) : (
        <FlatList
          data={timeCapsules}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.TouchableOpacity}>
              <Card>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Divider style={styles.divider} />
                <Text style={styles.viewDetails}>View Details</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default TimeCapsulesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  TouchableOpacity: {
    marginTop: hp('2%'),
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    textAlign: 'center',
    color: '#8E8E93',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  divider: {
    marginVertical: 20,
  },
  viewDetails: {
    fontSize: 14,
    color: '#e4732b',
  },
});
