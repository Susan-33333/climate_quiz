export default function StorySegment({ userData, onNext }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Step 2: 劇情段落</h1>
      <button className="mt-4 bg-green-500 text-white px-4 py-2" onClick={() => onNext()}>
        下一步
      </button>
    </div>
  );
}
