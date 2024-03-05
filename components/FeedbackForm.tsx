import { useState } from "react";

const sendFeedback = async (feedback: string) => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedback }),
  });

  if (!response.ok) {
    throw new Error('An error occurred while submitting feedback');
  }
}


const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendFeedback(feedback);
      setFeedback('');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Submit
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default FeedbackForm;