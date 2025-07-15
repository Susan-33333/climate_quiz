// QuizSection.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QuizSection({ onNext }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}question_data.json`);
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("載入問題失敗:", err);
        // Fallback to mock data if JSON loading fails, though not strictly needed if JSON is guaranteed
        // setQuestions(mockQuestions);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(loadData, 500); // Simulate network delay
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
      {/* Fixed top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="px-6 py-4">
          {/* Progress bar container */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-visible"> {/* Changed to overflow-visible */}
            {/* Progress bar fill */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* Squirrel on the progress bar */}
            <motion.div
              className="absolute -top-6 transform -translate-x-1/2 z-10" /* Adjusted -top- to move it above */
              animate={{ 
                left: `${progressPercent}%`
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut" 
              }}
            >
              <motion.div
                className="w-12 h-12 relative" /* Increased size for better visibility, adjust as needed */
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
                  src={`${import.meta.env.BASE_URL}T6.png`} // Directly using T6.png
                  alt="松鼠"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) { // Check if nextSibling exists
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback squirrel design (hidden by default) */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-full items-center justify-center shadow-lg border-2 border-white hidden"
                  style={{ display: 'none' }}
                >
                  <div className="text-xs">🐿️</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Progress text */}
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>氣候適應性測驗</span>
            <span>{currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
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

// Main application component
export default function ClimateQuizApp() {
  const [currentStep, setCurrentStep] = useState('quiz');
  const [results, setResults] = useState(null);

  const handleQuizComplete = (answers) => {
    // In a real application, you would process these answers to calculate scores
    // and determine the mascot/region summary. For this example, we'll just pass
    // dummy data to RadarChartResult.
    const dummyScores = {
      happiness: Math.floor(Math.random() * 100),
      adaptability: Math.floor(Math.random() * 100),
      residence: Math.floor(Math.random() * 100),
      transport: Math.floor(Math.random() * 100),
      tourism: Math.floor(Math.random() * 100),
      joy: Math.floor(Math.random() * 100),
      explore: Math.floor(Math.random() * 100),
    };

    const dummyMascot = {
      name: "綠能小松鼠", // Example mascot name
      image: "T6.png", // Use the squirrel image
    };

    const dummyRegionSummary = "根據您的選擇，您是一位熱愛戶外活動且注重永續生活的環保先鋒！您的氣候適應能力極佳，善於在各種環境中找到樂趣。";

    setResults({ answers, scores: dummyScores, mascot: dummyMascot, regionSummary: dummyRegionSummary });
    setCurrentStep('results');
  };

  if (currentStep === 'quiz') {
    return <QuizSection onNext={handleQuizComplete} />;
  }

  // If currentStep is 'results', render RadarChartResult
  if (currentStep === 'results' && results) {
    return (
      <RadarChartResult 
        scores={results.scores} 
        mascot={results.mascot} 
        regionSummary={results.regionSummary} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">測驗完成！</h2>
        <p className="text-gray-600 mb-6">感謝您完成氣候適應性測驗</p>
        <div className="text-left bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">您的回答：</h3>
          {results?.answers && results.answers.map((answer, index) => (
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