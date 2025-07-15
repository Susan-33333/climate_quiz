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
        progressCharacter.style.left = `calc(${progressPercent}% - 20px)`;
      }
    }
  }, [currentIndex, questions.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md md:rounded-3xl md:shadow-lg md:bg-white/80 md:backdrop-blur-sm md:p-10 flex flex-col justify-center space-y-10">
        {/* 進度條 */}
        <div className="relative h-6 w-full">
          <div className="absolute top-1 left-0 w-full h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full bg-orange-400 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div
            className="progress-character absolute -top-6 transition-all duration-700 ease-out"
            style={{ left: `calc(${((currentIndex + 1) / questions.length) * 100}% - 20px)` }}
          >
            <img
              src={`${import.meta.env.BASE_URL}mascot/T6.png`}
              alt="松鼠"
              className="w-7 h-7 object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* 問題區塊 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -300, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                氣候適應性測驗
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-8">
                {current.question}
              </h2>

              <div className="space-y-5">
                {Object.entries(current.options).map(([key, text]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                      selected === key
                        ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white border-orange-400 shadow-lg transform scale-105"
                        : "bg-white/50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-300"
                    }`}
                    whileHover={{ scale: selected === key ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selected === key ? "bg-white border-white" : "border-gray-300"
                        }`}
                      >
                        {selected === key && (
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-base md:text-lg font-medium">{text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <motion.button
                  onClick={handleNext}
                  disabled={!selected}
                  className={`px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                    selected
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
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