'use client';
import StarRatings from 'react-star-ratings';

type RatingValue = 1 | 2 | 3 | 4 | 5;

interface SetStarProps {
  rating?: RatingValue;
  changeRating: (newRating: RatingValue) => void;
}

export default function SetStar({ rating = 5, changeRating }: SetStarProps) {
  return (
    <div className={!rating && 'p-2 border border-danger' || ''}>
      <StarRatings
        starDimension="24px"
        starSpacing="2px"
        rating={rating}
        starRatedColor="#f9a803"
        numberOfStars={5}
        name="setRating"
        changeRating={changeRating}
      />
    </div>
  );
}