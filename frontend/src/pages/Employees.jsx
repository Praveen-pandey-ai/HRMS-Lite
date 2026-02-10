import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { showToast, ToastContainer } = useToast();
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEmployees();
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteEmployee(deleteTarget.employee_id);
            showToast(`Employee "${deleteTarget.full_name}" deleted successfully`);
            setDeleteTarget(null);
            fetchEmployees();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to delete employee', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = employees.filter(
        (emp) =>
            emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
            emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
            emp.department.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    if (loading) return <LoadingSpinner text="Loading employees..." />;
    if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

    return (
        <div className="page-container fade-in">
            <ToastContainer />
            <div className="page-header-actions">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h2>Employees</h2>
                    <p>Manage your team members</p>
                </div>
                <Link to="/employees/add" className="btn btn-primary">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Employee
                </Link>
            </div>

            {employees.length > 0 && (
                <div style={{ margin: '28px 0', position: 'relative' }}>
                    <svg width="18" height="18" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name, ID, department, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '460px', paddingLeft: '44px' }}
                    />
                </div>
            )}

            {employees.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No employees yet"
                    message="Start by adding your first employee to the system."
                    action={
                        <Link to="/employees/add" className="btn btn-primary">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Employee
                        </Link>
                    }
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No results found"
                    message={`No employees matching "${search}"`}
                />
            ) : (
                <div className="employees-grid">
                    {filtered.map((emp) => (
                        <div
                            key={emp.employee_id}
                            className="employee-card"
                            onClick={() => navigate(`/employees/${emp.employee_id}`)}
                        >
                            <div className="emp-actions">
                                <button
                                    className="btn-icon danger"
                                    title="Delete employee"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(emp);
                                    }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                            <div className="emp-header">
                                <div className="emp-avatar">{getInitials(emp.full_name)}</div>
                                <div>
                                    <div className="emp-name">{emp.full_name}</div>
                                    <div className="emp-id">{emp.employee_id}</div>
                                </div>
                            </div>
                            <div className="emp-details">
                                <div className="emp-detail">
                                    <span className="detail-icon">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    </span>
                                    {emp.email}
                                </div>
                                <div className="emp-detail">
                                    <span className="detail-icon">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                                    </span>
                                    <span className="badge badge-department">{emp.department}</span>
                                </div>
                            </div>
                            <div className="emp-stats">
                                <div className="emp-stat present">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                    {emp.total_present} Present
                                </div>
                                <div className="emp-stat absent">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    {emp.total_absent} Absent
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteTarget && (
                <Modal
                    title="Delete Employee"
                    message={`Are you sure you want to delete "${deleteTarget.full_name}" (${deleteTarget.employee_id})? This will also remove all their attendance records. This action cannot be undone.`}
                    confirmText={deleting ? 'Deleting...' : 'Delete'}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    danger
                />
            )}
        </div>
    );
}

export default Employees;
