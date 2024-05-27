import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where, writeBatch } from "firebase/firestore";
import { firebaseApp } from "utils/firebase";

export interface Category {
  name: string;
  importance: number;
  emoji: string;
  id: string;
}

export const getCategories = async (userId: string) => {
  const db = getFirestore(firebaseApp);
  const categoriesQuery = query(collection(db, 'categories'), where('userId', '==', userId));

  const querySnapshot = await getDocs(categoriesQuery);
  const allCategories = await querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
  return allCategories
}

export const addCategory = async (category: { name: string, importance: number, emoji: string, userId: string, id?: string}) => {
  const db = await getFirestore(firebaseApp);
  if (category.id) {
    const ref = doc(db, 'categories', category.id)
    setDoc(ref, { name: category.name, importance: category.importance, emoji: category.emoji}, { merge: true });
    console.log("Document updated with ID: ", ref.id);
    return;
  }

  const ref = await addDoc(collection(db, "categories"), {
      name: category.name,
      importance: category.importance,
      emoji: category.emoji,
      userId: category.userId
  });
  console.log("Document added with ID: ", ref.id);
}

export const updateCategories = async (categories: Record<string, Category>, userId: string) => {
  const db = getFirestore();
  const batch = writeBatch(db);

  const updatedCategories: Record<string, Category> = {};

  for (const [key, category] of Object.entries(categories)) {
    if (key === 'tempKey') {
      // Handle new category
      const newDocRef = doc(collection(db, 'categories'));
      batch.set(newDocRef, {
        name: category.name,
        importance: category.importance,
        emoji: category.emoji,
        userId,
      });
      updatedCategories[newDocRef.id] = { ...category, id: newDocRef.id };
    } else {
      // Handle existing category
      const categoryRef = doc(db, 'categories', category.id);
      batch.update(categoryRef, {
        name: category.name,
        importance: category.importance,
        emoji: category.emoji,
      });
      updatedCategories[category.id] = { ...category };
    }
  }

  try {
    await batch.commit();
    console.log('Batched updates successful');
    return updatedCategories;
  } catch (error) {
    console.error('Error updating categories:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  const db = getFirestore();

  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    console.log('Document successfully deleted');
  } catch (error) {
    console.error('Error removing document:', error);
    throw error;
  }
}