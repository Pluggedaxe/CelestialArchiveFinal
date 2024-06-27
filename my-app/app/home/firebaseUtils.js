<<<<<<< HEAD
// firebaseUtils.js
=======
>>>>>>> c684697fab11d170d7d599d06e43ff524e929b91
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

const getCurrentUser = () => {
  const user = auth().currentUser;
  if (!user) {
    console.error('No authenticated user found.');
    return null;
  }
  return user;
};

const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD');
};

const fetchTimeCapsules = async () => {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }
  const capsules = [];
  const dateRangeDays = 30; // Adjust as needed
  for (let i = -dateRangeDays; i <= dateRangeDays; i++) {
    const date = moment().add(i, 'days').format('YYYY-MM-DD');
    const snapshot = await firestore()
      .collection('timeCapsule')
      .doc(user.uid)
      .collection(date)
      .get();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (moment(data.openDate, 'MM/DD/YY').isSameOrBefore(moment())) {
        capsules.push({ id: doc.id, ...data });
      }
    });
  }
  return capsules.sort((a, b) => moment(a.openDate, 'MM/DD/YY') - moment(b.openDate, 'MM/DD/YY'));
};

const fetchPhotos = async (userId, date) => {
  if (typeof userId !== 'string' || typeof date !== 'string') {
    console.error(`Invalid userId or date: userId = ${userId}, date = ${date}`);
    throw new Error('Invalid userId or date');
  }

  const photos = [];
  try {
    const snapshot = await firestore()
      .collection('timeCapsule')
      .doc(userId)
      .collection(date)
      .doc('UploadedMedia')
      .collection('items')
      .orderBy('createdAt', 'desc')
      .get();

    snapshot.forEach(doc => {
      photos.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Fetched photos for ${userId} on ${date}:`, photos);
  } catch (error) {
    console.error(`Error fetching photos for ${userId} on ${date}:`, error);
    throw error;
  }

  return photos;
};

const addPhoto = async (photoUrl) => {
  const user = getCurrentUser();
  const currentDate = getCurrentDate();
  if (user) {
    await firestore()
      .collection('timeCapsule')
      .doc(user.uid)
      .collection(currentDate)
      .doc('UploadedMedia')
      .collection('items')
      .add({ url: photoUrl, createdAt: new Date() });
  }
};

const addTimeCapsule = async (timeCapsule) => {
  const user = getCurrentUser();
  const currentDate = getCurrentDate();
  if (user) {
    await firestore()
      .collection('timeCapsule')
      .doc(user.uid)
      .collection(currentDate)
      .add(timeCapsule);
  }
};

export { fetchTimeCapsules, fetchPhotos, addPhoto, addTimeCapsule, getCurrentUser, getCurrentDate };
