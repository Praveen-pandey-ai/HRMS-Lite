import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployee, getAttendance } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

function EmployeeDetail() {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const empRes = await getEmployee(employeeId);
            setEmployee(empRes.data);

            const params = {};
            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;
            const attRes = await getAttendance(employeeId, params);
            setAttendance(attRes.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load employee details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [employeeId]);

    const handleFilter = () => {
        fetchData();
    };

    const clearFilter = () => {
        setDateFrom('');
        setDateTo('');
        setTimeout(fetchData, 0);
    };

    if (loading) return <LoadingSpinner text="Loading employee details..." />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;
    if (!employee) return <ErrorState message="Employee not found" />;

    const getInitials = (name) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    const attendanceRate = employee.total_present + employee.total_absent > 0
        ? Math.round((employee.total_present / (employee.total_present + employee.total_absent)) * 100)
        : 0;

    return (
        <div className="page-container fade-in">
            <button className="back-link" onClick={() => navigate('/employees')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back to Employees
            </button>

            {/* Employee Profile Card */}
            <div className="card" style={{ marginBottom: '32px' }}>
                <div className="profile-header">
                    <div className="profile-avatar">
                        {getInitials(employee.full_name)}
                    </div>
                    <div>
                        <h2 className="profile-name">{employee.full_name}</h2>
                        <div className="profile-meta">
                            <span>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                {employee.employee_id}
                            </span>
                            <span>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                {employee.email}
                            </span>
                            <span className="badge badge-department">
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                                {employee.department}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-stats" style={{ marginTop: '24px' }}>
                    <div className="detail-stat">
                        <div className="detail-stat-value success">{employee.total_present}</div>
                        <div className="detail-stat-label">Present Days</div>
                    </div>
                    <div className="detail-stat">
                        <div className="detail-stat-value danger">{employee.total_absent}</div>
                        <div className="detail-stat-label">Absent Days</div>
                    </div>
                    <div className="detail-stat">
                        <div className="detail-stat-value primary">{attendanceRate}%</div>
                        <div className="detail-stat-label">Attendance Rate</div>
                    </div>
                </div>
            </div>

            {/* Attendance Section */}
            <div className="section-header" style={{ marginBottom: '16px' }}>
                <h3 className="section-title">Attendance Records</h3>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/attendance')}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Mark Attendance
                </button>
            </div>

            {/* Date Filter */}
            <div className="filter-bar">
                <label>From</label>
                <input
                    type="date"
                    className="form-input"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                />
                <label>To</label>
                <input
                    type="date"
                    className="form-input"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                />
                <button className="btn btn-primary btn-sm" onClick={handleFilter}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                    Filter
                </button>
                {(dateFrom || dateTo) && (
                    <button className="btn btn-secondary btn-sm" onClick={clearFilter}>Clear</button>
                )}
            </div>

            {attendance.length === 0 ? (
                <EmptyState
                    icon="📋"
                    title="No attendance records"
                    message="No attendance has been marked for this employee yet."
                    action={
                        <button className="btn btn-primary" onClick={() => navigate('/attendance')}>
                            Mark Attendance
                        </button>
                    }
                />
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((rec, idx) => {
                                const d = new Date(rec.date + 'T00:00:00');
                                const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
                                const formattedDate = d.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                });
                                return (
                                    <tr key={rec.id}>
                                        <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{idx + 1}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formattedDate}</td>
                                        <td>{dayName}</td>
                                        <td>
                                            <span className={`badge badge-${rec.status.toLowerCase()}`}>
                                                {rec.status === 'Present' ? '✓' : '✕'} {rec.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EmployeeDetail;
