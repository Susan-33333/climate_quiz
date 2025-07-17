import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../components/ProgressBar"; // 這行要放在最上方

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // 讀取 public 裡的 question_data.json
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
      onNext(updatedAnswers); // 全部完成，傳出 answers 給 App.jsx
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
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
              <div className="space-y-3 mb-8">
                {Object.entries(current.options).map(([key, text]) => (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`block w-full border-2 rounded-xl px-5 py-4 text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      selected === key
                        ? "bg-green-600 text-white border-green-600 shadow-lg ring-4 ring-green-200"
                        : "bg-white hover:bg-green-50 border-gray-200 hover:border-green-300 shadow-sm"
                    }`}
                  >
                    <span className="font-medium text-sm text-gray-500">
                      {key}.
                    </span>
                    <span className="ml-2 text-base">
                      {text}
                    </span>
                  </button>
                ))}
              </div>

              {/* 下一題按鈕 */}
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className="block w-full rounded-[36px] border-2 px-6 py-5 text-center font-bold text-lg transition-all duration-300 
                    bg-[#70472d] text-white border-[#70472d] shadow-lg hover:shadow-[0_0_0_3px_rgba(112,71,45,0.4)]"
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