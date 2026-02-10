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
            setError(err.response?.data?.detail || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [employeeId]);

    const handleFilter = () => fetchData();
    const clearFilter = () => { setDateFrom(''); setDateTo(''); setTimeout(fetchData, 0); };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;
    if (!employee) return <ErrorState message="Employee not found" />;

    const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const total = employee.total_present + employee.total_absent;
    const rate = total > 0 ? Math.round((employee.total_present / total) * 100) : 0;

    return (
        <div className="page-container">
            <button className="back-link" onClick={() => navigate('/employees')}>← Back to Employees</button>

            <div className="card" style={{ marginBottom: 24 }}>
                <div className="profile-header">
                    <div className="profile-avatar">{getInitials(employee.full_name)}</div>
                    <div>
                        <h2 className="profile-name">{employee.full_name}</h2>
                        <div className="profile-meta">
                            <span>{employee.employee_id}</span>
                            <span>{employee.email}</span>
                            <span className="badge badge-department">{employee.department}</span>
                        </div>
                    </div>
                </div>
                <div className="detail-stats" style={{ marginTop: 20 }}>
                    <div className="detail-stat">
                        <div className="detail-stat-value success">{employee.total_present}</div>
                        <div className="detail-stat-label">Present</div>
                    </div>
                    <div className="detail-stat">
                        <div className="detail-stat-value danger">{employee.total_absent}</div>
                        <div className="detail-stat-label">Absent</div>
                    </div>
                    <div className="detail-stat">
                        <div className="detail-stat-value primary">{rate}%</div>
                        <div className="detail-stat-label">Rate</div>
                    </div>
                </div>
            </div>

            <div className="section-header">
                <h3 className="section-title">Attendance Records</h3>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/attendance')}>+ Mark Attendance</button>
            </div>

            <div className="filter-bar">
                <label>From</label>
                <input type="date" className="form-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <label>To</label>
                <input type="date" className="form-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={handleFilter}>Filter</button>
                {(dateFrom || dateTo) && <button className="btn btn-secondary btn-sm" onClick={clearFilter}>Clear</button>}
            </div>

            {attendance.length === 0 ? (
                <EmptyState icon="📋" title="No records" message="No attendance marked yet." />
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead><tr><th>#</th><th>Date</th><th>Day</th><th>Status</th></tr></thead>
                        <tbody>
                            {attendance.map((rec, idx) => {
                                const d = new Date(rec.date + 'T00:00:00');
                                return (
                                    <tr key={rec.id}>
                                        <td style={{ color: 'var(--gray-400)' }}>{idx + 1}</td>
                                        <td style={{ fontWeight: 500 }}>{d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td>{d.toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                        <td><span className={`badge badge-${rec.status.toLowerCase()}`}>{rec.status}</span></td>
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
