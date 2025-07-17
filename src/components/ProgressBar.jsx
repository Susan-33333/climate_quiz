function ProgressBar({ currentStep, totalSteps = 10, mascotSrc = null }) {
    // 修正進度計算，確保不會完全填滿
    const maxProgress = 90; // 最大進度不超過90%
    const rawPercentage = (currentStep / totalSteps) * 100;
    const percentage = Math.min(rawPercentage, maxProgress);

    return (
        <div className="relative h-6 w-full">
            {/* 松鼠角色 */}
            {mascotSrc && (
                <div
                    className="absolute z-20 -top-4 transition-all duration-700 ease-out"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                >
                    <img
                        src={mascotSrc}
                        alt="松鼠"
                        className="w-6 h-6 object-contain drop-shadow" 
                    />
                </div>
            )}
            {/* 進度條容器 */}
            <div className="relative w-full h-3 bg-green-100 rounded-full overflow-hidden border border-red-500">
                {/* 前景進度條 */}
                <div
                    className="h-full transition-all duration-700 ease-out rounded-full"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: "#70472d", // 深咖啡色
                    }} 
                />
            </div>
        </div>
    );
}

export default ProgressBar;