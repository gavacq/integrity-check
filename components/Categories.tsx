'use client'
import { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react'
import { Category, addCategory, getCategories } from 'hooks/useCategories';
import { useAuth } from 'providers/AuthContext';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImportance, setNewImportance] = useState('');
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
        importance: parseInt(newImportance),
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
    setNewImportance('');
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
    setNewImportance(category.importance);
    setNewKey(category.id);
    setShowInputs(true);
  }

  const HandleClickAddCategory = async () => {
    setShowInputs(!showInputs);
    setUpsertError('');
  }

  return (
    <div className='flex flex-col mt-4 w-2/3'>
      {!showInputs && (
        <div className='grow flex flex-col items-center'>
            <table className='text-lunar-green-300 border-collapse w-full'>
              <thead>
                <tr className='border-b border-lunar-green-200 sticky top-0 bg-ebony-950'>
                  <th className='w-2/3 text-left'>Name</th>
                  <th className='w-1/2 text-left'>Importance</th>
                </tr>
              </thead>
            </table>
            <div className='overflow-y-auto w-full' style={{ maxHeight: 'calc(100vh - 300px)' }}>
              <table className='text-lunar-green-300 border-collapse w-full'>
                <tbody className='text-lunar-green-100'>
                  {categories.map((category, index) => (
                    <tr key={index} className='border-b border-lunar-green-200 h-12' onClick={() => handleEditCategory(category)}>
                      <td className='border-r border-lunar-green-200 w-2/3'>{category.emoji + ' ' + category.name}</td>
                      <td className='pl-2 w-1/2'>{category.importance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      )}
      {/* <button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6 mt-2' onClick={() => HandleClickAddCategory()}>{showInputs ? 'Close' : 'Add Category'}</button> */}
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
              <th className='text-left text-lunar-green-100'>Importance</th>
              <td className='text-right'>
                <input type='number' value={newImportance} onChange={(e) => setNewImportance(e.target.value)} placeholder='Set a importance...' className='rounded-sm w-full bg-transparent text-lunar-green-100' />
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
        {newName && newImportance && (<button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6' onClick={handleAddCategory}>Submit</button>)}
        </>
      )}
    </div>
  );
};

export default Categories;
