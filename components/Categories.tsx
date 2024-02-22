'use client'
import { useEffect, useState } from 'react';
import { DBSchema, openDB } from 'idb';
import EmojiPicker, { Emoji } from 'emoji-picker-react'

export interface MyDB extends DBSchema {
  'categories': {
    value: {
      name: string;
      weight: number;
      emoji: string;
    };
    key: string;
    // Define any indexes here if needed
    indexes: { 'name': string };
  };
  // You can add more stores here if needed
}

export interface Category {
  name: string;
  weight: number;
  emoji: string;
  id: string;
}

export async function setupDB() {
  const db = await openDB<MyDB>('MyDatabase', 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('categories', {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // You can create indexes here if needed
      store.createIndex('name', 'name', { unique: true });
    },
  });

  // You can add more setup logic here if needed
}


// Now your db object is strongly typed
// Example of adding a category
async function addCategory(category: { name: string, weight: number, emoji: string, id?: string}) {
  const db = await openDB<MyDB>('MyDatabase', 1);
  if (category.id) {
    await db.put('categories', category);
    return;
  }
  await db.add('categories', {
    name: category.name,
    weight: category.weight,
    emoji: category.emoji,
  });
}


const Categories = () => {
  const [categories, setCategories] = useState<Array<{name: string, weight: number, emoji: string, id: string}>>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newEmoji, setNewEmoji] = useState('❓');
  const [upsertError, setUpsertError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newKey, setNewKey] = useState<string | undefined>(undefined)


  useEffect(() => {
    const fetchData = async () => {
    // Use this function to setup your DB
      await setupDB()
      // Open the database
      const db = await openDB('MyDatabase', 1); // Replace with your database name and version

      // Read all categories from the store
      const tx = db.transaction('categories', 'readonly'); // Replace 'categories' with your actual store name
      const store = tx.objectStore('categories');
      const allCategories = await store.getAll();

      setCategories(allCategories);
    };

    fetchData();
  }, []);


 const handleAddCategory = async () => {
    try {
      await addCategory({
        name: newName,
        weight: parseInt(newWeight),
        emoji: newEmoji,
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
    // Open the database
    const db = await openDB('MyDatabase', 1); // Replace with your database name and version

    // Read all categories from the store
    const tx = db.transaction('categories', 'readonly'); // Replace 'categories' with your actual store name
    const store = tx.objectStore('categories');
    const allCategories = await store.getAll();

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
