import { useState } from 'react';
import { sections } from './data';
import ProgressBar from './components/ProgressBar';
import QuestionSection from './components/QuestionSection';
import ResultsPage from './components/ResultsPage';

function App() {
  const [currentSection, setCurrentSection] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isValidFullName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setNameError('Поле не может быть пустым');
      return false;
    }

    const parts = trimmed.split(/\s+/);

    if (parts.length < 2) {
      setNameError('Введите ФИО (минимум 2 слова)');
      return false;
    }

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isValidPart = /^[a-zA-Zа-яА-ЯёЁ]{2,}$/.test(part);
      if (!isValidPart) {
        setNameError(`"${part}" — должно содержать минимум 2 буквы (без цифр и спецсимволов)`);
        return false;
      }
    }

    setNameError('');
    return true;
  };

  const handleNameChange = (e) => {
    setFullName(e.target.value);
    if (nameError) {
      setNameError('');
    }
  };

  const startTest = () => {
    if (isValidFullName(fullName)) {
      setCurrentSection(0);
      setTimeout(scrollToTop, 50);
    }
  };

  const saveAnswer = (sectionId, statementIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${sectionId}_${statementIndex}`]: value
    }));
  };

  const getSectionSum = (sectionId) => {
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      const value = answers[`${sectionId}_${i}`];
      if (value !== undefined && value !== null && value !== '') {
        sum += Number(value) || 0;
      }
    }
    return sum;
  };

  const isSectionValid = (sectionId) => {
    return getSectionSum(sectionId) === 10;
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setTimeout(scrollToTop, 50);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    import('./utils/calculator').then(({ calculateResults }) => {
      const roleScores = calculateResults(answers);
      setResults(roleScores);
      setIsFinished(true);
      setTimeout(scrollToTop, 50);
    });
  };

  const goBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setTimeout(scrollToTop, 50);
    }
  };

  if (isFinished && results) {
    return <ResultsPage results={results} fullName={fullName.trim()} />;
  }

  if (currentSection === -1) {
    return (
        <div className="quiz-container">
          <h1 className="name-title">🧠 Тест Белбина</h1>
          <p className="name-subtitle">Диагностика командных ролей</p>

          <div className="name-form">
            <label htmlFor="fullName" className="name-label">
              Представьтесь, пожалуйста
            </label>
            <input
                type="text"
                id="fullName"
                className={`name-input ${nameError ? 'error' : ''}`}
                placeholder="Введите ваше ФИО"
                value={fullName}
                onChange={handleNameChange}
                onKeyDown={(e) => e.key === 'Enter' && startTest()}
            />
            {nameError && <div className="name-error">{nameError}</div>}
            <button className="name-button" onClick={startTest}>
              Начать тест →
            </button>
          </div>
        </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const sectionSum = getSectionSum(currentSectionData.id);
  const isValid = isSectionValid(currentSectionData.id);

  return (
      <div className="quiz-container">
        <div className="user-info">
          <span className="user-name">{fullName.trim()}</span>
        </div>

        <ProgressBar current={currentSection + 1} total={sections.length} />

        <QuestionSection
            section={currentSectionData}
            answers={answers}
            onAnswerChange={saveAnswer}
            sectionSum={sectionSum}
        />

        <div className="navigation">
          {currentSection > 0 && (
              <button className="nav-btn back" onClick={goBack}>
                ← Назад
              </button>
          )}

          <button
              className={`nav-btn next ${!isValid ? 'disabled' : ''} ${currentSection === 0 ? 'alone' : ''}`}
              onClick={nextSection}
              disabled={!isValid}
          >
            {currentSection === sections.length - 1 ? 'Завершить' : 'Далее →'}
          </button>
        </div>
      </div>
  );
}

export default App;