import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  description?: string;
}

interface QuizData {
  questions: Question[];
}

interface QuizPageProps {
  isOpen: boolean;
  onClose: () => void;
  quizData: QuizData | null;
}

function QuizPage({ isOpen, onClose, quizData: propQuizData }: QuizPageProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const { t } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (propQuizData) {
      setQuizData(propQuizData);
    } else {
      onClose();
    }
  }, [propQuizData, onClose]);

  if (!isOpen || !quizData) {
    return null;
  }

  return (
    <div className="flex-1 p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('quiz')}</h1>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          onClick={() => {
            onClose();
            setSelectedAnswers({});
          }}
        >
          {t('close')}
        </button>
      </div>

      {!showResults ? (
        <>
          {quizData?.questions?.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="text-lg font-semibold mb-4 text-gray-700">{question.text}</p>
              <div className="space-y-3">
                {question.options.map((option, optIndex) => {
                  const isSelected = selectedAnswers[index] === optIndex;
                  const isCorrect = option === question.correctAnswer;
                  const showFeedback = isSelected;

                  return (
                    <button
                      key={optIndex}
                      className={`w-full text-left p-3 rounded-md border transition duration-150 ease-in-out
                    ${showFeedback && isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${showFeedback && isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                    ${!showFeedback ? 'border-gray-300 bg-white hover:bg-gray-50' : ''}
                  `}
                      onClick={() =>
                        setSelectedAnswers({
                          ...selectedAnswers,
                          [index]: optIndex,
                        })
                      }
                    >
                      <label className="inline-flex items-center w-full cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optIndex.toString()}
                          checked={isSelected}
                          onChange={() =>
                            setSelectedAnswers({
                              ...selectedAnswers,
                              [index]: optIndex,
                            })
                          }
                          className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <span
                          className={`ml-3 text-base
                        ${showFeedback && isCorrect ? 'text-green-700 font-bold' : ''}
                        ${showFeedback && isSelected && !isCorrect ? 'text-red-700 font-bold' : ''}
                        ${!showFeedback ? 'text-gray-800' : ''}
                      `}
                        >
                          {option}
                        </span>
                        {showFeedback && isCorrect && (
                          <span className="ml-auto text-green-600 font-bold text-xl">✓</span>
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <span className="ml-auto text-red-600 font-bold text-xl">✗</span>
                        )}
                      </label>
                    </button>
                  );
                })}
              </div>
              {selectedAnswers[index] !== undefined && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p
                    className={`text-sm font-bold
                  ${question.options[selectedAnswers[index]] ===
                    question.correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'}
                `}>
                    {question.options[selectedAnswers[index]] ===
                    question.correctAnswer
                      ? t('correct')
                      : `${t('incorrect_answer_message')} ${question.correctAnswer}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {question.description}
                  </p>
                </div>
              )}
            </div>
          ))}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-150 ease-in-out mt-4 mb-2"
            onClick={() => {
              setShowResults(true);
            }}
          >
            {t('submit_answer')}
          </button>

          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-md transition duration-150 ease-in-out mb-6"
            onClick={() => {
              onClose();
              setSelectedAnswers({});
            }}
          >
            {t('close')}
          </button>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('quiz_results')}</h2>
          {(() => {
            const correctAnswersCount = quizData.questions.filter((question, index) =>
              question.options[selectedAnswers[index]] === question.correctAnswer
            ).length;
            return (
              <p className="text-lg text-gray-700 mb-6">
                {t('you_answered')} {correctAnswersCount} {t('out_of')} {quizData.questions.length} {t('questions_correctly')}.
              </p>
            );
          })()}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-150 ease-in-out mt-4"
            onClick={() => {
              onClose();
              setSelectedAnswers({});
              setShowResults(false);
            }}
          >
            {t('close_quiz')}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPage; 