const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

let users = {};

app.post('/signup', (req, res) => {
  const { name, emailPhone, password, profilePic } = req.body;

  if (!name || !validateEmailPhone(emailPhone) || !password || !profilePic) {
    return res.status(400).json({ error: 'Invalid data. Please fill in all required fields.' });
  }

  if (users[emailPhone]) {
    return res.status(400).json({ error: 'User with this email or phone number already exists.' });
  }

  users[emailPhone] = { name, password, profilePic, emailPhone };
  res.status(200).json({ message: 'Signup successful.' });
});

app.post('/login', (req, res) => {
  const { emailPhone, password } = req.body;

  if (!validateEmailPhone(emailPhone) || !password) {
    return res.status(400).json({ error: 'Invalid data. Please fill in all required fields.' });
  }

  const foundUser = Object.values(users).find(user => {
    return user.emailPhone === emailPhone && user.password === password;
  });

  if (!foundUser) {
    return res.status(401).json({ error: 'Invalid email/phone or password.' });
  }

  res.status(200).json({ message: 'Login successful.', user: foundUser });
});

function validateEmailPhone(input) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phonePattern = /^[0-9]{10}$/;

  return emailPattern.test(input) || phonePattern.test(input);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});