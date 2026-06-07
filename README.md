# Bulk Mailer – Full Stack MERN Project

A responsive Full Stack Bulk Mail Application that allows authenticated administrators to send personalized emails to multiple recipients simultaneously and track the delivery history.

---

## ⭐ Live Demo
* **GitHub link:** [https://github.com/muthukavitha18-svg/BulkMail-Project](https://github.com/muthukavitha18-svg/BulkMail-Project)
* **Vercel Frontend link:** [https://bulk-mail-project-sooty.vercel.app](https://bulk-mail-project-sooty.vercel.app)
* **Render Backend link:** [https://bulkmail-project-t0gj.onrender.com](https://bulkmail-project-t0gj.onrender.com)

---

## 📌 Project Description
This project is a Full Stack Bulk Mail Sender Application built using the **MERN** stack. It connects a React frontend with a Node/Express backend that utilizes **Nodemailer** to send emails via Gmail SMTP, storing send logs and status directly in a **MongoDB** database.

The main goal of this project is to practice key full-stack concepts:
* **Frontend-Backend Integration** using Axios with Token-based Authorization.
* **Database Management** (Schema design, history querying, and status updates) using Mongoose.
* **SMTP Transport Configuration** and handling cloud-provider network limitations.
* **Authentication Flow** utilizing JSON Web Tokens (JWT) and React Context.
* **Modern UI Development** using React, TypeScript, and Tailwind CSS.

---

## 🔑 Key Features

### 🔒 Admin Authentication
* Secure login panel using JWT (JSON Web Token) authentication.
* Protected routes for sending emails and viewing logs, keeping the service secure.

### ✉️ Bulk Email Dispatcher
* Users can compose emails with custom **Subjects** and **Bodies**.
* Accepts multiple email addresses separated by commas, semicolons, or new lines.
* Front-end live statistics tracking the total recipient count and the delivery state.

### 📊 Real-Time Status & Feedback
* Status indicator updates dynamically (**Ready**, **Sending...**, **Sent**, or **Failed**).
* Comprehensive error messages when network drops occur, servers wake up (cold starts), or inputs fail validation.

### 📜 Campaign History & Logs
* Logs all sent campaigns into MongoDB.
* History page displays the Subject, Message Body, list of Recipients, status (Success/Failed), Unique Message ID or Error Messages, and precise Timestamp.

---

## ⚡ API Integration & SMTP Setup
* **Axios** is configured with an authorization interceptor to inject JWT Bearer tokens.
* Express API routes:
  * `POST /auth/login` - Admin login and token generation.
  * `POST /sendmail` - Validates inputs and sends emails using Nodemailer with custom DNS lookup (forcing IPv4 to avoid IPv6 issues on hosting providers).
  * `GET /emails/history` - Fetches the historical log of sent emails.

---

## ⚛️ React Hooks & State Management
* `useState()` used to manage form inputs, feedback alert states, loading overlays, and history tables.
* `useContext()` (via `AuthContext`) manages global user sessions, token persistence in `localStorage`, and logout functions.
* `useRef()` and `useEffect()` used for dashboard interactions and fetching history.

---

## 🚫 Validation & Error Handling
* **Frontend Validation:** Checks for empty subjects/bodies and validates every recipient email against standard email regex patterns before sending.
* **Backend Validation:** Validates JSON payloads and sanitizes inputs.
* **Network Error Handling:** Built-in timeout controls (`Promise.race`) that reject hanging SMTP requests and notify the user to wait during server cold starts.

---

## 🎨 Responsive UI Design
* Built using modern styling with Tailwind CSS.
* Fully responsive layout adapting perfectly across all devices:

| Screen Size | Layout |
| :--- | :--- |
| **Desktop** | Dual-column layout (Form and Live Statistics) |
| **Tablet** | Focused card view with responsive spacing |
| **Mobile** | Single-column form optimization for mobile-friendly input |

---

## 🧩 Clean Component Structure

### 📁 Folder Structure
```text
Bulk Mail/
├── frontend/                   → React (Vite + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts        → Axios client with auth interceptors
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx → State for user login & JWT token
│   │   ├── pages/
│   │   │   ├── History.tsx     → Campaign log dashboard
│   │   │   ├── Login.tsx       → Secure Login page
│   │   │   └── SendMail.tsx    → Compose and send mail page
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vercel.json
│
└── backend/                    → Node.js + Express + Nodemailer
    ├── config/
    │   └── db.js               → Mongoose connection configuration
    ├── middleware/
    │   ├── auth.js             → JWT authentication middleware
    │   └── errorHandler.js     → Error handling middlewares
    ├── models/
    │   └── Email.js            → Mongoose schema for Email campaign logs
    ├── routes/
    │   ├── authRoutes.js       → Login credentials verification
    │   └── mailRoutes.js       → Nodemailer SMTP dispatch logic
    ├── utils/
    │   ├── logger.js           → Winston-based logging
    │   └── validateMail.js     → Mail payload validators
    └── index.js
```

---

## 🛠️ Technologies Used

| Technology | Usage |
| :--- | :--- |
| **React JS** | Component-driven user interface |
| **TypeScript** | Static typing and type safety |
| **Tailwind CSS** | Styling and responsive layouts |
| **Node.js & Express** | RESTful API server |
| **Nodemailer** | SMTP mail transfer module |
| **MongoDB & Mongoose** | Data persistence and ODM modeling |
| **JWT** | Secure stateless authentication |

---

## 💡 What I Learned
* **Full-Stack Orchestration:** Setting up and connecting React with an Express backend, and deploying both to cloud providers (Vercel & Render).
* **SMTP Transport Workarounds:** Resolving common cloud-provider outbound networking restrictions by configuring custom DNS lookups (`family: 4` to force IPv4) in Nodemailer.
* **Database Management:** Structuring schemas in Mongoose and querying logs with sorting features.
* **Security Practices:** Protecting APIs using JWT tokens, environment variable encapsulation (`dotenv`), and secure login verification.

---

## 📜 License
This project is created for educational and learning purposes only.
