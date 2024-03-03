'use client';
import React, { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import {
  Category,
  addCategory,
  deleteCategory,
  getCategories,
  updateCategories,
} from 'hooks/useCategories';
import { useAuth } from 'providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from 'components/LoadingSpinner';
import NewCategory from './NewCategory';

enum ConfirmationType {
  save = 'save',
  cancel = 'cancel',
  delete = 'delete',
}

const Categories = () => {
  const [initalCategories, setInitialCategories] = useState<
    Record<string, Category>
  >({});
  const [updatedCategories, setUpdatedCategories] = useState<
    Record<string, Category>
  >({});
  const [showInputs, setShowInputs] = useState(false);
  const [newName, setNewName] = useState('My Category');
  const [newImportance, setNewImportance] = useState(0);
  const [newEmoji, setNewEmoji] = useState('❓');
  const [upsertError, setUpsertError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    message: '',
    type: undefined as ConfirmationType | undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [newCategory, setNewCategory] = useState<Category>({
    name: 'My Category',
    importance: 0,
    emoji: '❓',
    id: 'tempKey',
  });
  const [focusedRow, setFocusedRow] = useState<string | null>(null);

  useEffect(() => {
    getCategories(currentUser?.uid || '')
      .then((categories) => {
        setInitialCategories(
          categories.reduce((acc, category) => {
            acc[category.id] = category;
            return acc;
          }, {} as Record<string, Category>)
        );
        setUpdatedCategories(
          categories.reduce((acc, category) => {
            acc[category.id] = category;
            return acc;
          }, {} as Record<string, Category>)
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error getting categories:', error);
        setUpsertError('Error getting categories: ' + error);
        setIsLoading(false);
      });
  }, [currentUser?.uid]);
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

  const handleEditCategory = (categoryKey, field, value) => {
    setUpdatedCategories({
      ...updatedCategories,
      [categoryKey]: {
        ...updatedCategories[categoryKey],
        [field]: value,
      },
    });
  };

  const handleClickSave = async () => {
    setConfirmationModal({
      open: true,
      message: 'Are you sure you want to save?',
      type: ConfirmationType.save,
    });
  };

  const handleClickCancel = () => {
    setConfirmationModal({
      open: true,
      message:
        'Are you sure you want to cancel? Any unsaved changes will be lost.',
      type: ConfirmationType.cancel,
    });
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

  const handleClickAddNewCategory = async () => {
    setShowInputs(true);
    setIsEditing(true);
    setUpsertError('');
  };

  const saveChanges = async () => {
    let savedCategories: Record<string, Category> = {};
    try {
      if (!currentUser?.uid) {
        throw new Error('currentUser.uid is undefined');
      }

      let categoriesToSave = {
        ...updatedCategories,
      } as Record<string, Category>;

      if (showInputs) {
        categoriesToSave = {
          ...categoriesToSave,
          tempKey: {
            ...newCategory,
          },
        };
      }

      savedCategories = await updateCategories(
        categoriesToSave,
        currentUser.uid
      );
      setUpsertError('');
    } catch (error) {
      console.error('Error updating categories:', error);
      setUpsertError('Error updating categories: ' + error);
    }

    setInitialCategories({
      ...savedCategories,
    });
    setUpdatedCategories({
      ...savedCategories,
    });
    setIsEditing(false);
    setShowInputs(false);
  };

  const cancelChanges = () => {
    setUpdatedCategories({
      ...initalCategories,
    });
    setIsEditing(false);
    setShowInputs(false);
  };

  const handleYes = () => {
    switch (confirmationModal.type) {
      case ConfirmationType.save:
        saveChanges();
        break;
      case ConfirmationType.cancel:
        cancelChanges();
        break;
      case ConfirmationType.delete:
        handleDeleteCategory(focusedRow);
        break;
      default:
        break;
    }

    setConfirmationModal({
      open: false,
      message: '',
      type: undefined,
    });
  };

  const handleNo = () => {
    setConfirmationModal({
      open: false,
      message: '',
      type: undefined,
    });
  };

  const handleClickEditMode = () => {
    setIsEditing(true);
  };

  const handleDeleteCategory = async (categoryKey) => {
    try {
      if (!currentUser?.uid) {
        throw new Error('currentUser.uid is undefined');
      }

      await deleteCategory(categoryKey);

      const { [categoryKey]: _, ...updatedCategoriesCopy } = updatedCategories;
      setUpdatedCategories(updatedCategoriesCopy);
      setFocusedRow(null);
      setUpsertError('');
    } catch (error) {
      console.error('Error deleting category:', error);
      setUpsertError('Error deleting category: ' + error);
    }
  };

  const handleClickDelete = (categoryKey) => {
    setConfirmationModal({
      open: true,
      message: `⚠️ Are you sure you want to delete the ${updatedCategories[categoryKey].name} category? This is irreversible. All associated data will be lost`,
      type: ConfirmationType.delete,
    });
  };

  return (
    <div className="flex flex-col grow items-center py-4">
      <div className="grid grid-cols-3 items-center w-5/6">
        <div className="text-left">
          <FontAwesomeIcon
            icon={faGear}
            size="sm"
            className="text-lunar-green-200 cursor-pointer"
            onClick={() => handleClickEditMode()}
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col mt-4 w-5/6">
          <div className="flex flex-col items-center">
            {/* Fixed Headers */}
            <div className="grid grid-cols-[1fr,3fr,1fr,1fr,0.5fr] w-full bg-ebony-950 text-lunar-green-200 font-bold text-sm">
              <div className="text-center">Emoji</div>
              <div className="text-left">Name</div>
              <div className="text-left">Importance</div>
            </div>
            {showInputs && (
              <NewCategory
                category={newCategory}
                setCategory={setNewCategory}
              />
            )}

            {/* Scrollable Grid Body */}
            <div
              className="grid grid-cols-[1fr,3fr,1fr,1fr,0.5fr] gap-y-2 w-full overflow-y-auto text-lunar-green-200"
              style={{ maxHeight: 'calc(100vh - 500px)' }}
            >
              {Object.entries(updatedCategories).map((category) =>
                isEditing ? (
                  <div
                    key={category[0]}
                    className="contents"
                    onFocus={() => setFocusedRow(category[0])}
                    tabIndex={0} // Make the div focusable
                  >
                    <input
                      className="w-full col-start-1 bg-transparent text-center border-shuttle-gray-800 border-b-2 h-8"
                      type="text"
                      value={category[1].emoji}
                      onChange={(e) =>
                        handleEditCategory(category[0], 'emoji', e.target.value)
                      }
                    />
                    <input
                      className="w-full text-left bg-transparent border-shuttle-gray-800 border-b-2 h-8"
                      type="text"
                      value={category[1].name}
                      onChange={(e) =>
                        handleEditCategory(category[0], 'name', e.target.value)
                      }
                    />
                    <input
                      className="w-full text-center bg-transparent border-shuttle-gray-800 border-b-2 h-8"
                      type="number"
                      value={category[1].importance}
                      onChange={(e) =>
                        handleEditCategory(
                          category[0],
                          'importance',
                          e.target.value
                        )
                      }
                    />
                    {focusedRow === category[0] && (
                      <button
                        className="col-start-5 cursor-pointer"
                        type="button"
                        onClick={() => handleClickDelete(category[0])}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="sm"
                          className="text-lunar-green-200 cursor-pointer"
                        />
                      </button>
                    )}
                  </div>
                ) : (
                  <div key={category[0]} className="contents">
                    <div className="col-start-1 text-center border-shuttle-gray-800 border-b-2 h-8">
                      {category[1].emoji}
                    </div>
                    <div className="text-left  border-shuttle-gray-800 border-b-2 h-8">
                      {category[1].name}
                    </div>
                    <div className="text-center  border-shuttle-gray-800 border-b-2 h-8">
                      {category[1].importance}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {upsertError && <div className="text-red-500">{upsertError}</div>}
      {/* TODO: replace icon tray, currently z-index isn't working*/}
      {isEditing && (
        <div className="mt-auto grid grid-cols-2 items-center text-shuttle-gray-200 bg-ebony-950 h-20 z-100 w-full border-b-2 border-revolver-900">
          <button
            className="w-full text-center"
            onClick={() => handleClickCancel()}
          >
            Cancel
          </button>
          <button
            className="w-full text-center"
            onClick={() => handleClickSave()}
          >
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
