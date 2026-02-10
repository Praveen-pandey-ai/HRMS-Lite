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
                <p>Overview of your organization</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">👥</div>
                    <div className="stat-info">
                        <h3>{dashboard.total_employees}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon success">✓</div>
                    <div className="stat-info">
                        <h3>{dashboard.present_today}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">✕</div>
                    <div className="stat-info">
                        <h3>{dashboard.absent_today}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">⏳</div>
                    <div className="stat-info">
                        <h3>{unmarked}</h3>
                        <p>Unmarked</p>
                    </div>
                </div>
            </div>

            {dashboard.departments.length > 0 && (
                <div style={{ marginTop: 28 }}>
                    <h3 className="section-title">Departments</h3>
                    <div className="department-tags" style={{ marginTop: 8 }}>
                        {dashboard.departments.map((dept) => (
                            <span key={dept} className="badge badge-department">{dept}</span>
                        ))}
                    </div>
                </div>
            )}

            {employees.length > 0 && (
                <div style={{ marginTop: 28 }}>
                    <div className="section-header">
                        <h3 className="section-title">Recent Employees</h3>
                        <Link to="/employees" className="btn btn-secondary btn-sm">View All</Link>
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
                                        <td style={{ color: 'var(--gray-400)', fontSize: 13 }}>{emp.employee_id}</td>
                                        <td style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{emp.full_name}</td>
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
