export default function UserInputForm({ onNext, onSave }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Step 1: 使用者輸入</h1>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2" onClick={() => onNext()}>
        下一步
      </button>
    </div>
  );
}
