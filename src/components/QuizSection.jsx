import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const mockQuestions = [
    {
      question: "載入失敗，你最喜歡哪種天氣？",
      options: {
        A: "晴天",
        B: "雨天",
        C: "陰天",
        D: "下雪天"
      }
    }
  ];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/question_data.json`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ 載入問題失敗，使用預設問題：", err);
        setQuestions(mockQuestions);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const progressPercent = ((currentIndex + 1) / questions.length) * 100;
      const progressBar = document.querySelector(".progress-bar");
      const progressCharacter = document.querySelector(".progress-character");
      if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
      }
      if (progressCharacter) {
        progressCharacter.style.left = `calc(${progressPercent}% - 16px)`;
      }
    }
  }, [currentIndex, questions.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">載入問題中...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 pt-16 px-4">
      {/* 固定頂部進度條 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-4 bg-purple-100">
        <div
          className="progress-bar h-full bg-purple-400 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
        <div
          className="progress-character absolute -top-3 transition-all duration-700 ease-out"
          style={{ left: `calc(${((currentIndex + 1) / questions.length) * 100}% - 16px)` }}
        >
          <img
            src={`${import.meta.env.BASE_URL}mascot/T6.png`}
            alt="松鼠"
            className="w-6 h-6 object-contain"
          />
        </div>
      </div>

      {/* 問題卡片 */}
      <div className="w-full max-w-md mx-auto md:rounded-3xl md:shadow-lg md:bg-white/80 md:backdrop-blur-sm md:p-10 flex flex-col justify-center space-y-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -300, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                氣候適應性測驗
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-8">
                {current.question}
              </h2>

              <div className="space-y-4">
                {Object.entries(current.options).map(([key, text]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`block w-full max-w-sm mx-auto p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                      selected === key
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-400 shadow-lg transform scale-105"
                        : "bg-white/50 text-gray-700 border-gray-200 hover:bg-purple-100 hover:border-purple-300"
                    }`}
                    whileHover={{ scale: selected === key ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base md:text-lg font-medium">{text}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <motion.button
                  onClick={handleNext}
                  disabled={!selected}
                  className={`px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                    selected
                      ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  whileHover={selected ? { scale: 1.05 } : {}}
                  whileTap={selected ? { scale: 0.95 } : {}}
                >
                  {currentIndex + 1 === questions.length ? "查看結果 🎉" : "下一題 →"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center text-gray-400 text-sm">
          <p>根據你的回答，我們將為你量身打造氣候適應建議</p>
        </div>
      </div>
    </div>
  );
}

export default QuizSection;