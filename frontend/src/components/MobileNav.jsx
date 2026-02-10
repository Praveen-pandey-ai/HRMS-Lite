import { NavLink } from 'react-router-dom';

function MobileNav() {
    return (
        <div className="mobile-bottom-nav">
            <nav>
                <NavLink to="/" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} end>
                    <span className="mobile-nav-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                    </span>
                    Home
                </NavLink>
                <NavLink to="/employees" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} end>
                    <span className="mobile-nav-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </span>
                    Team
                </NavLink>
                <NavLink to="/attendance" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}>
                    <span className="mobile-nav-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" />
                        </svg>
                    </span>
                    Attend
                </NavLink>
                <NavLink to="/employees/add" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}>
                    <span className="mobile-nav-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </span>
                    Add
                </NavLink>
            </nav>
        </div>
    );
}

export default MobileNav;
