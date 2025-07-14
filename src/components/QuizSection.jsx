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
      })
      .catch((err) => {
        console.error("❌ 題目載入失敗：", err);
      });
  }, []);

  if (loading) return <p className="text-center">載入中...</p>;

  const current = questions[currentIndex];

  function handleSelect(option) {
    setSelected(option);
  }

  function handleNext() {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("✅ 所有題目完成，傳送答案：", newAnswers);
      onNext?.(newAnswers); // ✅ 使用新生成答案
    }
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 relative">
        {/* 進度條 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-xl overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-green-800 text-center">
              問題 {currentIndex + 1} / {questions.length}
            </h2>

            <div className="space-y-4">
              <p className="text-lg text-gray-800 font-medium text-center mb-4">
                {current.question}
              </p>
              {Object.entries(current.options).map(([key, text]) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`block w-full border rounded-lg px-5 py-3 text-left transition font-medium shadow-sm ${
                    selected === key
                      ? "bg-green-600 text-white"
                      : "bg-white hover:bg-green-100"
                  }`}
                >
                  {key}. {text}
                </button>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
                  selected
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
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
