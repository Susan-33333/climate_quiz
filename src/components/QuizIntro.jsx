function QuizIntro({ onStart }) {
  return (
    <div className="text-center px-6 py-12">
      <img
        {setBgImage(`${import.meta.env.BASE_URL}assets/quiz-start.png`)}
        alt="開始測驗圖片"
        className="w-full"
      />
      <h2 className="text-3xl font-bold text-green-700 mb-4">氣候人格測驗</h2>
      <p className="text-gray-700 mb-6">
        我們將透過 10 題問題，幫你了解你對氣候變遷的態度與行動風格，並找到屬於你的吉祥物角色 ✨
      </p>
      <button
        onClick={onStart}
        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
      >
        開始測驗
      </button>
    </div>
  );
}

export default QuizIntro;
