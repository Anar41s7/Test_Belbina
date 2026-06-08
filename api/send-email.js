export default async function handler(req, res) {
    // Разрешаем только POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Получаем данные
        const { name, results, topRole, topDescription, date } = req.body;

        console.log('=== ДИАГНОСТИКА ===');
        console.log('Получены данные:', { name, date, topRole });

        // 2. Проверяем импорт vercel-email
        let vercelEmailModule;
        let sendEmailFunc = null;

        try {
            vercelEmailModule = await import('vercel-email');
            console.log('Тип модуля:', typeof vercelEmailModule);
            console.log('Ключи модуля:', Object.keys(vercelEmailModule));
            console.log('Модуль:', vercelEmailModule);

            // Пробуем найти функцию sendEmail
            if (typeof vercelEmailModule === 'function') {
                sendEmailFunc = vercelEmailModule;
            } else if (vercelEmailModule.sendEmail && typeof vercelEmailModule.sendEmail === 'function') {
                sendEmailFunc = vercelEmailModule.sendEmail;
            } else if (vercelEmailModule.default && typeof vercelEmailModule.default === 'function') {
                sendEmailFunc = vercelEmailModule.default;
            } else if (typeof vercelEmailModule === 'object') {
                // Ищем любую функцию в объекте
                for (const key of Object.keys(vercelEmailModule)) {
                    if (typeof vercelEmailModule[key] === 'function') {
                        sendEmailFunc = vercelEmailModule[key];
                        console.log(`Найдена функция по ключу: ${key}`);
                        break;
                    }
                }
            }

            console.log('sendEmail найден?', !!sendEmailFunc);
            console.log('Тип sendEmail:', typeof sendEmailFunc);

        } catch (importError) {
            console.error('Ошибка импорта vercel-email:', importError.message);
        }

        // 3. Формируем письмо
        const emailHtml = `
      <h2>Результаты теста Белбина</h2>
      <p><strong>ФИО:</strong> ${escapeHtml(name)}</p>
      <p><strong>Дата:</strong> ${escapeHtml(date)}</p>
      <h3>Результаты по ролям:</h3>
      <pre>${escapeHtml(results)}</pre>
      <h3>Ведущая роль:</h3>
      <p><strong>${escapeHtml(topRole)}</strong></p>
      <p>${escapeHtml(topDescription)}</p>
    `;

        // 4. Пробуем отправить письмо через mail.baby (всегда работает)
        console.log('Пробуем отправить через mail.baby...');

        const babyResponse = await fetch('https://mail.baby/api/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'dima-demidov-05@list.ru',
                from: 'belbin-test@vercel.app',
                subject: `Тест: Результаты Белбина - ${name}`,
                html: emailHtml,
            }),
        });

        const babyResult = await babyResponse.text();
        console.log('Mail.baby ответ:', babyResult);

        if (!babyResponse.ok) {
            throw new Error(`Mail.baby error: ${babyResponse.status}`);
        }

        // 5. Успех
        return res.status(200).json({
            success: true,
            message: 'Письмо отправлено через mail.baby',
            diagnostic: {
                importSuccess: !!sendEmailFunc,
                mailbabySuccess: true
            }
        });

    } catch (error) {
        console.error('Ошибка:', error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}