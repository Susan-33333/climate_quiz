// QuizSection.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RadarChartResult from './RadarChartResult'; // 確保引入 RadarChartResult

function QuizSection() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = null; // 將其改為 null 確保初始沒有選取
  const [quizCompleted, setQuizCompleted] = useState(false); // 新增狀態來判斷測驗是否完成

  useEffect(() => {
    const loadData = async () => {
      try {
        // 從 public 資料夾載入 question_data.json
        const response = await fetch(`${import.meta.env.BASE_URL}public/data/question_data.json`);
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("載入問題失敗:", err);
        // 如果載入失敗，可以使用預設或模擬數據
      } finally {
        setLoading(false);
      }
    };

    setTimeout(loadData, 500); // 模擬網路延遲
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

  // 如果測驗完成，直接渲染 RadarChartResult
  if (quizCompleted) {
    // 這裡需要根據實際的測驗結果來計算 scores, mascot, regionSummary
    // 為了示範，這裡使用一些假數據
    const dummyScores = {
      happiness: 75,
      adaptability: 80,
      residence: 70,
      transport: 90,
      tourism: 85,
      joy: 70,
      explore: 95,
    };
    const dummyMascot = {
      name: "綠能小松鼠",
      image: "T6.png", // 使用您的松鼠圖片
    };
    const dummyRegionSummary = "根據您的選擇，您是一位熱愛戶外活動且注重永續生活的環保先鋒！您的氣候適應能力極佳，善於在各種環境中找到樂趣。";

    return (
      <RadarChartResult 
        scores={dummyScores} 
        mascot={dummyMascot} 
        regionSummary={dummyRegionSummary} 
      />
    );
  }

  const current = questions[currentIndex];
  // 進度條計算方式：已完成的題目數量 / 總題目數量
  const progressPercent = (currentIndex / questions.length) * 100;


  function handleSelect(option) {
    setSelected(option);
  }

  function handleNext() {
    const updatedAnswers = [...answers, selected];
    setAnswers(updatedAnswers);
    setSelected(null); // 清除選取狀態

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 測驗結束
      setQuizCompleted(true);
      // 在這裡可以處理所有的 answers，並傳遞給結果頁面
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      {/* 固定頂部進度條 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="px-6 py-4">
          {/* 進度條容器 */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-visible"> {/* 允許內容溢出 */}
            {/* 進度條填充 */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* 松鼠在進度條上跑動 */}
            <motion.div
              className="absolute transform -translate-x-1/2 z-10"
              // 松鼠的垂直位置調整，讓它稍微超出進度條
              style={{ top: '-1.5rem' }} // 向上移動，可以調整這個值
              animate={{ 
                left: `${progressPercent}%`
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            >
              <motion.img
                src={`${import.meta.env.BASE_URL}T6.png`} // 您的松鼠圖片路徑
                alt="松鼠"
                // 調整松鼠大小，使其小巧
                className="w-8 h-8 object-contain drop-shadow-lg" // w-8 h-8 可以讓松鼠小巧，您可以調整
                animate={{
                  y: [0, -4, 0], // 上下輕微浮動
                  rotate: [0, 5, -5, 0] // 左右輕微搖擺
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
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
                      className={`block w-full py-3 px-4 text-left rounded-xl border-2 transition-all duration-300 ${ // 調整 padding (py-3 px-4)
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
                        <span className="text-base font-medium">{text}</span> {/* 調整文字大小 text-base */}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8">
                  <motion.button
                    onClick={handleNext}
                    disabled={selected === null} // 只有當有選取時才能按下一題
                    className={`w-full py-4 rounded-xl text-base font-semibold transition-all duration-300 ${
                      selected !== null
                        ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={selected !== null ? { scale: 1.02, y: -2 } : {}}
                    whileTap={selected !== null ? { scale: 0.98 } : {}}
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
  // 將 currentStep 移除，直接使用 QuizSection 內部處理完成狀態
  // 因為需求是測驗結束直接顯示 RadarChartResult，不需要外部的狀態管理來切換
  return <QuizSection />;
}