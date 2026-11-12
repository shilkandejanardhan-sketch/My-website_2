const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const FILE = path.join(__dirname, 'data', 'messages.json');

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', (req, res) => {
  const { name = '', email = '', message = '' } = req.body || {};
  if (name.trim().length < 2) return res.status(400).json({ error: 'Enter your name.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email.' });
  if (message.trim().length < 10) return res.status(400).json({ error: 'Message needs at least 10 characters.' });
  let list = [];
  try { list = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) {}
  list.push({ name: name.trim(), email: email.trim(), message: message.trim(), at: new Date().toISOString() });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
