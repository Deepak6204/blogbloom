const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const db = new Database('blog.db');

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    blog_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (blog_id) REFERENCES blogs (id),
    UNIQUE(user_id, blog_id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    blog_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (blog_id) REFERENCES blogs (id),
    UNIQUE(user_id, blog_id)
  );
`);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword);
    
    const token = jwt.sign({ id: result.lastInsertRowid, username }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  
  if (!user) return res.status(400).json({ error: 'User not found' });
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
  
  const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key');
  res.json({ token });
});

// Blog routes
app.get('/api/blogs', (req, res) => {
  const stmt = db.prepare(`
    SELECT blogs.*, users.username as author
    FROM blogs
    JOIN users ON blogs.author_id = users.id
    ORDER BY created_at DESC
  `);
  const blogs = stmt.all();
  res.json(blogs);
});

app.post('/api/blogs', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const stmt = db.prepare('INSERT INTO blogs (title, content, author_id) VALUES (?, ?, ?)');
  const result = stmt.run(title, content, req.user.id);
  res.json({ id: result.lastInsertRowid });
});

app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
  const stmt = db.prepare('DELETE FROM blogs WHERE id = ? AND author_id = ?');
  const result = stmt.run(req.params.id, req.user.id);
  
  if (result.changes === 0) {
    return res.status(403).json({ error: 'Not authorized to delete this blog' });
  }
  res.json({ message: 'Blog deleted successfully' });
});

// Like/Dislike routes
app.post('/api/blogs/:id/like', authenticateToken, (req, res) => {
  const { action } = req.body; // 'like' or 'dislike'
  const blogId = req.params.id;
  
  try {
    db.transaction(() => {
      const stmt = db.prepare('INSERT OR REPLACE INTO likes (user_id, blog_id, action) VALUES (?, ?, ?)');
      stmt.run(req.user.id, blogId, action);
      
      const updateStmt = db.prepare(`
        UPDATE blogs 
        SET likes_count = (SELECT COUNT(*) FROM likes WHERE blog_id = ? AND action = 'like'),
            dislikes_count = (SELECT COUNT(*) FROM likes WHERE blog_id = ? AND action = 'dislike')
        WHERE id = ?
      `);
      updateStmt.run(blogId, blogId, blogId);
    })();
    
    res.json({ message: 'Action recorded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Report route
app.post('/api/blogs/:id/report', authenticateToken, (req, res) => {
  const { reason } = req.body;
  const blogId = req.params.id;
  
  try {
    db.transaction(() => {
      const stmt = db.prepare('INSERT INTO reports (user_id, blog_id, reason) VALUES (?, ?, ?)');
      stmt.run(req.user.id, blogId, reason);
      
      const updateStmt = db.prepare('UPDATE blogs SET reports_count = reports_count + 1 WHERE id = ?');
      updateStmt.run(blogId);
    })();
    
    res.json({ message: 'Blog reported successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin routes
app.get('/api/admin/reports', authenticateToken, (req, res) => {
  const stmt = db.prepare(`
    SELECT users.role FROM users WHERE id = ?
  `);
  const user = stmt.get(req.user.id);
  
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const reportsStmt = db.prepare(`
    SELECT reports.*, blogs.title, users.username as reporter
    FROM reports
    JOIN blogs ON reports.blog_id = blogs.id
    JOIN users ON reports.user_id = users.id
    ORDER BY reports.created_at DESC
  `);
  const reports = reportsStmt.all();
  res.json(reports);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});