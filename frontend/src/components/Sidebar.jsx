import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">H</div>
                <div>
                    <h1>HRMS Lite</h1>
                    <span>Management</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Menu</div>
                <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
                    <span className="nav-icon">📊</span>
                    Dashboard
                </NavLink>
                <NavLink to="/employees" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">👤</span>
                    Employees
                </NavLink>
                <NavLink to="/employees/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">➕</span>
                    Add Employee
                </NavLink>
                <NavLink to="/attendance" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">✓</span>
                    Attendance
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
