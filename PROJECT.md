# Bulk Mail Application — Project Objective

## Objective

Build a **Full Stack Bulk Mail Application** that integrates:

| Layer      | Technology        |
|------------|-------------------|
| Frontend   | React             |
| Backend    | Node.js / Express |
| Database   | MongoDB           |

This project showcases the ability to work across the **MERN stack** (MongoDB, Express, React, Node.js).

---

## Scope

### Frontend (React)
- User-friendly interface for sending bulk emails
- Input fields: **Subject**, **Email body**, **Recipient emails** (multiple)
- Optional: validation and success/failure messages

### Backend (Node.js / Express)
- REST API for sending emails (e.g. Nodemailer)
- Accept subject, body, and recipient list from the frontend
- Persist campaign/send history in MongoDB

### Database (MongoDB)
- Store email campaigns, recipients, and send status
- Enable history and audit of bulk mail operations

---

## Current Status

| Component | Status |
|-----------|--------|
| React frontend | Complete — send form, validation, status messages, login, history page |
| Express backend | Complete — sendmail API, auth, logging, error handling |
| MongoDB | Integrated — stores email records (subject, body, recipients, status) |

---

## Folder Structure

```
Bulk Mail/
├── frontend/   → React (Vite + TypeScript + Tailwind)
├── backend/    → Express + Nodemailer
└── PROJECT.md  → This file
```
