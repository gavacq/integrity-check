'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div>
      <h2>Rating: {rating}</h2>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

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
              icon={ratingValue <= (hover || rating) ? faStar : farStar}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(ratingValue)}
              style={{ cursor: 'pointer' }}
              size="3x" // Increase the size of the stars
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;