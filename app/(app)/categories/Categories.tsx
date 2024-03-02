'use client';
import React, { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Category, addCategory, getCategories } from 'hooks/useCategories';
import { useAuth } from 'providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faGear } from '@fortawesome/free-solid-svg-icons';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('My Category');
  const [newImportance, setNewImportance] = useState(0)
  const [newEmoji, setNewEmoji] = useState('❓');
  const [upsertError, setUpsertError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newKey, setNewKey] = useState<string | undefined>(undefined);
  const { currentUser } = useAuth();

  useEffect(() => {
    getCategories(currentUser?.uid || '').then((categories) => {
      setCategories(categories);
    });
  }, [currentUser?.uid]);

  const NewCategory = () => {
    return (
      <div className="grid grid-cols-4 gap-4 w-full mb-4 mt-2 bg-gray-800 h-8 items-center">
        <div className="col-start-1">
          <input
            type="text"
            value={newEmoji}
            className="rounded-sm w-full bg-transparent text-lunar-green-100 text-center"
            onFocus={() => setShowEmojiPicker(true)}
            readOnly // Add this if you want the field to be read-only
          />
          {showEmojiPicker && (
            <div
              onClick={closeModal}
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <div className="col-start-2 text-left">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded-sm w-full bg-transparent text-lunar-green-100"
          />
        </div>
        <div className="col-start-3">
          <input
            type="number"
            value={newImportance}
            onChange={(e) => setNewImportance(Number(e.target.value))}
            className="text-center rounded-sm w-full bg-transparent text-lunar-green-100"
          />
        </div>
      </div>
    );
  };

  // const handleAddCategory = async () => {
  //   try {
  //     await addCategory({
  //       name: newName,
  //       importance: parseInt(newImportance),
  //       emoji: newEmoji,
  //       userId: currentUser?.uid || '',
  //       id: newKey,
  //     });
  //   } catch (error) {
  //     console.error('Error adding category', error);
  //     setUpsertError('Error adding category: ' + error);
  //   }

  //   setNewKey(undefined);
  //   setNewName('');
  //   setNewImportance('');
  //   setShowInputs(false);
  //   const allCategories = await getCategories(currentUser?.uid || '');

  //   setCategories(allCategories);
  // };

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
  };

  const HandleClickAddCategory = async () => {
    setShowInputs(!showInputs);
    setUpsertError('');
  };

  return (
    <div className="flex flex-col grow items-center py-4">
      <div className="grid grid-cols-3 items-center w-2/3">
        <div className="text-left">
          <FontAwesomeIcon
            icon={faGear}
            size="sm"
            className="text-lunar-green-200 cursor-pointer"
            onClick={() => HandleClickAddCategory()}
          />
        </div>
        <h1 className="text-lunar-green-300 text-center">Categories</h1>
        <div className="text-right">
          <FontAwesomeIcon
            icon={faPlus}
            size="sm"
            className="text-lunar-green-200 cursor-pointer"
            onClick={() => HandleClickAddCategory()}
          />
        </div>
      </div>
      <div className="flex flex-col mt-4 w-2/3">
        <div className="flex flex-col items-center">
          {/* Fixed Headers */}
          <div className="grid grid-cols-4 gap-4 w-full bg-ebony-950 text-lunar-green-200 font-bold">
            <div className="text-center">Emoji</div>
            <div className="text-left">Name</div>
            <div className="text-left">Importance</div>
          </div>
          {showInputs && <NewCategory />}

          {/* Scrollable Grid Body */}
          <div
            className="grid grid-cols-4 gap-4 w-full overflow-y-auto text-lunar-green-200"
            style={{ maxHeight: 'calc(100vh - 400px)' }}
          >
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <div className="col-start-1 text-center">{category.emoji}</div>
                <div className="text-left">{category.name}</div>
                <div className="text-center">{category.importance}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* grid layout */}

      {/* <button className='w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6 mt-2' onClick={() => HandleClickAddCategory()}>{showInputs ? 'Close' : 'Add Category'}</button> */}
      {!showInputs && upsertError && (
        <div className="text-red-500">{upsertError}</div>
      )}
      {/* {showInputs && (
          <>
            <table className="w-full my-2">
              <tbody>
                <tr className="border-b border-lunar-green-200 h-12">
                  <th className="text-left text-lunar-green-100">Importance</th>
                </tr>
                <tr className="border-b border-lunar-green-200 h-12">
                  <th className="text-left text-lunar-green-100">Emoji</th>
                </tr>
              </tbody>
            </table>
            {newName && newImportance && (
              <button
                className="w-full bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-6"
                onClick={handleAddCategory}
              >
                Submit
              </button>
            )}
          </>
        )} */}
    </div>
  );
};

export default Categories;
