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
      id: 1,
      question: "載入失敗，你最不能忍受的天氣是？",
      options: {
        A: "冷到手腳冰冷",
        B: "熱到汗流浹背",
        C: "潮濕悶熱",
        D: "乾燥到皮膚緊繃"
      }
    }
  ];

  useEffect(() => {
    // 模擬載入時間，讓使用者看到載入動畫
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/question_data.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // 確保數據格式正確
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error("❌ 載入問題失敗，使用預設問題：", err);
        setQuestions(mockQuestions);
      } finally {
        setLoading(false);
      }
    };

    // 添加最小載入時間，讓動畫更流暢
    setTimeout(loadData, 500);
  }, []);

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
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col">
      {/* 固定頂部進度條 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="relative h-6 bg-purple-100 mx-4 my-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* 松鼠角色在進度條上跑動 */}
          <motion.div
            className="absolute top-0 transform -translate-y-1/2 transition-all duration-700 ease-out"
            animate={{ 
              left: `calc(${progressPercent}% - 16px)`,
              rotate: progressPercent > 0 ? [0, 10, -10, 0] : 0
            }}
            transition={{ 
              left: { duration: 0.8, ease: "easeOut" },
              rotate: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <motion.img
              src={`${import.meta.env.BASE_URL}mascot/T6.png`}
              alt="松鼠"
              className="w-8 h-8 object-contain drop-shadow-lg"
              animate={{
                y: [0, -2, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 pt-20 px-4 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 space-y-6"
            >
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                  氣候適應性測驗 ({currentIndex + 1}/{questions.length})
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 leading-relaxed mb-8">
                  {current.question}
                </h2>

                <div className="space-y-3">
                  {Object.entries(current.options).map(([key, text]) => (
                    <motion.button
                      key={key}
                      onClick={() => handleSelect(key)}
                      className={`block w-full p-4 text-center rounded-xl border-2 transition-all duration-300 ${
                        selected === key
                          ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-400 shadow-lg transform scale-105"
                          : "bg-white/70 text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md"
                      }`}
                      whileHover={{ 
                        scale: selected === key ? 1.05 : 1.02,
                        y: selected === key ? 0 : -2
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-base font-medium">{text}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8">
                  <motion.button
                    onClick={handleNext}
                    disabled={!selected}
                    className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                      selected
                        ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={selected ? { scale: 1.02, y: -2 } : {}}
                    whileTap={selected ? { scale: 0.98 } : {}}
                  >
                    {currentIndex + 1 === questions.length ? "查看結果 🎉" : "下一題 →"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="text-center text-gray-500 text-sm mt-6">
            <p>根據你的回答，我們將為你量身打造氣候適應建議</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizSection;