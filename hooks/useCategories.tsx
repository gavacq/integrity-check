// import { useState, useEffect, useReducer } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp } from "utils/firebase";

export interface Category {
  name: string;
  weight: number;
  emoji: string;
  id: string;
}

export const getCategories = async () => {
  // Use this function to setup your DB
  const db = getFirestore(firebaseApp);

  // Open the database
  // const db = await openDB('MyDatabase', 1); // Replace with your database name and version

  // Read all categories from the store
  // const tx = db.transaction('categories', 'readonly'); // Replace 'categories' with your actual store name
  // const store = tx.objectStore('categories');
  const querySnapshot = await getDocs(collection(db, 'categories'));
  const allCategories = await querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
  return allCategories
}

// const initialState = {
//   data: [],
//   loading: true,
//   error: null,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SUCCESS':
//       return { ...state, data: action.payload, loading: false };
//     case 'ERROR':
//       return { ...state, error: action.payload, loading: false };
//     default:
//       return state;
//   }
// }

// const useCategories = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   useEffect(() => {
//     const unsubscribe = firebase.firestore().collection('categories')
//       .onSnapshot(snapshot => {
//         const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         dispatch({ type: 'SUCCESS', payload: categories });
//       }, error => {
//         dispatch({ type: 'ERROR', payload: error });
//       });

//     return () => unsubscribe();
//   }, []);

//   const createCategory = async (newCategory) => {
//     try {
//       await firebase.firestore().collection('categories').add(newCategory);
//       dispatch({ type: 'SUCCESS', payload: [...state.data, newCategory] });
//     } catch (err) {
//       console.error("Error creating document:", err);
//       dispatch({ type: 'ERROR', payload: err });
//       throw err;
//     }
//   };

//   const updateCategory = async (id, updatedCategory) => {
//     try {
//       await firebase.firestore().collection('categories').doc(id).update(updatedCategory);
//       const updatedCategories = state.data.map(category => {
//         if (category.id === id) {
//           return { ...category, ...updatedCategory };
//         }
//         return category;
//       });
//       dispatch({ type: 'SUCCESS', payload: updatedCategories });
//     } catch (err) {
//       console.error("Error updating document:", err);
//       dispatch({ type: 'ERROR', payload: err });
//       throw err;
//     }
//   }

//   const deleteCategory = async (id) => {
//     try {
//       await firebase.firestore().collection('categories').doc(id).delete();
//       const updatedCategories = state.data.filter(category => category.id !== id);
//       dispatch({ type: 'SUCCESS', payload: updatedCategories });
//     } catch (err) {
//       console.error("Error deleting document:", err);
//       dispatch({ type: 'ERROR', payload: err });
//       throw err;
//     }
//   }

//   // Add similar functions for update and delete

//   return {...state, createCategory, updateCategory, deleteCategory};
// };
