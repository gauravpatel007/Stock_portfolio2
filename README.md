# Investment Portfolio Tracker 🚀

A full-stack Investment Portfolio management web application built using **Node.js, Express, MongoDB (Atlas), React, Vite, and TailwindCSS**.

---

## 🔐 Default Login Credentials

The server automatically seeds a default admin account on startup:

- **Username / Email**: `admin`
- **Password**: `admin`

*(You can also sign up for a new account on the landing page!)*

---

## ⚙️ How to Run the Project

You need **two separate terminals** running at the same time: one for the backend server and one for the React frontend client.

### Step 1: Run the Backend (Server)

1. Open your first terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install backend dependencies (if running for the first time):
   ```bash
   npm install
   ```
3. Make sure your `.env` file inside `server/` has the correct `MONGO_URI` and `JWT_SECRET`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.s9fjg3a.mongodb.net/?appName=Cluster0
   JWT_SECRET=yourSuperSecretKey123
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run on `http://localhost:5000`*

---

### Step 2: Run the Frontend (Client)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd client/.vscode
   ```
   > **Note:** The React frontend files are located inside `client/.vscode/`. Make sure to `cd client/.vscode` so `npm` can find `package.json`.

2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *Frontend will run on `http://localhost:5173`*

---

## 🛠️ Features & Tech Stack

- **Frontend**: React, React Router DOM, Recharts, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Authentication (bcrypt.js)
- **Database**: MongoDB (Mongoose ODM)
- **Features**:
  - Landing Page & Authentication (Login / Sign Up)
  - Isolated Multi-tenant Portfolio Dashboard
  - Real-time Holdings Tracking & Analytics (Add / Delete Holdings)
  - Interactive Allocation Charts & Growth Visualization

QUICK RUN 1 : Backend 

   ```bash
   cd server
   npm install
   npm run dev
   ```

QUICK RUN 2 : Frontend

   ```bash
   cd client/.vscode
   npm install
   npm run dev
   ```
