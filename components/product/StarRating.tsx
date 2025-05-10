'use client'
import React from 'react';
import StarRatings from 'react-star-ratings';

type RatingValue = 1 | 2 | 3 | 4 | 5;

interface StarRatingProps {
  rating?: RatingValue;
}

export default function StarRating({ rating = 5 }: StarRatingProps) {
  return (
    <StarRatings
      starDimension="12px"
      starSpacing="0.1px"
      rating={rating}
      starRatedColor="#f9a803"
      numberOfStars={5}
      name="rating"
    />
  );
}