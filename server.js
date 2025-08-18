const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());
app.use('/images', express.static('uploads'));

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const CHAT_ID = 'YOUR_CHAT_ID'; // Can be user ID or group ID

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  try {
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', fs.createReadStream(filePath));

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    await axios.post(telegramUrl, form, {
      headers: form.getHeaders()
    });

    res.json({
      message: 'Image uploaded and sent to Telegram!',
      filename: req.file.filename,
      url: `/images/${req.file.filename}`
    });
  } catch (error) {
    console.error('Telegram upload failed:', error.message);
    res.status(500).json({ error: 'Failed to send image to Telegram' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
