import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
  writeBatch,
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

export const saveDailyRating = async (dailyRating: DailyRating) => {
  const db = getFirestore(firebaseApp);

  try {
    const docRef = await addDoc(collection(db, 'dailyRatings'), dailyRating);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e
  }
};

export const formatDailyRating = (ratings: Record<string, Rating>, categories: Record<string, Category>, userId: string, score: number) => {
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
}
  
