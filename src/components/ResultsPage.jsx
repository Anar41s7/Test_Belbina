import { useState, useRef } from 'react';
import { roleNames, roleFullDescriptions } from '../data';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ResultsPage({ results, fullName }) {
    const { sortedRoles, topRole } = results;
    const [showDescription, setShowDescription] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const pdfContentRef = useRef();

    const toggleDescription = () => {
        const scrollY = window.scrollY;
        setShowDescription(!showDescription);
        setTimeout(() => {
            window.scrollTo(0, scrollY);
        }, 0);
    };

    const sendResultsToEmail = () => {
        alert('Функция отправки на почту будет настроена позже');
    };

    const downloadPDF = async () => {
        if (!pdfContentRef.current || isGenerating) return;

        setIsGenerating(true);

        try {
            const scoreElements = pdfContentRef.current.querySelectorAll('.role-score');
            const originalStyles = [];

            scoreElements.forEach((element) => {
                originalStyles.push({
                    element,
                    background: element.style.background,
                    webkitBackgroundClip: element.style.webkitBackgroundClip,
                    backgroundClip: element.style.backgroundClip,
                    color: element.style.color,
                });
                element.style.background = 'none';
                element.style.webkitBackgroundClip = 'unset';
                element.style.backgroundClip = 'unset';
                element.style.color = '#667eea';
            });

            const descriptionDiv = pdfContentRef.current.querySelector('.full-description');
            const wasHidden = descriptionDiv && descriptionDiv.style.display === 'none';
            if (wasHidden) {
                descriptionDiv.style.display = 'block';
            }

            const canvas = await html2canvas(pdfContentRef.current, {
                scale: 3,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: false,
                letterRendering: true,
            });

            if (wasHidden) {
                descriptionDiv.style.display = 'none';
            }

            originalStyles.forEach(({ element, background, webkitBackgroundClip, backgroundClip, color }) => {
                element.style.background = background;
                element.style.webkitBackgroundClip = webkitBackgroundClip;
                element.style.backgroundClip = backgroundClip;
                element.style.color = color;
            });

            const imgData = canvas.toDataURL('image/png');
            const pdfDoc = new JsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pageHeight = 277;
            const marginTop = 15;

            if (imgHeight > pageHeight - marginTop * 2) {
                pdfDoc.addImage(imgData, 'PNG', 15, marginTop, imgWidth, pageHeight - marginTop * 2);
            } else {
                pdfDoc.addImage(imgData, 'PNG', 15, marginTop, imgWidth, imgHeight);
            }

            pdfDoc.save('Test_Belbina.pdf');
        } catch (error) {
            console.error('Ошибка при создании PDF:', error);
            alert('Произошла ошибка при создании PDF. Попробуйте ещё раз.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="quiz-container results-container">
            <div ref={pdfContentRef}>
                <h1 className="results-title">
                    {fullName ? `${fullName}, ` : ''}Ваши командные роли
                </h1>
                <p className="results-subtitle">Результаты теста Белбина</p>

                <div className="roles-grid">
                    {sortedRoles.map(({ role, score }) => (
                        <div key={role} className="role-item">
                            <span className="role-name">{roleNames[role]}</span>
                            <span className="role-score">{score} баллов</span>
                        </div>
                    ))}
                </div>

                <div className="top-role">
                    <p>Ваша ведущая роль</p>
                    <h3>{roleNames[topRole]}</h3>
                    <p className="role-desc">
                        {topRole === "И" && "Вы — исполнитель. Систематичны, надёжны, доводите дела до конца."}
                        {topRole === "П" && "Вы — координатор. Спокойны, уверены, умеете организовать работу."}
                        {topRole === "Ф" && "Вы — формирователь. Энергичны, мотивируете команду к действию."}
                        {topRole === "М" && "Вы — мыслитель. Креативны, генерируете нестандартные идеи."}
                        {topRole === "Р" && "Вы — разведчик. Общительны, ищете ресурсы и контакты."}
                        {topRole === "О" && "Вы — оценщик. Объективны, анализируете риски и решения."}
                        {topRole === "К" && "Вы — коллективист. Поддерживаете атмосферу, сглаживаете конфликты."}
                        {topRole === "Д" && "Вы — доводчик. Упорны, настаиваете на завершении работы."}
                    </p>
                </div>

                <div className="full-description" style={{ display: showDescription ? 'block' : 'none' }}>
                    <h4>Полное описание</h4>
                    <p>{roleFullDescriptions[topRole]}</p>
                </div>
            </div>

            <button className="details-button" onClick={toggleDescription}>
                {showDescription ? 'Скрыть описание' : 'Подробнее о роли'}
            </button>

            <div className="action-buttons">
                <button className="action-btn download-btn" onClick={downloadPDF} disabled={isGenerating}>
                    {isGenerating ? 'Создание PDF...' : 'Скачать результаты'}
                </button>
                <button className="action-btn email-btn" onClick={sendResultsToEmail}>
                    Отправить результаты
                </button>
            </div>
        </div>
    );
}

export default ResultsPage;