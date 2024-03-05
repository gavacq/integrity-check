'use client';

import { useState, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import Survey from './Survey';
import { useRouter } from 'next/navigation';

const FeedbackForm = () => {
  const posthog = usePostHog();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyID, setSurveyID] = useState('');
  const router = useRouter();

  useEffect(() => {
    posthog.getActiveMatchingSurveys((surveys) => {
      if (surveys.length > 0) {
        const survey = surveys[0];
        setSurveyID(survey.id);
        setSurveyTitle(survey.questions[0].question);
      }
    });
  }, [posthog]);

  // Removed the useEffect that checks local storage and directly set showSurvey to true
  const [showSurvey, setShowSurvey] = useState(true);

  const handleDismiss = () => {
    setShowSurvey(false);
    posthog.capture('survey dismissed', {
      $survey_id: surveyID, // required
    });
    router.push('/')
  };

  const handleSubmit = (value) => {
    setShowSurvey(false);
    posthog.capture('survey sent', {
      $survey_id: surveyID, // required
      $survey_response: value, // required
    });
    router.push('/')
  };

  useEffect(() => {
    if (posthog && surveyID && showSurvey) {
      posthog.capture('survey seen', {
        $survey_id: surveyID, // required
      });
    }
  }, [showSurvey, surveyID, posthog]);

  return (
    <div className="h-full flex flex-col grow items-center mt-20">
      {showSurvey && (
        <Survey
          title={surveyTitle}
          onDismiss={handleDismiss}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default FeedbackForm;
