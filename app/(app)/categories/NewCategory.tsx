import EmojiPicker from 'emoji-picker-react';
import { Category } from 'hooks/useCategories';
import { useState } from 'react';

const NewCategory = ({
  category,
  setCategory,
}: {
  category: Category;
  setCategory: (x: Category) => void;
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  return (
    <div className="grid grid-cols-[1fr,3fr,1fr,1fr,0.5fr] w-full mb-4 mt-2 h-8 items-center">
      <div className="flex col-start-1 border-b border-shuttle-gray-300 h-8 bg-shuttle-gray-950">
        <input
          type="text"
          value={category.emoji}
          className="rounded-sm w-full bg-transparent text-lunar-green-100 text-center"
          onFocus={() => setShowEmojiPicker(true)}
          readOnly // Add this if you want the field to be read-only
        />
        {showEmojiPicker && (
          <div
            onClick={closeEmojiModal}
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
      <div className="col-start-2 text-left border-b border-shuttle-gray-300 h-8 flex bg-shuttle-gray-950">
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
      <div className="col-start-3 border-b border-shuttle-gray-300 h-8 flex bg-shuttle-gray-950">
        <input
          type="number"
          value={category.importance}
          onChange={(e) =>
            setCategory({
              ...category,
              importance: Number(e.target.value),
            })
          }
          className="text-center rounded-sm w-full bg-transparent text-lunar-green-100"
        />
      </div>
    </div>
  );
};

export default NewCategory;
