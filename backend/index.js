// backend/index.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // your Next.js frontend URL
  credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // use true if serving over HTTPS
}));

// API: Signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error signing up', error: err });
        }
        res.status(201).json({ message: 'User created successfully.' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// API: Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password.' });
  }
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', err });
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      // Create session
      req.session.user = { id: user.id, email: user.email, username: user.username };
      res.json({ message: 'Login successful.', user: req.session.user });
    }
  );
});

// API: Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful.' });
  });
});

// Example: Protected route
app.get('/api/home', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  res.json({ message: `Welcome ${req.session.user.username}` });
});

app.post('/api/enquiry', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("''''''''''''''''''''''''''''",email);
    
  
    // Create a transporter (using Gmail as an example)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohammadraheman7864@gmail.com', // Replace with your Gmail address
        pass: 'bqvk rrwe yrmb mitu',            // Replace with your Gmail password or app password
      },
    });

    console.log("''''''''''''''''''''''''''''",email);
  
    let mailOptions = {
      from: email,
      to: 'mohammadraheman7864@gmail.com',
      subject: `Enquiry from ${name}`,
      text: `FROM : ${email}\n\n${message}`,
    };

    console.log("''''''''''''''''''''''''''''",email);

  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'Enquiry sent successfully' });
      }
    });
  });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
