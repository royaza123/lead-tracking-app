const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ הכי חשוב ל-Render

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const leadsFile = 'leads.json';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/leads', async (req, res) => {
  const { name, phone, email, wantsCourse } = req.body;
  const newLead = { name, phone, email, wantsCourse, date: new Date().toISOString() };
  const data = fs.existsSync(leadsFile) ? JSON.parse(fs.readFileSync(leadsFile)) : [];
  data.push(newLead);
  fs.writeFileSync(leadsFile, JSON.stringify(data, null, 2));

  if (wantsCourse && email) {
    console.log(`Send course to: ${email}`);
  }

  res.status(200).json({ success: true });
});

app.get('/admin', (req, res) => {
  const pass = req.query.pass;
  if (pass !== 'admin123') return res.status(403).send('No access');
  const data = fs.existsSync(leadsFile) ? JSON.parse(fs.readFileSync(leadsFile)) : [];
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
