import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard, getEmployees } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [dashRes, empRes] = await Promise.all([getDashboard(), getEmployees()]);
            setDashboard(dashRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;

    const unmarked = Math.max(0, dashboard.total_employees - dashboard.present_today - dashboard.absent_today);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Your organization at a glance</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{dashboard.total_employees}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon success">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{dashboard.present_today}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{dashboard.absent_today}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{unmarked}</h3>
                        <p>Unmarked</p>
                    </div>
                </div>
            </div>

            {dashboard.departments.length > 0 && (
                <div style={{ marginTop: 36 }}>
                    <h3 className="section-title">Departments</h3>
                    <div className="department-tags" style={{ marginTop: 10 }}>
                        {dashboard.departments.map((dept) => (
                            <span key={dept} className="badge badge-department">{dept}</span>
                        ))}
                    </div>
                </div>
            )}

            {employees.length > 0 && (
                <div style={{ marginTop: 36 }}>
                    <div className="section-header">
                        <h3 className="section-title">Recent Employees</h3>
                        <Link to="/employees" className="btn btn-secondary btn-sm">View All →</Link>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.slice(0, 5).map((emp) => (
                                    <tr key={emp.employee_id}>
                                        <td><span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 12, color: 'var(--text-muted)' }}>{emp.employee_id}</span></td>
                                        <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.full_name}</span></td>
                                        <td><span className="badge badge-department">{emp.department}</span></td>
                                        <td><span className="badge badge-present">{emp.total_present}</span></td>
                                        <td><span className="badge badge-absent">{emp.total_absent}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
