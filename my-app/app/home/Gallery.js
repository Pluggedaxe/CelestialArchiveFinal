import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { fetchPhotos } from './firebaseUtils';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadImages = async () => {
      const fetchedPhotos = await fetchPhotos();
      setPhotos(fetchedPhotos);
    };
    loadImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gallery</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            {item.url ? (
              <Image source={{ uri: item.url }} style={styles.photo} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}
          </View>
        )}
        numColumns={3}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  photoContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 4,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
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
});
