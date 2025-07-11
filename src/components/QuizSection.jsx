export default function QuizSection({ userData, onNext }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Step 3: 問答介面</h1>
      <button className="mt-4 bg-yellow-500 text-white px-4 py-2" onClick={() => onNext()}>
        下一步
      </button>
    </div>
  );
}
