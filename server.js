
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();

const FILE = path.join(__dirname, 'data', 'messages.json');
const ADMIN_FILE = path.join(__dirname, 'admin', 'index.html');

app.use(express.json({ limit: '10kb' }));

// Ensure data folder exists
fs.mkdirSync(path.dirname(FILE), { recursive: true });

// Read messages from JSON file
function readMessages() {
  let messages = [];

  try {
    messages = JSON.parse(fs.readFileSync(FILE, 'utf8'));

    if (!Array.isArray(messages)) {
      messages = [];
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Add IDs to older messages
  let changed = false;

  messages = messages.map((msg) => {
    if (!msg.id) {
      changed = true;
      return { ...msg, id: crypto.randomUUID() };
    }
    return msg;
  });

  if (changed) {
    writeMessages(messages);
  }

  return messages;
}

// Save messages to JSON file
function writeMessages(messages) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(messages, null, 2));
}

// Admin authentication
function adminAuth(req, res, next) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return res.status(503).send('Admin credentials are not configured.');
  }

  const auth = req.headers.authorization || '';

  if (!auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Jordan Admin"');
    return res.status(401).send('Admin login required.');
  }

  let credentials;

  try {
    credentials = Buffer.from(auth.slice(6), 'base64')
      .toString('utf8')
      .split(':');
  } catch (error) {
    return res.status(401).send('Invalid login.');
  }

  const enteredUsername = credentials.shift() || '';
  const enteredPassword = credentials.join(':');

  const safeCompare = (a, b) => {
    const first = Buffer.from(a);
    const second = Buffer.from(b);

    return first.length === second.length &&
      crypto.timingSafeEqual(first, second);
  };

  if (
    !safeCompare(enteredUsername, username) ||
    !safeCompare(enteredPassword, password)
  ) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Jordan Admin"');
    return res.status(401).send('Wrong username or password.');
  }

  next();
}

// Contact form API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (
    typeof name !== 'string' ||
    name.trim().length < 2
  ) {
    return res.status(400).json({ error: 'Enter your name.' });
  }

  if (
    typeof email !== 'string' ||
    !/^\S+@\S+\.\S+$/.test(email.trim())
  ) {
    return res.status(400).json({ error: 'Enter a valid email.' });
  }

  if (
    typeof message !== 'string' ||
    message.trim().length < 10
  ) {
    return res.status(400).json({
      error: 'Message needs at least 10 characters.'
    });
  }

  try {
    const messages = readMessages();

    messages.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      at: new Date().toISOString()
    });

    writeMessages(messages);

    res.json({ ok: true });
  } catch (error) {
    console.error('Message save error:', error);
    res.status(500).json({ error: 'Could not save message.' });
  }
});

// Protected Admin Dashboard page
app.get('/admin', adminAuth, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(ADMIN_FILE);
});

// Get all messages (Admin only)
app.get('/api/admin/messages', adminAuth, (req, res) => {
  try {
    const messages = readMessages();

    messages.sort((a, b) =>
      new Date(b.at) - new Date(a.at)
    );

    res.json(messages);
  } catch (error) {
    console.error('Message read error:', error);
    res.status(500).json({ error: 'Could not load messages.' });
  }
});

// Delete a message (Admin only)
app.delete('/api/admin/messages/:id', adminAuth, (req, res) => {
  try {
    const messages = readMessages();

    const updatedMessages = messages.filter(
      (msg) => msg.id !== req.params.id
    );

    if (updatedMessages.length === messages.length) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    writeMessages(updatedMessages);

    res.json({ ok: true });
  } catch (error) {
    console.error('Message delete error:', error);
    res.status(500).json({ error: 'Could not delete message.' });
  }
});

// Public website files
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Portfolio running on port ${port}`);
});
