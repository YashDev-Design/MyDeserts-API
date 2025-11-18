<p align="left">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18.0.0-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.18.2-black?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Secured-orange?logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>
# 🍰 BakeBuddy — Full Stack Bakery Management App

_A portfolio-grade MERN stack project_

BakeBuddy is a **full-stack bakery management system** featuring an **Admin Dashboard**, REST API, MongoDB database, and a modern responsive UI.  
Admins can **add, edit, delete & manage menu items** (CRUD).  
Designed with real-world scalability, clean architecture & professional UI styling.

---

## 🏗️ Project Architecture (MVC + Full Stack)

```
Node - JS Project/
│
├── client/                          # React Frontend (Admin UI + Auth)
│   ├── public/                      # Static assets & UI previews
│   │   ├── Admin Login Page.png
│   │   ├── Admin Login Successful Page.png
│   │   ├── User Login Page.png
│   │   ├── User Registration Page.png
│   │   └── bakebuddy-admin-ui.png
│   ├── src/
│   │   ├── pages/                   # Page-based routing
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   │   └── auth.css
│   │   │   ├── icons/
│   │   │   └── images/
│   │   │       └── main_bg.jpg
│   │   ├── api.js                   # Axios API config
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── server/                          # Node + Express Backend (MVC + Auth + Orders)
    ├── src/
    │   ├── server.js                # Server Entry
    │   ├── app.js                   # Express App Setup
    │   ├── config/
    │   │   └── db.js                # MongoDB Connection
    │   ├── middleware/              # Auth & Role Guard
    │   │   ├── auth.middleware.js
    │   │   └── role.middleware.js
    │   ├── controllers/             # Business Logic Layer
    │   │   ├── auth.controller.js
    │   │   ├── product.controller.js
    │   │   ├── cart.controller.js
    │   │   └── order.controller.js
    │   ├── models/                  # Mongoose Schemas
    │   │   ├── user.model.js
    │   │   ├── product.model.js
    │   │   ├── cart.model.js
    │   │   └── order.model.js
    │   ├── routes/                  # API Routes
    │   │   ├── auth.routes.js
    │   │   ├── product.routes.js
    │   │   ├── cart.routes.js
    │   │   └── order.routes.js
    │   ├── utils/                   # Token + Helpers
    │   │   └── token.util.js
    │   └── scripts/                 # Admin CLI Tools
    │       ├── createAdmin.js
    │       ├── deleteAdmin.js
    │       └── listUsers.js
    ├── package.json
    └── .env
```

---

## ✨ Phase 1 — Core Functionality (Completed)

✔ Full CRUD (Create, Read, Update, Delete)  
✔ Modern React Admin Dashboard  
✔ Express REST API (MVC Structure)  
✔ MongoDB + Mongoose Models  
✔ CORS support  
✔ Environment variables with `.env`  
✔ Live menu updates without refresh  
✔ Fully working UI — no Postman required  
✔ Responsive grid-based product layout

---

## 🔐 Phase 2 — Authentication & Scalability (Completed)

✔ JWT-based Admin Login  
✔ Password hashing with bcrypt  
✔ Protected routes (client + server)  
✔ Token validation & logout support  
✔ Codebase refactor & folder restructuring  
✔ New `pages/` + `assets/` added to client  
✔ Repo migrated & renamed to **BakeBuddy.API**  
✔ UI placeholders added for:

- Orders
- Users
- Analytics
- Settings

---

## 🎨 Admin UI Design

Inspired by **Panera Bread / Starbucks / Fazoli’s** dashboard style:

- Poppins / Sora Premium Fonts
- Sticky Full-Width Navbar
- Responsive Grid Layout
- Gradient CTA Buttons
- Hover Animations
- Light Pastel Bakery Theme
- Menu Items instead of "Desserts" list
- Zero horizontal scrolling (mobile friendly)

### 🔜 Upcoming Admin Features (UI Ready)

The dashboard already includes navigation buttons for future expansion:

- **Orders** — will display customer order history & live order tracking
- **Users** — admin can manage registered customers/accounts
- **Analytics** — sales charts, top-selling items & performance insights

These buttons are active placeholders that currently show a  
“🚧 Feature Coming Soon” prompt, demonstrating planned scalability.

---

## 🖥️ Admin Dashboard UI Preview

Below is the current **BakeBuddy Admin Dashboard**, featuring:

- Responsive grid-based menu management
- Full-width sticky navbar
- Modern typography & bakery-themed colors
- Edit & Delete controls on every item
- Clean, professional SaaS-style layout

### 📸 Admin UI Preview

<img src="./client/public/bakebuddy-admin-ui.png" width="700" />

## 🔐 Authentication Screens

### 👨‍💼 Admin Login Screen

<img src="./client/public/Admin Login Page.png" width="500" />

### 👨‍💼 Admin Login Successful Screen

<img src="./client/public/Admin Login Successful Page.png" width="500" />

### 👤 Customer Login Screen

<img src="./client/public/User Login Page.png" width="500" />

### 📝 Customer Registration Screen

<img src="./client/public/User Registration Page.png" width="500" />

---

## 🧠 API Endpoints (Updated)

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/products`     | Fetch all products |
| POST   | `/api/products`     | Add new product    |
| PUT    | `/api/products/:id` | Update product     |
| DELETE | `/api/products/:id` | Delete product     |

📌 Example POST body:

```json
{
  "name": "Chocolate Roll",
  "type": "Pastry",
  "calories": 260
}
```

---

## 🚀 Run the Project

### 1️⃣ Clone

```bash
git clone https://github.com/YashDev-Design/MyDeserts-API.git
cd "Node - JS Project"
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env`:

```
PORT=10000
MONGO_URI=your_connection_string
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
npm start
```

---

## 🔭 Roadmap (Next Steps)

- 👥 Customer Login & Registration
- 🛒 Order Placement & Cart System
- 🧾 Order History & Tracking
- 📊 Analytics Dashboard (Sales, Trends, Insights)
- 🖼 Product Images & Categories
- 📱 Public Customer Menu UI (Mobile friendly)
- 🌓 Dark Mode Toggle
- 🌍 Deployment (Render + Netlify + MongoDB Atlas)

---

## 🚧 Phase 3 — In Progress

We are now building real-world SaaS functionality:

- Customer-facing authentication
- Cart & order management
- Real-time admin analytics
- Product images with cloud storage
- Multi-role architecture (Admin vs Customer)

---

## 🛠 Tech Stack

**Frontend:** React, Axios, JSX, CSS  
**Backend:** Node.js, Express.js, MVC Pattern  
**Database:** MongoDB + Mongoose  
**Dev Tools:** Nodemon, dotenv, CORS  
**Architecture:** Full Stack, REST API, MVC

---

## 👨‍💻 Developer

**Javeed Quadri Mohammad (YashDev-Design)**  
📍 Auburn University at Montgomery  
🎓 MS Computer Science  
💼 Student Affairs · Social Media & Marketing Assistant

---

## ⭐ Support

If you like this project — star it on GitHub!  
It helps me grow and keeps the bakery open 🍩✨
