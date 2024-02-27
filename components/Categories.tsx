'use client'
import { useEffect, useState } from 'react';
import EmojiPicker, { Emoji } from 'emoji-picker-react'
import { getFirestore, collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { firebaseApp } from 'utils/firebase';
import { Category, getCategories } from 'hooks/useCategories';
import { useAuth } from 'providers/AuthContext';

async function addCategory(category: { name: string, weight: number, emoji: string, userId: string, id?: string}) {
  const db = await getFirestore(firebaseApp);
  if (category.id) {
    const ref = doc(db, 'categories', category.id)
    setDoc(ref, { name: category.name, weight: category.weight, emoji: category.emoji}, { merge: true });
    console.log("Document updated with ID: ", ref.id);
    return;
  }

  const ref = await addDoc(collection(db, "categories"), {
      name: category.name,
      weight: category.weight,
      emoji: category.emoji,
      userId: category.userId
  });
  console.log("Document added with ID: ", ref.id);
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newEmoji, setNewEmoji] = useState('❓');
  const [upsertError, setUpsertError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newKey, setNewKey] = useState<string | undefined>(undefined)
  const { currentUser } = useAuth();


  useEffect(() => {
    getCategories(currentUser?.uid || '').then((categories) => {
      setCategories(categories);
    })
  }, []);


 const handleAddCategory = async () => {
    try {
      await addCategory({
        name: newName,
        weight: parseInt(newWeight),
        emoji: newEmoji,
        userId: currentUser?.uid || '',
        id: newKey
      });
    } catch (error) {
      console.error('Error adding category', error);
      setUpsertError('Error adding category: ' + error);
    }
    
    setNewKey(undefined);
    setNewName('');
    setNewWeight('');
    setShowInputs(false);
    const allCategories = await getCategories(currentUser?.uid || '');

    setCategories(allCategories);
  };

  const onEmojiClick = (event) => {
    setNewEmoji(event.emoji);
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };
  
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowEmojiPicker(false);
    }
  };

  const handleEditCategory = (category) => {
    setNewEmoji(category.emoji);
    setNewName(category.name);
    setNewWeight(category.weight);
    setNewKey(category.id);
    setShowInputs(true);
  }

  const HandleClickAddCategory = async () => {
    setShowInputs(!showInputs);
    setUpsertError('');
  }

  return (
    <div className='flex flex-col mt-4 w-2/3'>
      {!showInputs && (<table className='text-lunar-green-300 border-collapse'>
        <thead>
          <tr className='border-b border-lunar-green-200'>
            <th className='w-2/3 text-left'>Name</th>
            <th className='w-1/2 text-left'>Weight</th>
          </tr>
        </thead>
        <tbody className='text-lunar-green-100'>
          {categories.map((category, index) => (
      <tr key={index} className='border-b border-lunar-green-200 h-12' onClick={() => handleEditCategory(category)}>
        <td className='border-r border-lunar-green-200'>{category.emoji + ' ' + category.name}</td>
        <td className='pl-2'>{category.weight}</td>
      </tr>
          ))}
        </tbody>
      </table>)}
      <button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6 mt-2' onClick={() => HandleClickAddCategory()}>{showInputs ? 'Close' : 'Add Category'}</button>
      {!showInputs && upsertError && (<div className='text-red-500'>{upsertError}</div>)}
      {showInputs && (
        <>
        <table className='w-full my-2'>
          <tbody>
            <tr className='border-b border-lunar-green-200 h-12'>
              <th className='text-left text-lunar-green-100 w-1/2'>Name</th>
              <td className='text-right'>
                <input type='text' value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Add a name...' className='rounded-sm w-full bg-transparent text-lunar-green-100'/>
              </td>
            </tr>
            <tr className='border-b border-lunar-green-200 h-12'>
              <th className='text-left text-lunar-green-100'>Weight</th>
              <td className='text-right'>
                <input type='number' value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder='Set a weight...' className='rounded-sm w-full bg-transparent text-lunar-green-100' />
              </td>
            </tr>
            <tr className='border-b border-lunar-green-200 h-12'>
              <th className='text-left text-lunar-green-100'>Emoji</th>
              <td className='text-right'>
                <input 
                  type='text' 
                  value={newEmoji} 
                  placeholder='Add an emoji...' 
                  className='rounded-sm w-full bg-transparent text-lunar-green-100'
                  onFocus={() => setShowEmojiPicker(true)}
                  readOnly // Add this if you want the field to be read-only
                />
                {showEmojiPicker && (
                  <div onClick={closeModal} style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {newName && newWeight && (<button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6' onClick={handleAddCategory}>Submit</button>)}
        </>
      )}
    </div>
  );
};

export default Categories;
