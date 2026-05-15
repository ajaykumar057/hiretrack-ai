# 🚀 HireTrack AI

![HireTrack AI Hero](https://via.placeholder.com/1200x400?text=HireTrack+AI+-+Intelligent+Job+Application+Manager)

**HireTrack AI** is a premium, AI-powered SaaS platform designed to revolutionize the way job seekers manage their job applications, prepare for interviews, and optimize their resumes. By integrating advanced AI capabilities, kanban-style tracking, and networking tools, HireTrack AI serves as the ultimate companion for your career growth.

---

## ✨ Key Features

*   **📊 Kanban Job Board:** Visually track your job applications across various stages (Applied, Interviewing, Offered, Rejected) using an intuitive drag-and-drop interface.
*   **🧠 Resume Intelligence:** Upload your resume and let AI analyze it. Get tailored insights, ATS-friendly score improvements, and role-specific feedback.
*   **🎙️ Interview Vault:** Generate role-specific technical and HR interview questions using AI. Store and review past interview experiences.
*   **🤝 LinkedIn CRM & Networking:** Manage your professional connections and network efficiently. Track conversations, follow-ups, and key contacts.
*   **🎯 Goal Tracking:** Set career goals and monitor your progress over time.
*   **📈 Analytics Dashboard:** View beautiful metrics detailing your application success rates, interview conversion ratios, and networking growth.
*   **🔐 Secure Authentication:** Full JWT-based user authentication system ensuring data privacy.

---

## 🛠️ Tech Stack

This project is structured as a full-stack application.

**Frontend:**
*   [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive UI design
*   Context API for state management

**Backend:**
*   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/) & Mongoose for the database
*   [Groq API](https://groq.com/) (LLaMA 3) for blazing-fast AI intelligence
*   JWT for secure authentication

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine. You will also need a free MongoDB cluster and a Groq API key.

### 1. Clone the Repository
```bash
git clone https://github.com/ajaykumar057/hiretrack-ai.git
cd hiretrack-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `/backend` folder with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env` file inside the `/frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

---

## 📂 Project Structure

```
hiretrack-ai/
├── backend/
│   ├── controllers/      # API Logic & AI Integration
│   ├── models/           # MongoDB Database Schemas
│   ├── routes/           # Express API Endpoints
│   ├── middleware/       # JWT Auth & Error Handling
│   └── server.js         # Backend Entry Point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI Components
│   │   ├── pages/        # Dashboard, Kanban, Resume Intelligence, etc.
│   │   ├── context/      # React Context (Auth)
│   │   └── lib/          # API utility functions
│   └── vite.config.js    # Vite Configuration
│
└── README.md             # Project Documentation
```

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ for job seekers everywhere.</p>
