import { useState } from 'react';
import { Check, X, Trophy, RotateCcw } from 'lucide-react';
import { Quiz as QuizType } from '../lib/supabase';
import { useSessionId } from '../hooks/useSessionId';
import { supabase } from '../lib/supabase';

interface QuizProps {
  quiz: QuizType;
  collectionId: string;
  onClose: () => void;
}

export default function Quiz({ quiz, collectionId, onClose }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const sessionId = useSessionId();

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;

  const handleAnswer = async (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (answerIndex === question.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowResult(true);
        saveProgress();
      }
    }, 1500);
  };

  const saveProgress = async () => {
    try {
      const finalScore = selectedAnswer === question.correct ? score + 1 : score;
      await supabase.from('user_progress').insert({
        session_id: sessionId,
        collection_id: collectionId,
        quiz_score: finalScore,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    let emoji = '';

    if (percentage === 100) {
      message = 'Parfait ! Vous êtes un expert !';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'Excellent travail !';
      emoji = '🌟';
    } else if (percentage >= 50) {
      message = 'Bien joué !';
      emoji = '👍';
    } else {
      message = 'Continuez à apprendre !';
      emoji = '📚';
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <Trophy className="w-16 h-16 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Vous avez obtenu {score} sur {totalQuestions} réponses correctes
          </p>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              {percentage}%
            </div>
            <p className="text-gray-700 dark:text-gray-300">Score final</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Recommencer</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} sur {totalQuestions}
          </span>
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Score: {score}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-amber-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct;
            const showFeedback = answered;

            let buttonClass =
              'w-full text-left p-4 rounded-lg border-2 transition-all font-medium ';

            if (showFeedback) {
              if (isCorrect) {
                buttonClass +=
                  'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300';
              } else if (isSelected) {
                buttonClass +=
                  'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300';
              } else {
                buttonClass +=
                  'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 opacity-50';
              }
            } else {
              buttonClass +=
                'border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 text-gray-900 dark:text-white';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showFeedback && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                  {showFeedback && isSelected && !isCorrect && (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Annuler
      </button>
    </div>
  );
}
