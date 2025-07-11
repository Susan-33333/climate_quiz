export default function TagsSuggestion({ userData, onNext }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Step 5: 居住/交通/旅遊建議</h1>
      <button className="mt-4 bg-purple-500 text-white px-4 py-2" onClick={() => onNext()}>
        下一步
      </button>
    </div>
  );
}
