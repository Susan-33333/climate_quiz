import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // 使用提供的問題數據
  const questionData = [
    {
      id: 1,
      question: "你最不能忍受的天氣是？",
      options: {
        A: "冷到手腳冰冷",
        B: "熱到汗流浹背",
        C: "潮濕悶熱",
        D: "乾燥到皮膚緊繃"
      }
    },
    {
      id: 2,
      question: "你最常使用的交通工具是？",
      options: {
        A: "腳踏車或步行",
        B: "大眾運輸",
        C: "自己開車或騎機車"
      }
    },
    {
      id: 3,
      question: "如果你有一天放假，你最想做什麼？",
      options: {
        A: "爬山健行",
        B: "跟朋友去海邊",
        C: "宅在家打電動"
      }
    },
    {
      id: 4,
      question: "你認為環保這件事…",
      options: {
        A: "是每個人都該做的",
        B: "政府要做更多",
        C: "知道重要但很難做到"
      }
    },
    {
      id: 5,
      question: "你選擇居住地的首要考量是？",
      options: {
        A: "氣候穩定、安全",
        B: "交通便利、機能好",
        C: "便宜、房租壓力小"
      }
    },
    {
      id: 6,
      question: "你對氣候變遷的感受是？",
      options: {
        A: "很明顯有變化",
        B: "有一點點，但無感",
        C: "不太相信有什麼差"
      }
    },
    {
      id: 7,
      question: "你會為了環保放棄便利嗎？",
      options: {
        A: "願意，甚至樂在其中",
        B: "可以接受一點點",
        C: "太不方便就不做了"
      }
    },
    {
      id: 8,
      question: "你未來旅遊最想去哪裡？",
      options: {
        A: "永續生態村",
        B: "熱門觀光景點",
        C: "冷門秘境"
      }
    }
  ];

  useEffect(() => {
    // 模擬載入
    setTimeout(() => {
      setQuestions(questionData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="relative px-4 py-3">
          {/* 進度條背景 */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            {/* 進度條填充 */}
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          {/* T6 松鼠角色在進度條上跑動 */}
          <motion.div
            className="absolute top-1 transform -translate-y-1/2"
            animate={{ 
              left: `calc(${Math.max(progressPercent, 5)}% - 12px)` // 確保不會超出左邊界
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut" 
            }}
          >
            <motion.div
              className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              animate={{
                y: [0, -2, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <span className="text-xs">🐿️</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 pt-24 pb-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6"
            >
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                  氣候適應性測驗 ({currentIndex + 1}/{questions.length})
                </div>
                
                <h2 className="text-lg font-bold text-gray-800 leading-relaxed mb-6">
                  {current.question}
                </h2>

                <div className="space-y-3">
                  {Object.entries(current.options).map(([key, text]) => (
                    <motion.button
                      key={key}
                      onClick={() => handleSelect(key)}
                      className={`block w-full p-3 text-left rounded-lg border-2 transition-all duration-300 ${
                        selected === key
                          ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white border-purple-400 shadow-lg"
                          : "bg-white/80 text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md"
                      }`}
                      whileHover={{ 
                        scale: 1.02,
                        y: -1
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <span className={`inline-block w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mr-3 ${
                          selected === key 
                            ? "bg-white text-purple-600" 
                            : "bg-purple-100 text-purple-600"
                        }`}>
                          {key}
                        </span>
                        <span className="text-sm font-medium">{text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6">
                  <motion.button
                    onClick={handleNext}
                    disabled={!selected}
                    className={`w-full py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
                      selected
                        ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={selected ? { scale: 1.02, y: -1 } : {}}
                    whileTap={selected ? { scale: 0.98 } : {}}
                  >
                    {currentIndex + 1 === questions.length ? "查看結果 🎉" : "下一題 →"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="text-center text-gray-500 text-xs mt-4">
            <p>根據你的回答，我們將為你量身打造氣候適應建議</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizSection;