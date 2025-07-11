export default function ResultPersonality({ userData, onNext }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Step 4: 人格分析</h1>
      <button className="mt-4 bg-pink-500 text-white px-4 py-2" onClick={() => onNext()}>
        下一步
      </button>
    </div>
  );
}
