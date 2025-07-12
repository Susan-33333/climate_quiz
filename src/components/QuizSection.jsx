function QuizSection({ onNext }) {
  function handleSubmit() {
    const fakeAnswers = ["A", "C", "B", "A", "B", "C", "A", "B", "A", "B"];
    onNext(fakeAnswers); // 送出假的作答結果
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">🧪 模擬測驗中...</h2>
      <p className="mb-6">這是假的 Quiz 按鈕，點下去直接送出答案看看人格結果</p>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        模擬送出答案 → 看人格
      </button>
    </div>
  );
}

export default QuizSection;
