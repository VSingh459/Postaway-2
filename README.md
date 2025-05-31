# 🧠 PostAway - Social Media API

**PostAway** is a full-featured social media backend API built with **Node.js**, **Express**, and **MongoDB**. It supports user authentication, post creation, comments, likes, friend requests, OTP-based password reset, and more.

---

## 🚀 Features


- ✅ User Signup / Signin / Logout (with JWT)
- 🛡 Token Blacklisting for Secure Logout
- 🔒 JWT Authentication Middleware
- 📤 Create, Update, Delete Posts (with image upload)
- 💬 Comment on Posts
- 👍 Like / Unlike Functionality
- 🧑‍🤝‍🧑 Friend Requests (Accept / Reject / Pending)
- 🔐 OTP-based Password Reset via Email (Ethereal)
- 📑 Swagger API Documentation (`/api-docs`)

---

<img width="960" alt="P1" src="https://github.com/user-attachments/assets/3f3db3d9-3edf-41a0-aa62-87f1d25ab979" />

## 📁 Project Structure

├── server.js
├── .env
├── swagger.json
├── uploads/
├── src/
│ ├── config/
│ │ └── mongooseConfig.js
│ ├── error-handler/
│ │ └── applicationError.js
│ ├── middleware/
│ │ ├── jwt.middleware.js
│ │ ├── logger.middleware.js

│ │ └── fileUpload.middleware.js
│ ├── features/
│ ├── user/
│ ├── post/
│ ├── comment/
│ ├── like/
│ ├── friend/
│ ├── otp/
│ └── userProfile/

<img width="960" alt="P2" src="https://github.com/user-attachments/assets/e37da5f6-b611-47d3-8145-402e75161d27" />



