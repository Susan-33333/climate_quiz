import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">載入中...</p>;

  const current = questions[currentIndex];

  function handleSelect(option) {
    setSelected(option);
  }

  function handleNext() {
    const updatedAnswers = [...answers, selected];
    setAnswers(updatedAnswers);
    setSelected(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNext(updatedAnswers);
    }
  }

  return (
    <div className="min-h-screen bg-yellow-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-8">

        {/* 進度條：圓點模式 */}
        <div className="flex justify-center space-x-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition ${
                idx === currentIndex
                  ? "bg-yellow-500 scale-125"
                  : "bg-yellow-300"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {current.question}
              </h2>

              <div className="space-y-4">
                {Object.entries(current.options).map(([key, text]) => (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`w-full border-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                      selected === key
                        ? "bg-yellow-500 text-white border-yellow-500 shadow-lg"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-yellow-100"
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!selected}
                className={`mt-10 px-8 py-3 rounded-lg font-semibold transition ${
                  selected
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-300 text-white cursor-not-allowed"
                }`}
              >
                {currentIndex + 1 === questions.length ? "查看結果" : "下一題"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default QuizSection;

  );
}

export default QuizSection;
