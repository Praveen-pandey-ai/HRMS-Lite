import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">H</div>
                <div>
                    <h1>HRMS Lite</h1>
                    <span>Management System</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Menu</div>
                <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                    </span>
                    Dashboard
                </NavLink>
                <NavLink to="/employees" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </span>
                    Employees
                </NavLink>
                <NavLink to="/employees/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                    </span>
                    Add Employee
                </NavLink>
                <NavLink to="/attendance" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" />
                        </svg>
                    </span>
                    Attendance
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
