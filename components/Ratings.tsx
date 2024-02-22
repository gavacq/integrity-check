'use client'
// a component that accepts a list of categories and renders a StarRating component for each category.
// one StarRating is displayed at a time, and once the user has rated the category, the next category is displayed.

import React, { use, useEffect, useState } from 'react';
import StarRating from './StarRating';
import RatingsReview from './RatingsReview';
import SubmitRatings from './SubmitRatings';

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
  const [reviewOpen, setReviewOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const setRatingForCategory = (category: string) => {
    return (rating: number) => {
      setRatings((prevRatings) => {
        const updatedRatings = { ...prevRatings };
        updatedRatings[category] = {
          name: category,
          value: rating,
        };
        return updatedRatings;
      });
      setAcceptRating(false);
    }
  }

 useEffect(() => {
    const allComplete = Object.values(ratings).every(rating => rating.value > 0);
    setDone(allComplete);
  }, [ratings]);


  const handleAcceptRating = () => {
    setAcceptRating(true);
    const nextCategoryIndex = categories.indexOf(currentCategory) + 1;
    if (nextCategoryIndex < categories.length) {
      setCurrentCategory(categories[nextCategoryIndex]);
    } else {
      setReviewOpen(true)
    }
  }

  const handleSelectCategory = (category: string) => {
    setReviewOpen(false);
    setCurrentCategory(category);
  }

  const handleSubmit = () => {
    setSubmitted(true);
    setReviewOpen(false);
  }

  return (
    <div className='flex flex-col items-center w-full'>
      {!submitted && !reviewOpen && (
      <>

      <div className='flex flex-col items-center'>
      <h2 className='text-lunar-green-300 font-bold text-2xl'>{currentCategory}</h2>
      <StarRating rating={ratings[currentCategory]} setRating={setRatingForCategory(currentCategory)} starSize='3x' active={!submitted} />
      </div>
      
      {!done && (<div className='h-10 w-full flex justify-center items-center my-4'>
      {!acceptRating && ratings[currentCategory].value > 0 && (
          <button className="bg-lunar-green-300 hover:bg-lunar-green-400 rounded-lg px-2 h-8" onClick={handleAcceptRating}>
            Next
          </button>
      )}
        </div>
      )}
      </>
      )}

      {submitted && !reviewOpen && (
        <div className='flex flex-col items-center'>
          <h2 className='text-lunar-green-300 font-bold text-sm sm:text-lg'>🎉 Congratulations on putting in the work!</h2>
          <p className='text-lunar-green-300 font-bold text-sm sm:text-lg'>Check back in tomorrow.</p>
        </div>
      )}

      {reviewOpen && (
        <div className='flex flex-col items-center'>
          <h2 className='text-lunar-green-300 font-bold text-2xl'>Review</h2>
          <div className='table w-full'>
            {Object.values(ratings).map((rating, i) => (
              <div key={rating.name} className='table-row'>
                <div onClick={() => !submitted && handleSelectCategory(rating.name)} className='table-cell p-2'>
                  <h3 className='text-lunar-green-300 font-bold text-lg'>{rating.name}</h3>
                </div>
                <div className='table-cell p-2'>
                  <StarRating rating={rating} setRating={setRatingForCategory(rating.name)} starSize='1x' active={!submitted} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {done && (
      <RatingsReview handleClick={() => setReviewOpen(!reviewOpen)} />
      )}
      {!submitted && done && <SubmitRatings handleSubmit={handleSubmit}/>}
    </div>
  );
};

export default Ratings;
