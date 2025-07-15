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
    // 模擬載入問題數據
    const loadData = async () => {
      try {
        // 這裡會從您的 JSON 文件載入問題
        // const response = await fetch(`${import.meta.env.BASE_URL}data/question_data.json`);
        // const data = await response.json();
        // setQuestions(data);
        
        // 暫時使用模擬數據
        setQuestions(mockQuestions);
      } catch (err) {
        console.error("載入問題失敗，使用預設問題：", err);
        setQuestions(mockQuestions);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(loadData, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      {/* 固定頂部進度條 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="px-6 py-4">
          {/* 進度條容器 */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* 進度條背景 */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* 松鼠在進度條上 */}
            <motion.div
              className="absolute -top-2 transform -translate-x-1/2 z-10"
              animate={{ 
                left: `${progressPercent}%`
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            >
              {/* 使用您的松鼠圖片 */}
              <motion.div
                className="w-7 h-7 relative"
                animate={{
                  y: [0, -2, 0],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}mascot/T6.png`}
                  alt="松鼠"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    // 如果圖片載入失敗，使用您提供的松鼠造型
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* 備用松鼠設計 */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-full items-center justify-center shadow-lg border-2 border-white hidden"
                  style={{ display: 'none' }}
                >
                  <div className="text-xs">🐿️</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* 進度文字 */}
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>氣候適應性測驗</span>
            <span>{currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 pt-24 px-4 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.5, 
                type: "spring", 
                stiffness: 100, 
                damping: 20 
              }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 leading-relaxed mb-8">
                  {current.question}
                </h2>

                <div className="space-y-3">
                  {Object.entries(current.options).map(([key, text]) => (
                    <motion.button
                      key={key}
                      onClick={() => handleSelect(key)}
                      className={`block w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        selected === key
                          ? "bg-gradient-to-r from-green-400 to-blue-500 text-white border-green-400 shadow-lg"
                          : "bg-white/80 text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md"
                      }`}
                      whileHover={{ 
                        scale: 1.02,
                        y: -1
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-3 opacity-80">{key}.</span>
                        <span className="text-sm font-medium">{text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8">
                  <motion.button
                    onClick={handleNext}
                    disabled={!selected}
                    className={`w-full py-4 rounded-xl text-base font-semibold transition-all duration-300 ${
                      selected
                        ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={selected ? { scale: 1.02, y: -2 } : {}}
                    whileTap={selected ? { scale: 0.98 } : {}}
                  >
                    {currentIndex + 1 === questions.length ? "查看結果" : "下一題 →"}
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

// 主要應用程式組件
export default function ClimateQuizApp() {
  const [currentStep, setCurrentStep] = useState('quiz');
  const [results, setResults] = useState(null);

  const handleQuizComplete = (answers) => {
    setResults(answers);
    setCurrentStep('results');
  };

  if (currentStep === 'quiz') {
    return <QuizSection onNext={handleQuizComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">測驗完成！</h2>
        <p className="text-gray-600 mb-6">感謝您完成氣候適應性測驗</p>
        <div className="text-left bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">您的回答：</h3>
          {results && results.map((answer, index) => (
            <div key={index} className="text-sm text-gray-600">
              第 {index + 1} 題: {answer}
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentStep('quiz')}
          className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          重新測驗
        </button>
      </div>
    </div>
  );
}