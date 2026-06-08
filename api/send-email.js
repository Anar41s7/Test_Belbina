import pkg from 'vercel-email';
const { sendEmail } = pkg;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, results, topRole, topDescription, date } = req.body;

        const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Результаты теста Белбина</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 16px;
          }
          h2 {
            color: #667eea;
            margin-bottom: 16px;
          }
          h3 {
            color: #374151;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          .info {
            background: #f3f4f6;
            padding: 12px 16px;
            border-radius: 12px;
            margin: 16px 0;
          }
          .roles {
            background: #f9fafb;
            padding: 12px 16px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
          }
          .roles pre {
            margin: 0;
            font-family: monospace;
            font-size: 14px;
            white-space: pre-wrap;
          }
          .top-role {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 16px;
            border-radius: 12px;
            color: white;
            text-align: center;
          }
          .top-role strong {
            font-size: 20px;
            display: block;
            margin: 8px 0;
          }
          .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 20px; background: #f5f7fa;">
        <div class="container">
          <h2>📊 Новые результаты теста Белбина</h2>
          <div class="info">
            <p><strong>👤 ФИО:</strong> ${escapeHtml(name)}</p>
            <p><strong>📅 Дата:</strong> ${escapeHtml(date)}</p>
          </div>
          <h3>🎯 Результаты по ролям</h3>
          <div class="roles">
            <pre>${escapeHtml(results)}</pre>
          </div>
          <h3>🏆 Ведущая роль</h3>
          <div class="top-role">
            <strong>${escapeHtml(topRole)}</strong>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${escapeHtml(topDescription)}</p>
          </div>
          <div class="footer">
            Тест Белбина — диагностика командных ролей
          </div>
        </div>
      </body>
      </html>
    `;

        // Вызов sendEmail
        const result = await sendEmail({
            to: 'dima-demidov-05@list.ru',
            from: 'belbin-test@vercel.app',
            subject: `📊 Результаты теста Белбина: ${escapeHtml(name)}`,
            html: emailHtml,
        });

        console.log('Результат отправки:', result);

        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error('Ошибка отправки:', error);
        return res.status(500).json({ error: error.message, stack: error.stack });
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