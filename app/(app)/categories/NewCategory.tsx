import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { Category } from 'hooks/useCategories';
import { useState } from 'react';

const NewCategory = ({
  category,
  setCategory,
  setFocusExistingCategories,
  remainingImportance,
}: {
  category: Category;
  setCategory: (category: Category) => void;
  setFocusExistingCategories: (key: string | null) => void;
  remainingImportance: number;
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [focusNewCategory, setFocusNewCategory] = useState(false);
  const onEmojiClick = (event) => {
    setCategory({
      ...category,
      emoji: event.emoji,
    });
    setShowEmojiPicker(false); // Hide emoji picker after selection
  };

  const closeEmojiModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowEmojiPicker(false);
    }
  };

  const handleFocus = () => {
    setFocusExistingCategories(null);
    setFocusNewCategory(true);
  };

  const handleEditImportance = (value) => {
    let updatedValue = value;
    if (value == '') {
      updatedValue = '';
    } else {
      const num = parseInt(value);
      updatedValue = isNaN(num) ? 0 : Math.max(num, 0);
    }

    setCategory({
      ...category,
      importance: updatedValue,
    });
  };

  const handleBlur = (value: number | string) => {
    setFocusNewCategory(false);
    if (value === '') {
      setCategory({
        ...category,
        importance: 0,
      });
    }
  };

  const handleRemoveEmoji = () => {
    setCategory({
      ...category,
      emoji: '',
    });
    setShowEmojiPicker(false);
  }

  return (
    <div
      className="grid grid-cols-[1fr,3fr,1fr,0.5fr,0.5fr] w-full mb-4 mt-2 h-8 items-center"
      onFocus={() => handleFocus()}
      onBlur={() => handleBlur(category.importance)}
    >
      <div className="grid items-center justify-center col-start-1 border-b border-shuttle-gray-300 h-12 bg-shuttle-gray-950">
        <input
          type="text"
          value={category.emoji}
          className="rounded-sm w-full bg-transparent text-lunar-green-100 text-center h-12"
          onFocus={() => setShowEmojiPicker(true)}
          readOnly // Add this if you want the field to be read-only
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
            />
          </div>
        )}
      </div>
      <div className="text-left border-b border-shuttle-gray-300 h-12 grid items-center justify-center bg-shuttle-gray-950">
        <input
          type="text"
          value={category.name}
          onChange={(e) =>
            setCategory({
              ...category,
              name: e.target.value,
            })
          }
          className="rounded-sm w-full bg-transparent text-lunar-green-100"
        />
      </div>
      <div className="border-b border-shuttle-gray-300 h-12 grid items-center justify-center bg-shuttle-gray-950">
        <input
          type="number"
          value={category.importance}
          onChange={(e) => handleEditImportance(e.target.value)}
          className="text-center rounded-sm w-full bg-transparent text-lunar-green-100"
        />
      </div>
      {focusNewCategory && (
        <span
          className={`flex justify-center items-center font-extralight ${
            remainingImportance < 0 ? 'text-red-600' : 'text-lunar-green-400'
          }`}
        >
          {remainingImportance}
        </span>
      )}
    </div>
  );
};

export default NewCategory;
