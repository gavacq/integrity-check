import {
  Query,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { firebaseApp } from 'utils/firebase';
import { Category } from './useCategories';

export interface Rating {
  id: string;
  name: string;
  value: number;
}

export interface CategoryRating {
  categoryName: string;
  rating: number;
  importance: number;
  notes?: string; // Optional field for additional notes
}

export interface DailyRating {
  userId: string;
  date: Timestamp; // Assuming Date objects for timestamps
  score: number;
  categoryRatings: { [categoryId: string]: CategoryRating };
}

// if dailyRatingId is provided, the function will overwrite the existing document with the same ID
export const saveDailyRating = async (dailyRating: DailyRating, dailyRatingId?: string) => {
  const db = getFirestore(firebaseApp);

  try {
    if (dailyRatingId) {
      const ref = doc(db, 'dailyRatings', dailyRatingId);
      await setDoc(ref, dailyRating);
      console.log('Document updated with ID: ', ref.id);
      return;
    }

    const docRef = await addDoc(collection(db, 'dailyRatings'), dailyRating);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const formatDailyRating = (
  ratings: Record<string, Rating>,
  categories: Record<string, Category>,
  userId: string,
  score: number
) => {
  let dailyRating: DailyRating = {
    userId,
    date: Timestamp.now(),
    score,
    categoryRatings: {},
  };

  for (const [categoryId, rating] of Object.entries(ratings)) {
    const category = categories[categoryId];
    dailyRating.categoryRatings[categoryId] = {
      categoryName: category.name,
      rating: rating.value,
      importance: category.importance,
    };
  }

  return dailyRating;
};

export const getDailyRatings = async (
  userId: string,
  date?: Timestamp
): Promise<Record<string, DailyRating>> => {
  const db = getFirestore(firebaseApp);
  let q: Query | undefined = undefined;
  if (date) {
    // Convert the Timestamp to a JavaScript Date object
    const jsDate = date.toDate();

    // Calculate the start and end of the day
    const dayStart = startOfDay(jsDate);
    const dayEnd = endOfDay(jsDate);

    // Create Firestore Timestamps for the start and end of the day
    const startTimestamp = Timestamp.fromDate(dayStart);
    const endTimestamp = Timestamp.fromDate(dayEnd);

    // Query for documents within the day
    q = query(
      collection(db, 'dailyRatings'),
      where('userId', '==', userId),
      where('date', '>=', startTimestamp),
      where('date', '<', endTimestamp)
    );
  } else {
    q = query(collection(db, 'dailyRatings'), where('userId', '==', userId));
  }
  const querySnapshot = await getDocs(q);
  const dailyRatings = await querySnapshot.docs.reduce(
    (acc, doc) => ({ ...acc, [doc.id]: doc.data() as DailyRating }),
    {}
  );
  return dailyRatings;
};

/**
 * Sets the time of a given date to the start of the day (00:00:00.000).
 * @param {Date} date - The date for which the start of the day is calculated.
 * @returns {Date} - A new Date object set to the start of the day.
 */
export const startOfDay = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
};

/**
 * Sets the time of a given date to the end of the day (23:59:59.999).
 * @param {Date} date - The date for which the end of the day is calculated.
 * @returns {Date} - A new Date object set to the end of the day.
 */
export const endOfDay = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
};
