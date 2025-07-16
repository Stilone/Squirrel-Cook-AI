import express from 'express';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// OpenAI Proxy endpoint
app.post('/api/openai-proxy', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    if (!prompt || !apiKey) {
      return res.status(400).json({ error: 'Missing prompt or API key' });
    }

    console.log('Прокси: Отправляем запрос к OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        temperature: 0.6,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    console.log('Прокси: Получен ответ от OpenAI:', response.status);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Прокси ошибка:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Прокси для OpenAI API доступен на /api/openai-proxy');
}); 