import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3003;

// MIME типы для статических файлов
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    res.writeHead(200);
    res.end();
    return;
  }

  // OpenAI Proxy endpoint
  if (req.method === 'POST' && req.url === '/api/openai-proxy') {
    console.log('POST request to /api/openai-proxy received');
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      console.log('Request body received:', body);
      try {
        const { prompt, apiKey, type = 'text' } = JSON.parse(body);

        if (!prompt || !apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing prompt or API key' }));
          return;
        }

        console.log('Прокси: Отправляем запрос к OpenAI API...', type);

        let response, data;

        if (type === 'image') {
          // Генерация изображения с помощью DALL-E
          response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              prompt: prompt,
              n: 1,
              size: '512x512'
            })
          });
        } else {
          // Генерация текста с помощью GPT
          response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        }

        data = await response.json();

        console.log('Прокси: Получен ответ от OpenAI:', response.status);
        console.log('Прокси: Детали ответа:', JSON.stringify(data, null, 2));

        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (error) {
        console.error('Прокси ошибка:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  // Обработка статических файлов
  if (req.method === 'GET') {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, 'dist', filePath);

    try {
      const extname = path.extname(filePath);
      const contentType = mimeTypes[extname] || 'application/octet-stream';

      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error) {
      // Если файл не найден, возвращаем index.html для SPA
      if (error.code === 'ENOENT') {
        try {
          const content = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        } catch (spaError) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found');
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
      }
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Прокси для OpenAI API доступен на /api/openai-proxy');
}); 