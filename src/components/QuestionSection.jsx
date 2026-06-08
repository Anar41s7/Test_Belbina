import './QuestionSection.css';

function QuestionSection({ section, answers, onAnswerChange, sectionSum }) {
    const isSumValid = sectionSum === 10;

    const handleInputChange = (sectionId, idx, value) => {
        if (value === '' || value === null || isNaN(value)) {
            onAnswerChange(sectionId, idx, '');
            return;
        }

        let numValue = Number(value);
        if (numValue < 0) numValue = 0;
        if (numValue > 10) numValue = 10;
        onAnswerChange(sectionId, idx, numValue);
    };

    const handleBlur = (sectionId, idx, currentValue) => {
        if (currentValue === '' || currentValue === null || currentValue === undefined || currentValue === '') {
            onAnswerChange(sectionId, idx, 0);
        }
    };

    return (
        <div className="question-section">
            <h2 className="section-title">{section.title}</h2>
            <p className="section-instruction">
                Распределите 10 баллов между утверждениями
            </p>

            <div className="statements-list">
                {section.statements.map((statement, idx) => {
                    const currentValue = answers[`${section.id}_${idx}`];
                    const displayValue = currentValue === '' ? '' : (currentValue ?? 0);

                    return (
                        <div key={idx} className="statement-item">
                            <label className="statement-text">{statement}</label>
                            <input
                                type="number"
                                className="statement-input"
                                min="0"
                                max="10"
                                value={displayValue}
                                onChange={(e) => handleInputChange(section.id, idx, e.target.value)}
                                onBlur={(e) => handleBlur(section.id, idx, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>

            <div className={`sum-indicator ${isSumValid ? 'valid' : 'invalid'}`}>
                Сумма баллов: {sectionSum} / 10
                {!isSumValid && <span> (должно быть ровно 10)</span>}
            </div>
        </div>
    );
}

export default QuestionSection;