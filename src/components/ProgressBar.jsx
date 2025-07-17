function ProgressBar({ currentStep, totalSteps = 10, mascotSrc = null }) {
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="relative h-6 w-full">
            {/*松鼠角色*/}
            {mascotSrc && (
                <div
                    className="absolute z-20 -top-4 transition-all duration-700 ease-out"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                >
                    <img
                        src={mascotSrc}
                        alt="松鼠"
                        className="w-6 h-6 object-contain drop-shadow" />
                </div>
            )}
            {/* 進度條容器 */}
            <div className="relative w-full h-3 bg-red-200 rounded-full overflow-hidden">
                {/* 前景進度條 */}
                <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: "#70472d", // 深咖啡色
                    }} />
            </div>
        </div>
    );
}

export default ProgressBar;

