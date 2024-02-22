const SubmitRatings = ({handleSubmit}) => {
  return (
    <div>
      <button onClick={handleSubmit} className="bg-lunar-green-300 hover:bg-lunar-green-400 rounded-lg h-8 px-2 mt-6">Submit</button>
    </div>
  )
}

export default SubmitRatings;