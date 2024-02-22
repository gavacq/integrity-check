const RatingsReview = ({handleClick}) => {
  return (
    <div className="h-10 w-full flex justify-center items-center my-4">
      <button onClick={handleClick} className="bg-revolver-300 hover:bg-revolver-400 rounded-lg px-2 h-8">
        Review
      </button>
    </div>
  );
}

export default RatingsReview;