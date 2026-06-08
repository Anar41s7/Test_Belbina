import './ProgressBar.css';

function ProgressBar({ current, total }) {
    const progress = (current / total) * 100;

    return (
        <div className="progress-container">
            <div className="progress-header">
                <span>Прогресс</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}

export default ProgressBar;