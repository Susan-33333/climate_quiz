import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../components/ProgressBar"; // Make sure the path is correct

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/question_data.json`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming there are at least 8 questions as requested
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  // When a user selects an option
  function handleSelect(optionKey) {
    // 1. Set the selected option to give immediate visual feedback
    setSelected(optionKey);

    // 2. Wait for a moment before moving to the next question
    setTimeout(() => {
      const updatedAnswers = [...answers, optionKey];
      setAnswers(updatedAnswers);
      setSelected(null); // Reset selection for the next question

      // 3. Check if the quiz is over or move to the next question
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onNext(updatedAnswers); // End of quiz, show results
      }
    }, 400); // 400ms delay for a smooth transition
  }
  
  if (loading) return <p className="text-center">載入中...</p>;

  const current = questions[currentIndex];
  // Calculate progress. Assuming 8 questions total for a full bar as requested.
  const progressPercentage = ((currentIndex + 1) / 8) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center pt-20 p-4">
      <div className="w-full max-w-md flex flex-col justify-center py-12 space-y-8 relative">
        {/* Top Progress Bar */}
        <div className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-md px-6 py-4">
          {/* The progress prop now takes a percentage */}
          <ProgressBar progress={progressPercentage} />
        </div>

        {/* Question Card Area */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-6">
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    第 {currentIndex + 1} 題
                  </h3>
                  <h2 className="text-xl font-semibold text-green-800 leading-relaxed">
                    {current.question}
                  </h2>
                </div>

                <div className="space-y-3 mb-8">
                  {Object.entries(current.options).map(([key, text]) => (
                    <button
                      key={key}
                      // Disable all buttons once an option is selected
                      disabled={selected !== null}
                      onClick={() => handleSelect(key)}
                      // The className controls the button's size and appearance.
                      // 'px-6 py-5' creates the large button size you wanted.
                      className={`block w-full rounded-[36px] border-2 px-6 py-5 text-center font-bold text-lg transition-all duration-300 ${
                        selected === key
                          ? "bg-[#70472d] text-white border-[#70472d] shadow-lg ring-4 ring-yellow-100"
                          : "bg-white text-[#70472d] border-[#70472d] hover:shadow-[0_0_0_3px_rgba(112,71,45,0.4)]"
                      } ${
                        // Dims the other options when one is selected
                        selected !== null && selected !== key ? "opacity-50" : ""
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </div>

                {/* The "Next" button has been removed */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizSection;