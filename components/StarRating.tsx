'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { Rating } from './Ratings';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

const StarRating = ({ rating, setRating, starSize, active }: { rating: Rating, setRating: any, starSize: SizeProp, active: boolean}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className='my-3 space-x-1'>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        if (active) {
          return (

            <label key={i}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                style={{ display: 'none' }}
              />
              <FontAwesomeIcon
                icon={ratingValue <= (hover || rating.value) ? faStar : farStar}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(ratingValue)}
                style={{ cursor: 'pointer' }}
                className='text-outer-space-500'
                size={starSize} // Increase the size of the stars
              />
            </label>
          )
        }

        return (

            <FontAwesomeIcon
              icon={ratingValue <= rating.value ? faStar : farStar}
              style={{ cursor: 'pointer' }}
              className='text-outer-space-500'
              size={starSize} // Increase the size of the stars
            />
        )

      })}
    </div>
  );
};

export default StarRating;