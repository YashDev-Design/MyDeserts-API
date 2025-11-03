# 🍰 MyDeserts API (Full Stack Project)

A full-stack Node.js project that includes both **client** and **server** sides for managing desserts 🍩.  
Built with **Express**, **MongoDB**, and structured for scalability — this project demonstrates clean architecture, environment configuration, and CRUD operations.

---

## 🧱 Folder Structure

Node - JS Project/
│
├── client/ # Frontend (React or other UI)
│
└── server/ # Backend (Express + MongoDB)
├── models/ # Mongoose schemas
├── index.js # Main Express app entry
├── .env # Environment variables (not committed)
├── package.json # Backend dependencies
└── node_modules/

---

## 🚀 Features

- Modular architecture with separate **client** and **server**
- RESTful API built with Express
- MongoDB + Mongoose integration
- `.env` configuration for flexible environments
- CORS-friendly structure for full-stack development
- Organized folder separation for scalability

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YashDev-Design/MyDeserts-API.git
cd "Node - JS Project"


⸻

2️⃣ Setup the Server

cd server
npm install

Create a .env file inside /server:

PORT=10000
MONGO_URI=your_mongodb_connection_string

Then run:

npm run dev

You should see:

✅ Server running on http://localhost:10000
✅ MongoDB connected successfully


⸻

3️⃣ Setup the Client

cd ../client
npm install
npm start

The client will start on its own port (e.g. http://localhost:3000).

⸻

🧠 API Endpoints

Method	Endpoint	Description
GET	/	Server status check
GET	/api/deserts	Fetch all desserts
POST	/api/deserts	Add a new dessert
DELETE	/api/deserts/:id	Delete dessert by ID

Example POST body:

{
  "name": "Donut",
  "type": "Sweet",
  "calories": 200
}


⸻

🧩 Technologies Used

🖥 Backend:
	•	Node.js
	•	Express.js
	•	MongoDB + Mongoose
	•	dotenv
	•	Nodemon

🎨 Frontend:
	•	React.js (or any other framework you use in client folder)

⸻

🧑‍💻 Author

Yash Dev (YashDev-Design)
🎓 Auburn University at Montgomery
💼 Student Affairs · Social Media & Marketing Assistant

⸻

⭐ Show Your Support

If you like this project, please ⭐ the repo and share it — every star helps motivate more great work ✨

```
