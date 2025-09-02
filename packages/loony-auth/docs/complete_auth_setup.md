// README.md

# Express Authentication & Authorization (Complete Setup)

This repo contains a complete, production-minded authentication and authorization setup using Node.js, Express, MongoDB (Mongoose), JWTs (access + refresh), role-based authorization, password hashing, token revocation, and secure cookie handling.

Features:

- User registration (email + password) with password hashing (bcrypt)
- Login with access token (short-lived JWT) + refresh token (long-lived JWT stored in DB + HttpOnly cookie)
- Refresh token rotation and revocation
- Logout (invalidate refresh token)
- Role-based authorization middleware (e.g. `admin`, `user`)
- Password reset token flow (stateless token saved hashed)
- Basic rate limiting and security headers

---

```json
// package.json
{
  "name": "express-auth-complete-setup",
  "version": "1.0.0",
  "description": "Complete authentication & authorization example with Node.js + Express + MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.1.4",
    "express": "^4.18.2",
    "express-rate-limit": "^6.7.0",
    "helmet": "^6.0.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.1",
    "nodemailer": "^6.9.4",
    "validator": "^13.9.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

```env
// .env.example
PORT=4000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_ACCESS_SECRET=replace_this_with_a_strong_secret_for_access
JWT_REFRESH_SECRET=replace_this_with_a_strong_secret_for_refresh
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
PASSWORD_RESET_TOKEN_EXPIRES=1h
FRONTEND_URL=http://localhost:3000
COOKIE_DOMAIN=localhost
NODE_ENV=development
```

# Optional for nodemailer (password reset/email verification)

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email_user
SMTP_PASS=your_email_password
EMAIL_FROM="Auth Example" <no-reply@example.com>

---

```js
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
origin: process.env.FRONTEND_URL,
credentials: true
}));

// Basic rate limiter
const limiter = rateLimit({ windowMs: 15 _ 60 _ 1000, max: 200 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Health
app.get('/', (req, res) => res.send({ ok: true }));

// DB connect & start
const PORT = process.env.PORT || 4000;

async function start() {
try {
await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('Connected to MongoDB');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
console.error('Failed to start', err);
process.exit(1);
}
}

start();
```

```js
---

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true, lowercase: true, trim: true },
password: { type: String, required: true },
role: { type: String, enum: ['user', 'admin'], default: 'user' },
isVerified: { type: Boolean, default: false },
refreshTokens: [String], // store valid refresh tokens (hashed or raw based on security need)
passwordResetToken: String,
passwordResetExpires: Date,
createdAt: { type: Date, default: Date.now }
});

// Hash password before save
UserSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(12);
this.password = await bcrypt.hash(this.password, salt);
next();
});

UserSchema.methods.comparePassword = function (candidate) {
return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

---

```js
// utils/jwt.js
const jwt = require("jsonwebtoken")

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  })
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  })
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
```

---

```js
// middleware/auth.js
const { verifyAccessToken } = require("../utils/jwt")
const User = require("../models/User")

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Missing token" })
    const token = authHeader.split(" ")[1]
    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.sub).select("-password")
    if (!user) return res.status(401).json({ message: "User not found" })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

function authorize(roles = []) {
  // roles can be a single role string or array
  if (typeof roles === "string") roles = [roles]
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" })
    if (roles.length && !roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" })
    next()
  }
}

module.exports = { authenticate, authorize }
```

---

```js
// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const User = require('../models/User');
const validator = require('validator');

// Helpers
function sendRefreshToken(res, token) {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE*ENV === 'production',
        sameSite: 'lax',
        domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 1000 * 60 _ 60 _ 24 \_ 7 // 7 days
    };
    res.cookie('jid', token, cookieOptions);
}

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !validator.isEmail(email)) return res.status(400).json({ message: 'Valid email required' });
        if (!password || password.length < 6) return res.status(400).json({ message: 'Password too short' });
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already in use' });
        const user = new User({ email, password, role });
        await user.save();
        // Optionally send verification email here
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const valid = await user.comparePassword(password);
if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ sub: user._id.toString() });

    // Store refresh token server-side (simple list) - consider hashing it in DB in production
    user.refreshTokens.push(refreshToken);
    await user.save();

    sendRefreshToken(res, refreshToken);

    res.json({ accessToken });

} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    let payload;
    try {
      payload = verifyRefreshToken(token);
    }
    catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });
    // check token exists in DB
    if (!user.refreshTokens.includes(token)) return res.status(401).json({ message: 'Refresh token revoked' });

    // Rotate tokens: remove old refresh token, issue new pair
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    const newRefresh = signRefreshToken({ sub: user._id.toString() });
    user.refreshTokens.push(newRefresh);
    await user.save();

    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    sendRefreshToken(res, newRefresh);
    res.json({ accessToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
try {
const token = req.cookies.jid;
if (!token) {
res.clearCookie('jid');
return res.json({ message: 'Logged out' });
}
// Remove token from DB
const payload = (() => { try { return verifyRefreshToken(token); } catch { return null; } })();
if (payload) {
const user = await User.findById(payload.sub);
if (user) {
user.refreshTokens = user.refreshTokens.filter(t => t !== token);
await user.save();
}
}
res.clearCookie('jid');
res.json({ message: 'Logged out' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Password reset request (creates token and (optionally) emails it)
router.post('/forgot-password', async (req, res) => {
try {
const { email } = req.body;
if (!email || !validator.isEmail(email)) return res.status(400).json({ message: 'Valid email required' });
const user = await User.findOne({ email });
if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + (parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES || '3600') * 1000);
    await user.save();

    // TODO: send `resetToken` string to user's email via nodemailer
    // Example reset URL: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`

    res.json({ message: 'If that email exists, a reset link has been sent' });

} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Reset password
router.post('/reset-password', async (req, res) => {
try {
const { token, id, newPassword } = req.body;
if (!token || !id || !newPassword) return res.status(400).json({ message: 'Missing fields' });
const hashed = crypto.createHash('sha256').update(token).digest('hex');
const user = await User.findOne({ \_id: id, passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } });
if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
user.password = newPassword;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();
res.json({ message: 'Password reset successful' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;
```

---

```js
// routes/protected.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Example protected route for authenticated users
router.get('/me', authenticate, (req, res) => {
res.json({ user: { id: req.user.\_id, email: req.user.email, role: req.user.role } });
});

// Admin-only route example
router.get('/admin/stats', authenticate, authorize('admin'), (req, res) => {
res.json({ secretStats: 'only admins see this' });
});

module.exports = router;
```

---

// Notes & Security considerations
// 1) In production, store hashed versions of refresh tokens in DB (e.g., hash before saving) so a DB leak won't give valid tokens.
// 2) Consider Refresh Token Rotation and detection of reuse to immediately revoke all sessions if reuse detected.
// 3) Keep access tokens short-lived (e.g., 15 minutes) and refresh tokens long-lived but revocable.
// 4) Use HTTPS and set secure cookies in production.
// 5) Add email verification step after registration if you require verified emails.
// 6) Consider using an auth provider (Auth0, Clerk, Firebase) for complex needs.

---

// Quick start
// 1. Copy files into a folder
// 2. `npm install`
// 3. Create `.env` from `.env.example` and set secrets
// 4. `npm run dev` or `npm start`

// End of document

```

```

```

```
