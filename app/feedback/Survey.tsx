import { useState } from 'react';

const Survey = ({ title, onDismiss, onSubmit }) => {
  const [value, setValue] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    onSubmit(value);
  };
  return (
    <div className="flex flex-col w-4/5 rounded-lg text-lunar-green-300 items-center justify-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full"
      >
        <label className="text-lg w-full">
          <textarea
            value={value}
            onChange={handleChange}
            className="text-black border-2 border-gray-300 p-2 mt-2 w-full rounded-lg h-32 overflow-y-auto bg-lunar-green-200"
          />
        </label>
        <button
          type="submit"
          className="bg-revolver-500 text-white p-2 mt-2 rounded-lg w-40"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="bg-ebony-400 text-white p-2 mt-2 rounded-lg w-40"
        >
          No thanks
        </button>
      </form>
    </div>
  );
};
export default Survey;
