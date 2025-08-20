const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

// Multer setup: store image in memory
const upload = multer({ storage: multer.memoryStorage() });

// Use Railway environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Root route
app.get('/', (req, res) => {
  res.send('👋 Shivam’s Telegram Image Bot is live on Railway!');
});

// Upload route
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('❌ No image uploaded');
  }

  try {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    await axios.post(telegramUrl, formData, {
      headers: formData.getHeaders(),
    });

    res.send('✅ Image sent to Telegram successfully!');
  } catch (error) {
    console.error('Telegram error:', error.response?.data || error.message);
    res.status(500).send('❌ Failed to send image to Telegram');
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
