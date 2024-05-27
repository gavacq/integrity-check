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
  const [focusNewCategory, setFocusNewCategory] = useState(false);

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

  return (
    <div
      className="grid grid-cols-[3fr,1fr,0.5fr,0.5fr] w-full mb-4 mt-2 h-8 items-center"
      onFocus={() => handleFocus()}
      onBlur={() => handleBlur(category.importance)}
    >
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
