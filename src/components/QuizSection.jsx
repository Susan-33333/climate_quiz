import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  // 模擬問題數據
  const mockQuestions = [
    {
      question: "面對氣候變化，你最希望改善哪個方面？",
      options: {
        A: "提升居住環境的舒適度",
        B: "改善交通工具的環保性",
        C: "增加旅遊體驗的豐富度",
        D: "提高整體生活的幸福感"
      }
    },
    {
      question: "你認為未來30年最重要的氣候適應策略是？",
      options: {
        A: "建設更多綠色建築",
        B: "發展清潔能源交通",
        C: "保護自然旅遊景點",
        D: "提升社區適應能力"
      }
    },
    {
      question: "在極端天氣來臨時，你最優先考慮的是？",
      options: {
        A: "居住安全與舒適",
        B: "交通便利與可靠",
        C: "旅遊計劃的彈性",
        D: "整體生活品質"
      }
    },
    {
      question: "你最願意在哪方面投資以應對氣候變化？",
      options: {
        A: "節能住宅設備",
        B: "環保交通工具",
        C: "永續旅遊體驗",
        D: "社區環境改善"
      }
    },
    {
      question: "面對未來氣候挑戰，你希望政府優先發展？",
      options: {
        A: "防災住宅政策",
        B: "綠色交通建設",
        C: "生態旅遊推廣",
        D: "全面環境保護"
      }
    },
    {
      question: "你認為個人可以為氣候適應做出的最大貢獻是？",
      options: {
        A: "選擇環保住宅",
        B: "使用綠色交通",
        C: "支持生態旅遊",
        D: "推廣環保意識"
      }
    },
    {
      question: "在規劃未來生活時，你最重視的氣候因素是？",
      options: {
        A: "居住地的氣候穩定性",
        B: "交通系統的氣候適應性",
        C: "旅遊目的地的氣候友善度",
        D: "整體環境的可持續性"
      }
    },
    {
      question: "你希望在氣候變化中保持哪種生活方式？",
      options: {
        A: "舒適安全的居住體驗",
        B: "便捷環保的出行方式",
        C: "豐富多元的旅遊體驗",
        D: "平衡和諧的生活節奏"
      }
    }
  ];

  useEffect(() => {
    // 模擬從API獲取問題
    setTimeout(() => {
      setQuestions(mockQuestions);
      setLoading(false);
    }, 500);
  }, []);

  // 更新頁面進度條
  useEffect(() => {
    if (questions.length > 0) {
      const progressPercent = ((currentIndex + 1) / questions.length) * 100;
      
      // 找到進度條元素並更新
      const progressBar = document.querySelector('.progress-bar');
      const progressCharacter = document.querySelector('.progress-character');
      
      if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
      }
      
      if (progressCharacter) {
        progressCharacter.style.left = `calc(${progressPercent}% - 12px)`;
      }
    }
  }, [currentIndex, questions.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 relative">
      {/* 頂部進度條 */}
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min={0}
            max={100}
            value={current.score}
            readOnly
            className="w-full"
          />
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
            {/* 進度條上的小人 */}
            <div
              className="progress-character absolute -top-2 transition-all duration-700 ease-out"
              style={{ left: `calc(${((currentIndex + 1) / questions.length) * 100}% - 14px)` }}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-orange-400">
                <span className="text-sm"> </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
          </div>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                    氣候適應性測驗
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                    {current.question}
                  </h2>
                </div>

                <div className="space-y-4">
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
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selected === key 
                            ? "bg-white border-white" 
                            : "border-gray-300"
                        }`}>
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

          {/* 底部裝飾 */}
          <div className="text-center text-gray-400 text-sm">
            <p>根據你的回答，我們將為你量身打造氣候適應建議</p>
          </div>
        </div>
      </div>

      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-200 rounded-full blur-2xl opacity-20"></div>
      </div>
    </div>
  );
}

export default QuizSection;