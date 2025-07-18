import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../components/ProgressBar"; // 這行要放在最上方

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

  if (loading) return <p className="text-center text-lg">載入中...</p>;

  const current = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / 8) * 100;

  // 當使用者選擇一個選項時的處理函式
  function handleSelect(optionKey) {
    // 1. 設定已選選項，立即提供視覺回饋
    setSelected(optionKey);

    // 2. 稍待片刻再跳到下一題，讓使用者能看到自己的選擇
    setTimeout(() => {
      const updatedAnswers = [...answers, optionKey];
      setAnswers(updatedAnswers);
      setSelected(null); // 為下一題重置選項狀態

      // 3. 檢查測驗是否結束，若否，則前進到下一題
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onNext(updatedAnswers); // 測驗結束，顯示結果
      }
    }, 300); // 延遲 300 毫秒，讓轉場更流暢
  }

  return (
    <div className="min-h-screen bg-[#E0E0E0] flex justify-center px-10 pt-28 sm:px-8">
      <div className="min-h-screen flex items-center justify-center pt-20 px-4 
      relative">
        {/* 頂部進度條 */}
        <div className="fixed top-0 left-0 w-full z-[99] bg-white/70 backdrop-blur-md px-6 py-4 shadow-md">
          <ProgressBar
            currentStep={currentIndex + 1}
            totalSteps={questions.length}
            mascotSrc={`${import.meta.env.BASE_URL}mascot/T6.png`}
          />
        </div>
        {/* 問題卡片區塊 */}
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 space-y-6 transition-all duration-500">
          <div className="relative min-h-[450px] sm:min-h-[400px] ">
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
                  <h3 className="text-xl sm:text-lg font-huninn text-gray-600 mb-2">
                    第   {currentIndex + 1}   題
                  </h3>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#004B97] text-center leading-relaxed px-2">
                    {current.question}
                  </h2>
                </div>

                <div className="space-y-10 sm:space-y-3 mb-6 sm:mb-8">
                  {Object.entries(current.options).map(([key, text]) => (
                    <button
                      key={key}
                      // 一旦有選項被選中，就禁用所有按鈕
                      disabled={selected !== null}
                      onClick={() => handleSelect(key)}
                      // className 控制按鈕的大小和外觀，並在選中後調暗其他選項
                      className={`block w-full rounded-[36px] border-2 px-6 py-5 text-center text-2xl font-bold transition-all duration-300
                        ${
                          selected === key
                            ? "bg-[#003D79] text-white border-[#004B97] shadow-lg ring-2 ring-yellow-200"
                            : "bg-white text-[#004B97] border-[#004B97] hover:bg-[#fdf5ec]"
                        }
                        ${selected !== null && selected !== key ? "opacity-50" : ""}
                      `}

                    >
                      {text}
                    </button>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizSection;
