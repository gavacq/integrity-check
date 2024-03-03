'use client';
import React, { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Category, addCategory, getCategories } from 'hooks/useCategories';
import { useAuth } from 'providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faGear } from '@fortawesome/free-solid-svg-icons';

enum ConfirmationType {
  save = 'save',
  close = 'close',
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('My Category');
  const [newImportance, setNewImportance] = useState(0);
  const [newEmoji, setNewEmoji] = useState('❓');
  const [upsertError, setUpsertError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newKey, setNewKey] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    message: '',
    type: undefined as ConfirmationType | undefined,
  });
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

  const handleClickSave = async () => {
    setConfirmationModal({
      open: true,
      message: 'Are you sure you want to save?',
      type: ConfirmationType.save,
    })
  }

  const handleClickClose = () => {
    setConfirmationModal({
      open: true,
      message: 'Are you sure you want to close? Any unsaved changes will be lost.',
      type: ConfirmationType.close,
    })
  }

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

  const handleClickAddNewCategory = async () => {
    setShowInputs(true);
    setIsEditing(true);
    setUpsertError('');
  };

  const saveChanges = () => {
    console.log('TODO: save changes');
    setIsEditing(false);
  }

  const cancelChanges = () => {
    console.log('TODO: cancel changes');
    setIsEditing(false);
  }

  const handleYes = () => {
    if (confirmationModal.type === ConfirmationType.save) {
      saveChanges();
    } else if (confirmationModal.type === ConfirmationType.close) {
      cancelChanges()
    }

    setConfirmationModal({
      open: false,
      message: '',
      type: undefined,
    });
  }

  const handleNo = () => {
    setConfirmationModal({
      open: false,
      message: '',
      type: undefined,
    });
  }

  return (
    <div className="flex flex-col grow items-center py-4">
      <div className="grid grid-cols-3 items-center w-5/6">
        <div className="text-left">
          <FontAwesomeIcon
            icon={faGear}
            size="sm"
            className="text-lunar-green-200 cursor-pointer"
            onClick={() => handleClickAddNewCategory()}
          />
        </div>
        <h1 className="text-lunar-green-300 text-center">Categories</h1>
        <div className="text-right">
          <FontAwesomeIcon
            icon={faPlus}
            size="sm"
            className="text-lunar-green-200 cursor-pointer"
            onClick={() => handleClickAddNewCategory()}
          />
        </div>
      </div>
      <div className="flex flex-col mt-4 w-5/6">
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
            style={{ maxHeight: 'calc(100vh - 500px)' }}
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
      {/* cover fixed icon tray with close and save buttons if isEditing. TODO: replace icon tray, currently z-index isn't working*/}
      {isEditing && (
        <div className="mt-auto grid grid-cols-2 items-center text-shuttle-gray-200 bg-ebony-950 h-20 z-100 w-full border-b-2 border-revolver-900">
          <button
            className="w-full text-center"
            onClick={() => handleClickClose()}
          >
            Close
          </button>
          <button className="w-full text-center" onClick={() => handleClickSave()}>
            Save
          </button>
        </div>
      )}
    {confirmationModal.open && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center text-lunar-green-300">
        <div className="bg-ebony-950 rounded-lg p-4 w-1/2">
          <h2 className="mb-6">{confirmationModal.message}</h2>
          <div className="flex justify-between px-6">
            <button onClick={() => handleNo()}>No</button>
            <button onClick={() => handleYes()}>Yes</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Categories;
