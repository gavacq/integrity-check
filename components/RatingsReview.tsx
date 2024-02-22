const RatingsReview = ({handleClick}) => {
  return (
    <div className="h-10 w-full flex justify-center items-center my-4">
      <button onClick={handleClick} className="bg-lunar-green-300 hover:bg-lunar-green-400 rounded-lg px-2 h-8">
        Review
      </button>
    </div>
  );
}

export default RatingsReview;