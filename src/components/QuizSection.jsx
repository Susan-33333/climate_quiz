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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center pt-20 p-4">
      <div className="w-full px-6 pt-4 fixed top-0 left-0 z-30 bg-white/80 backdrop-blur shadow-sm">
        <ProgressBar
          currentStep={currentIndex + 1}
          totalSteps={questions.length}
          mascotSrc={`${import.meta.env.BASE_URL}mascot/T6.png`}
        />
      </div>

      {/* 主要內容容器 - 響應式設計 */}
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative min-h-[400px] px-6 py-8">
          {/* 問題內容區域 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* 問題標題 */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  第 {currentIndex + 1} 題
                </h3>
                <h2 className="text-xl font-semibold text-green-800 leading-relaxed">
                  {current.question}
                </h2>
              </div>

            {/* 選項按鈕 */}
            <div className="space-y-4">
              {Object.entries(current.options).map(([key, text]) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`w-full border-2 rounded-full px-6 py-3 text-sm font-medium transition ${
                    selected === key
                      ? "bg-brown-500 text-white border-brown-500 shadow"
                      : "bg-white text-brown-700 border-brown-300 hover:bg-brown-50"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* 下一題 */}
            <div className="text-center">
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`mt-6 px-8 py-3 rounded-full text-white text-base font-semibold transition ${
                  selected
                    ? "bg-brown-600 hover:bg-brown-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {currentIndex + 1 === questions.length ? "查看結果" : "下一題"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
}

export default QuizSection;
