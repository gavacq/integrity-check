'use client';
import React, { useEffect, useState } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import {
  Category,
  addCategory,
  deleteCategory,
  getCategories,
  updateCategories,
} from 'hooks/useCategories';
import { useAuth } from 'providers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faGear,
  faTrash,
  faPencil,
  faCheck,
  faCheckDouble,
  faCancel,
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from 'components/LoadingSpinner';
import NewCategory from './NewCategory';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';

enum ConfirmationType {
  save = 'save',
  cancel = 'cancel',
  delete = 'delete',
}

const calculateRemainingImportance = (categories: Record<string, Category>) => {
  const totalImportance = Object.values(categories).reduce((acc, category) => {
    if (category.importance.toString() === '') {
      acc += 0; // Allow empty string to allow user to clear the field
      return acc;
    }

    const importanceValue = parseInt(category.importance.toString());
    if (!isNaN(importanceValue)) {
      acc += importanceValue;
    } else {
      console.error('Invalid importance value:', {
        category,
        importanceValue,
      });
    }
    return acc;
  }, 0);

  return 100 - totalImportance;
};

const Categories = () => {
  const [initalCategories, setInitialCategories] = useState<
    Record<string, Category>
  >({});
  const [updatedCategories, setUpdatedCategories] = useState<
    Record<string, Category>
  >({});
  const [showInputs, setShowInputs] = useState(false);
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
  const [remainingImportance, setRemainingImportance] = useState(
    calculateRemainingImportance({
      ...updatedCategories,
      ...(showInputs ? { tempKey: newCategory } : {}),
    })
  );

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
        setRemainingImportance;
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error getting categories:', error);
        setUpsertError('Error getting categories: ' + error);
        setIsLoading(false);
      });
  }, [currentUser?.uid]);

  useEffect(() => {
    setRemainingImportance(
      calculateRemainingImportance({
        ...updatedCategories,
        ...(showInputs ? { tempKey: newCategory } : {}),
      })
    );
  }, [updatedCategories, newCategory, showInputs]);

  const handleEditCategory = (categoryKey, field, value) => {
    let updatedValue = value;

    // If the field being edited is 'importance', ensure it's not less than 0
    if (field === 'importance') {
      if (value === '') {
        updatedValue = ''; // Allow empty string to allow user to clear the field
      } else {
        const numericValue = parseFloat(value);
        updatedValue = isNaN(numericValue) ? 0 : Math.max(numericValue, 0);
      }
    }

    setUpdatedCategories({
      ...updatedCategories,
      [categoryKey]: {
        ...updatedCategories[categoryKey],
        [field]: updatedValue,
      },
    });
  };

  const handleRemoveEmoji = () => {
    handleEditCategory(focusedRow, 'emoji', '');
    setShowEmojiPicker(false);
  };

  const handleBlurImportance = (categoryKey, value) => {
    if (value === '') {
      handleEditCategory(categoryKey, 'importance', 0);
    }
  };

  const handleClickSave = async () => {
    saveChanges();
    setFocusedRow(null);
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
    handleEditCategory(focusedRow, 'emoji', event.emoji);
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };

  const closeEmojiModal = (e) => {
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
      setNewCategory({
        name: 'My Category',
        importance: 0,
        emoji: '❓',
        id: 'tempKey',
      });
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
    setNewCategory({
      name: 'My Category',
      importance: 0,
      emoji: '❓',
      id: 'tempKey',
    });
    setIsEditing(false);
    setShowInputs(false);
    setFocusedRow(null);
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

      const { [categoryKey]: y, ...updatedCategoriesCopy } = updatedCategories;
      setUpdatedCategories(updatedCategoriesCopy);

      const { [categoryKey]: x, ...initalCategoriesCopy } = initalCategories;
      setInitialCategories(initalCategoriesCopy);
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
          {isEditing ? (
            <div className="grid grid-cols-3 items-left">
              <FontAwesomeIcon
                icon={faCheck}
                size="sm"
                className="text-lunar-green-200 cursor-pointer"
                onClick={() => handleClickSave()}
              />
              <FontAwesomeIcon
                icon={faCancel}
                size="sm"
                className="text-lunar-green-200 cursor-pointer"
                onClick={() => handleClickCancel()}
              />
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faPencil}
              size="sm"
              className="text-lunar-green-200 cursor-pointer"
              onClick={() => handleClickEditMode()}
            />
          )}
        </div>
        <h1 className="text-lunar-green-300 text-center">
          {isEditing ? 'Edit Categories' : 'Categories'}
        </h1>
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
            <div className="grid grid-cols-[1fr,3fr,1fr,0.5fr,0.5fr] w-full bg-ebony-950 text-lunar-green-200 font-bold text-sm">
              <div className="text-center col-start-1">Emoji</div>
              <div className="text-left">Name</div>
              <div className="text-left">Importance</div>
            </div>
            {showInputs && (
              <NewCategory
                category={newCategory}
                setCategory={setNewCategory}
                setFocusExistingCategories={setFocusedRow}
                remainingImportance={remainingImportance}
              />
            )}

            {/* Scrollable Grid Body */}
            <div
              className="grid grid-cols-[1fr,3fr,1fr,0.5fr,0.5fr] gap-y-2 w-full overflow-y-auto text-lunar-green-200"
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
                      className="w-full col-start-1 bg-transparent text-center border-shuttle-gray-800 border-b-2 h-12"
                      type="text"
                      value={category[1].emoji}
                      readOnly
                      onFocus={() => setShowEmojiPicker(true)}
                    />
                    {showEmojiPicker && (
                      <div
                        onClick={closeEmojiModal}
                        className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex  flex-col justify-center items-center z-50"
                      >
                        <button
                          onClick={handleRemoveEmoji}
                          className="mb-4 rounded-md bg-revolver-300 px-2 text-black"
                        >
                          Remove Emoji
                        </button>
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          emojiStyle={EmojiStyle.NATIVE}
                        />
                      </div>
                    )}
                    <input
                      className="w-full text-left bg-transparent border-shuttle-gray-800 border-b-2 h-12 overflow-hidden whitespace-nowrap text-ellipsis"
                      type="text"
                      value={category[1].name}
                      onChange={(e) =>
                        handleEditCategory(category[0], 'name', e.target.value)
                      }
                    />
                    <input
                      className="w-full text-center bg-transparent border-shuttle-gray-800 border-b-2 h-12"
                      type="number"
                      value={category[1].importance}
                      onChange={(e) =>
                        handleEditCategory(
                          category[0],
                          'importance',
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleBlurImportance(
                          category[0],
                          category[1].importance
                        )
                      }
                    />
                    {focusedRow === category[0] && (
                      <>
                        <span
                          className={`flex justify-center items-center font-extralight ${
                            remainingImportance < 0
                              ? 'text-red-600'
                              : 'text-lunar-green-400'
                          }`}
                        >
                          {remainingImportance}
                        </span>
                        <button
                          className="cursor-pointer"
                          type="button"
                          onClick={() => handleClickDelete(category[0])}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="sm"
                            className="text-lunar-green-200 cursor-pointer"
                          />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div key={category[0]} className="contents">
                    <div className="col-start-1 grid items-center justify-center border-shuttle-gray-800 border-b-2 h-12">
                      {category[1].emoji}
                    </div>
                    <div className="grid items-center border-shuttle-gray-800 border-b-2 h-12 overflow-hidden whitespace-nowrap text-ellipsis">
                      {category[1].name}
                    </div>
                    <div className="grid items-center justify-center border-shuttle-gray-800 border-b-2 h-12">
                      {category[1].importance}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {!isEditing && remainingImportance < 0 && (
        <div className="text-red-500 w-5/6 my-4 font-light">
          {`Your importance points sum is ${
            100 - remainingImportance
          }. Daily integrity ratings will not be available until the sum of importances is equal to 100. Please edit your
          categories.`}
        </div>
      )}
      {!isEditing && remainingImportance > 0 && (
        <div className="text-lunar-green-300 w-5/6 my-4 font-light">
          {`You have ${remainingImportance} importance points remaining. Daily integrity ratings will not be available until the sum of importances is equal to 100. Please edit your categories.`}
        </div>
      )}
      {upsertError && <div className="text-red-500">{upsertError}</div>}
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
