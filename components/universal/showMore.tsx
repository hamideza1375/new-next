'use client';
import { ArrowDownIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

// 🔹 Define props type
interface ShowMoreProps {
  dataLength: number;
}

const ShowMore: React.FC<ShowMoreProps> = ({ dataLength }) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    dataLength > 6 && !showMore && (
      <button
        className="flex items-center gap-2 mt-24 text-blue font-bold text-md"
        onClick={() => setShowMore(true)}>
        <span>نمایش بیشتر</span>
        <ArrowDownIcon className="h-4 w-4" />
      </button>
    )
  );
};

export default ShowMore;