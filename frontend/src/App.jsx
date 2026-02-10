import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EmployeeDetail from './pages/EmployeeDetail';
import Attendance from './pages/Attendance';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <MobileNav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<AddEmployee />} />
            <Route path="/employees/:employeeId" element={<EmployeeDetail />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
