function ProgressBar({ progress }) {
    return (
        <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
                className="bg-green-500 h-full transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }} />
        </div>
    );
}

export default ProgressBar;