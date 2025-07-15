import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative overflow-hidden min-h-[300px] px-4 pb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute w-full"
        >
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            問題 {currentIndex + 1}：{current.question}
          </h2>

          <div className="space-y-3">
            {Object.entries(current.options).map(([key, text]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`block w-full border rounded-lg px-4 py-3 text-left transition ${
                  selected === key
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-green-100"
                }`}
              >
                {key}. {text}
              </button>
            ))}
          </div>
      {/* 進度條 */}
            <div class="relative my-20 mx-5">
              <div class="rounded-full border border-red-500 p-1">
                <div class="flex h-6 items-center justify-center rounded-full bg-red-300 text-xs leading-none" style={{ width: "85%", height: "85%" }}>
                  <span class="p-1 text-white">85%</span>
              </div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="h-8 w-8 rounded-full bg-red-500"></div>
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`mt-6 px-6 py-2 rounded-lg text-white ${
              selected ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {currentIndex + 1 === questions.length ? "查看結果" : "下一題"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default QuizSection;
