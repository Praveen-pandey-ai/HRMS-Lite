import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">H</div>
                <div>
                    <h1>HRMS</h1>
                    <span>Lite Dashboard</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Overview</div>
                <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
                    <span className="nav-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    </span>
                    Dashboard
                </NavLink>

                <div className="sidebar-section-label">Management</div>
                <NavLink to="/employees" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </span>
                    Employees
                </NavLink>
                <NavLink to="/employees/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                    </span>
                    Add Employee
                </NavLink>
                <NavLink to="/attendance" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                    </span>
                    Attendance
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
