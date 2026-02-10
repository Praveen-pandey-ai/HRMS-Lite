# HRMS Lite – Human Resource Management System

A lightweight, full-stack web application for managing employee records and tracking daily attendance. Built as a professional internal HR tool with a clean, modern, and production-ready UI.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/FastAPI-0.115-green) ![Tech Stack](https://img.shields.io/badge/SQLite-3-orange)

---

## 🚀 Features

### Core Features
- **Employee Management** – Add, view, and delete employees with full details
- **Attendance Tracking** – Mark daily attendance (Present/Absent) per employee
- **Attendance Records** – View attendance history per employee with date filtering

### Bonus Features
- **Dashboard** – Summary view with total employees, today's attendance stats
- **Date Filtering** – Filter attendance records by date range
- **Present/Absent Day Counts** – Per-employee attendance statistics
- **Search** – Search employees by name, ID, department, or email
- **Department Overview** – Active departments displayed on dashboard

### UI/UX
- Professional dark theme with gradient accents
- Loading, empty, and error state handling
- Confirmation modals for destructive actions
- Toast notifications for success/error feedback
- Responsive layout with sidebar navigation
- Smooth micro-animations and transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite 5 |
| **Backend** | Python FastAPI |
| **Database** | SQLite (via SQLAlchemy ORM) |
| **Styling** | Vanilla CSS (custom design system) |
| **HTTP Client** | Axios |
| **Routing** | React Router v6 |

---

## 📁 Project Structure

```
HRMS/
├── backend/
│   ├── main.py              # FastAPI app with all routes
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── database.py          # Database engine setup
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/index.js     # Axios API service layer
│   │   ├── components/      # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── AddEmployee.jsx
│   │   │   ├── EmployeeDetail.jsx
│   │   │   └── Attendance.jsx
│   │   ├── App.jsx          # Root component with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Design system & styles
│   └── package.json
└── README.md
```

---

## 🏃 How to Run Locally

### Prerequisites
- **Python 3.9+** installed
- **Node.js 18+** and **npm** installed

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HRMS
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend will start at: `http://localhost:8000`

API docs available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:5173`

### 4. Open the App
Navigate to `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/dashboard` | Dashboard summary stats |
| `POST` | `/api/employees` | Create new employee |
| `GET` | `/api/employees` | List all employees |
| `GET` | `/api/employees/{id}` | Get single employee |
| `DELETE` | `/api/employees/{id}` | Delete employee |
| `POST` | `/api/attendance` | Mark attendance |
| `GET` | `/api/attendance/{id}` | Get attendance records (supports `?date_from=` and `?date_to=` query params) |

---

## ✅ Validations

- Required fields: Employee ID, Full Name, Email, Department
- Email format validation (client + server)
- Duplicate Employee ID prevention (409 Conflict)
- Duplicate email prevention (409 Conflict)
- Duplicate attendance for same employee + date (409 Conflict)
- Attendance status restricted to "Present" or "Absent"
- Proper HTTP status codes: 201 (Created), 400 (Bad Request), 404 (Not Found), 409 (Conflict), 422 (Validation Error)

---

## ⚠️ Assumptions & Limitations

- **Single admin user** – No authentication/authorization implemented
- **SQLite database** – Suitable for development; replace with PostgreSQL for production
- **Leave management & payroll** – Out of scope per requirements
- **Time zone** – Dashboard "today" stats use server UTC time

---

## 🌐 Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- Set `VITE_API_URL` environment variable in frontend to point to the deployed backend URL
