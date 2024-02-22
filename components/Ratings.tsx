'use client'
// a component that accepts a list of categories and renders a StarRating component for each category.
// one StarRating is displayed at a time, and once the user has rated the category, the next category is displayed.

import React, { useState } from 'react';
import StarRating from './StarRating';

export interface Rating {
  name: string;
  value: number;
}

const Ratings = ({ categories }: { categories: string[]} ) => {
  const [currentCategory, setCurrentCategory] = useState(categories[0])
  const [done, setDone] = useState(false)
  const [ratings, setRatings] = useState(categories.reduce((acc, category) => {
    acc[category] = {
      name: category,
      value: 0
    }
    return acc
  }, {} as Record<string, Rating>))
  const [acceptRating, setAcceptRating] = useState(false)

  const handleRating = (rating: number) => {
    setRatings((prevRatings) => {
      const updatedRatings = { ...prevRatings };
      updatedRatings[currentCategory] = {
        name: currentCategory,
        value: rating,
      };
      return updatedRatings;
    });
    setAcceptRating(false);
  };

  const handleAcceptRating = () => {
    setAcceptRating(true);
    const nextCategoryIndex = categories.indexOf(currentCategory) + 1;
    if (nextCategoryIndex < categories.length) {
      setCurrentCategory(categories[nextCategoryIndex]);
    } else {
      setDone(true)
    }
  }

  return (
    <div className='flex flex-col items-center w-full'>
      {!done && (
      <>

      <div className='flex flex-col items-center'>
      <h2 className='text-lunar-green-300 font-bold text-2xl'>{currentCategory}</h2>
      <StarRating rating={ratings[currentCategory]} setRating={handleRating} />
      </div>
      
        <div className='h-10 w-full flex justify-center items-center my-4'>
      {!acceptRating && ratings[currentCategory].value > 0 && (
          <button className="bg-lunar-green-300 hover:bg-lunar-green-400 rounded-lg w-1/4 h-8" onClick={handleAcceptRating}>
            Next
          </button>
      )}
        </div>
      </>
      )}
      {done && (
          <h2 className='text-lunar-green-300 font-bold text-xl'>🎉 Congratulations on putting in the work. See you tomorrow! </h2>
      )}
    </div>
  );
};

export default Ratings;
