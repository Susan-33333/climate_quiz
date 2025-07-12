import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // 讀取 public 裡的 question_data.json（你自己的假問卷）
  useEffect(() => {
    fetch("/data/question_data.json")
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
