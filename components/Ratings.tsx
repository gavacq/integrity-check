'use client';
// a component that accepts a list of categories and renders a StarRating component for each category.
// one StarRating is displayed at a time, and once the user has rated the category, the next category is displayed.

import React, { use, useEffect, useState } from 'react';
import StarRating from './StarRating';
import RatingsReview from './RatingsReview';
import SubmitRatings from './SubmitRatings';
import { Category, getCategories } from 'hooks/useCategories';
import Link from 'next/link';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'providers/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import {
  DailyRating,
  Rating,
  formatDailyRating,
  getDailyRatings,
  saveDailyRating,
} from 'hooks/useRatings';
import { Timestamp } from 'firebase/firestore';
import { get } from 'http';

const Ratings = () => {
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(
    undefined
  );
  const [done, setDone] = useState(false);
  const [ratings, setRatings] = useState(
    categories.reduce((acc, category) => {
      acc[category.id] = {
        id: category.id,
        name: category.name,
        value: 0,
      };
      return acc;
    }, {} as Record<string, Rating>)
  );
  const [acceptRating, setAcceptRating] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isValidImportanceSum, setIsValidImportanceSum] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [previousDailyRating, setPreviousDailyRating] = useState<
    DailyRating | undefined
  >(undefined);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        throw new Error('No current user');
      }

      // categories
      const allCategories = await getCategories(currentUser?.uid || '');

      // check if valid importance sum
      const sum = allCategories.reduce((acc, category) => {
        return acc + category.importance;
      }, 0);
      if (sum === 100) {
        setIsValidImportanceSum(true);
      }

      setCategories(allCategories);
      setRatings(
        allCategories.reduce((acc, category) => {
          acc[category.id] = {
            id: category.id,
            name: category.name,
            value: 0,
          };
          return acc;
        }, {} as Record<string, Rating>)
      );
      setCurrentCategory(allCategories[0]);

      // daily rating
      const date = Timestamp.now();
      const todaysDailyRating = await getDailyRatings(currentUser.uid, date);
      if (todaysDailyRating.length > 0) {
        // get the most recent daily rating
        setPreviousDailyRating(todaysDailyRating[todaysDailyRating.length - 1]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [currentUser?.uid]);

  const setRatingForCategory = (categoryId: string) => {
    return (rating: number) => {
      setRatings((prevRatings) => {
        const updatedRatings = { ...prevRatings };
        updatedRatings[categoryId] = {
          ...updatedRatings[categoryId],
          value: rating,
        };
        return updatedRatings;
      });
      setAcceptRating(false);
    };
  };

  useEffect(() => {
    const allComplete = Object.values(ratings).every(
      (rating) => rating.value > 0
    );
    setDone(allComplete);
  }, [ratings]);

  const handleAcceptRating = () => {
    setAcceptRating(true);
    // get the index of the current category
    const nextCategoryIndex =
      categories.findIndex((category) => category.id === currentCategory?.id) +
      1;
    if (nextCategoryIndex < categories.length) {
      setCurrentCategory(categories[nextCategoryIndex]);
    } else {
      setReviewOpen(true);
    }
  };

  const handleSelectCategory = (category: string) => {
    setReviewOpen(false);
    setCurrentCategory(categories.find((c) => c.id === category));
  };

  const calculateScore = () => {
    return Math.round(
      Object.values(ratings).reduce((acc, rating) => {
        return (
          acc +
          (rating.value - 1) *
            (categories.find((c) => c.id === rating.id)!.importance / 4)
        );
      }, 0)
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dailyRatingScore = calculateScore();
      const categoriesMap = categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<string, Category>);
      if (!currentUser) {
        throw new Error('No current user');
      }
      const dailyRating = formatDailyRating(
        ratings,
        categoriesMap,
        currentUser.uid,
        dailyRatingScore
      );
      await saveDailyRating(dailyRating);
      setScore(dailyRatingScore);
      setSubmitted(true);
      setReviewOpen(false);
    } catch (error) {
      console.error('Error saving daily rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverwriteDailyRatings = () => {
    setPreviousDailyRating(undefined);
  }

  const today = new Date();
  // format date as user friendly text
  const date = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isLoading || currentCategory === undefined) {
    return <LoadingSpinner />;
  }

  if (categories.length === 0) {
    return (
      <div className="grow flex flex-col items-center justify-center">
        <h1 className="text-lunar-green-300">Create a category</h1>
        <Link href="/categories" className="my-4">
          <FontAwesomeIcon
            icon={faPlus}
            size="2x"
            className="text-revolver-300 cursor-pointer"
          />
        </Link>
      </div>
    );
  }

  if (!isValidImportanceSum) {
    return (
      <div className="grow flex items-center justify-center w-full">
        <div className="flex items-center flex-col w-1/2">
          <h1 className="text-lunar-green-300">
            The sum of importance points must be 100. Please edit your
            categories
          </h1>
          <Link href="/categories" className="my-4">
            <FontAwesomeIcon
              icon={faGear}
              size="2x"
              className="text-lunar-green-200 cursor-pointer"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col items-center justify-center w-full">
      <h1
        className='text-lunar-green-300 font-bold text-xl sm:text-4xl mb-48'
      >
        {date}
      </h1>
      {!submitted && !reviewOpen && previousDailyRating && (
        <div
          className='w-2/3 flex flex-col items-center'
        >
          <h2
            className='text-lunar-green-300 font-bold text-2xl'
          >
            Today's score: {previousDailyRating.score}
          </h2>
          <h3 className="text-lunar-green-300 font-bold text-md my-6">
            {`You already submitted a rating today. If you'd like to overwrite your ratings, you can do so below.`}
          </h3>
          <button
            type='button'
            className='bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-8'
            onClick={() => handleOverwriteDailyRatings()}
          >
            Overwrite
          </button>
        </div>
      )}
      {!submitted && !reviewOpen && !previousDailyRating && (
        <>
          <div className="flex flex-col items-center">
            <h2 className="text-lunar-green-300 font-bold text-2xl">
              {currentCategory.emoji + ' ' + currentCategory.name}
            </h2>
            <StarRating
              rating={ratings[currentCategory.id]}
              setRating={setRatingForCategory(currentCategory.id)}
              starSize="3x"
              active={!submitted}
            />
          </div>

          {!done && (
            <div className="h-10 w-full flex justify-center items-center my-4">
              {!acceptRating && ratings[currentCategory.id].value > 0 && (
                <button
                  className="bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-8"
                  onClick={handleAcceptRating}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}

      {submitted && !reviewOpen && (
        <div className="flex flex-col items-center">
          <h1 className="text-revolver-300 font-bold text-2xl">
            {Math.round(score)}
          </h1>
          <h2 className="text-lunar-green-300 font-bold text-sm sm:text-lg">
            🎉 Congratulations on putting in the work!
          </h2>
          <p className="text-lunar-green-300 font-bold text-sm sm:text-lg">
            Check back in tomorrow.
          </p>
        </div>
      )}

      {reviewOpen && (
        <div className="flex flex-col items-center">
          <h2 className="text-lunar-green-300 font-bold text-2xl">Review</h2>
          <div className="table w-full">
            {Object.values(ratings).map((rating, i) => (
              <div key={rating.id} className="table-row">
                <div
                  onClick={() => !submitted && handleSelectCategory(rating.id)}
                  className="table-cell p-2"
                >
                  <h3 className="text-lunar-green-300 font-bold text-lg">
                    {rating.name}
                  </h3>
                </div>
                <div className="table-cell p-2">
                  <StarRating
                    rating={rating}
                    setRating={setRatingForCategory(rating.id)}
                    starSize="1x"
                    active={!submitted}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {done && <RatingsReview handleClick={() => setReviewOpen(!reviewOpen)} />}
      <div className="h-10 w-full flex justify-center items-center my-4">
        {!submitted && done && <SubmitRatings handleSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default Ratings;
