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

    useEffect(() => { fetchEmployees(); }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteEmployee(deleteTarget.employee_id);
            showToast(`"${deleteTarget.full_name}" deleted`);
            setDeleteTarget(null);
            fetchEmployees();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to delete', 'error');
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

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

    return (
        <div className="page-container">
            <ToastContainer />
            <div className="page-header-actions">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h2>Employees</h2>
                    <p>Manage your team</p>
                </div>
                <Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>
            </div>

            {employees.length > 0 && (
                <div style={{ margin: '20px 0' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: 360 }}
                    />
                </div>
            )}

            {employees.length === 0 ? (
                <EmptyState icon="👤" title="No employees" message="Add your first employee to get started." />
            ) : filtered.length === 0 ? (
                <EmptyState icon="🔍" title="No results" message={`Nothing matches "${search}"`} />
            ) : (
                <div className="employees-grid">
                    {filtered.map((emp) => (
                        <div key={emp.employee_id} className="employee-card" onClick={() => navigate(`/employees/${emp.employee_id}`)}>
                            <div className="emp-actions">
                                <button className="btn-icon danger" title="Delete" onClick={(e) => { e.stopPropagation(); setDeleteTarget(emp); }}>🗑</button>
                            </div>
                            <div className="emp-header">
                                <div className="emp-avatar">{getInitials(emp.full_name)}</div>
                                <div>
                                    <div className="emp-name">{emp.full_name}</div>
                                    <div className="emp-id">{emp.employee_id}</div>
                                </div>
                            </div>
                            <div className="emp-details">
                                <div className="emp-detail"><span className="detail-icon">✉</span>{emp.email}</div>
                                <div className="emp-detail"><span className="detail-icon">🏢</span><span className="badge badge-department">{emp.department}</span></div>
                            </div>
                            <div className="emp-stats">
                                <div className="emp-stat present">✓ {emp.total_present} present</div>
                                <div className="emp-stat absent">✕ {emp.total_absent} absent</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteTarget && (
                <Modal
                    title="Delete Employee"
                    message={`Delete "${deleteTarget.full_name}" (${deleteTarget.employee_id})? This removes all their attendance records.`}
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
