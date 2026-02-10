import { useState, useEffect } from 'react';
import { getEmployees, markAttendance } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../components/Toast';
import { Link } from 'react-router-dom';

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('Present');
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { showToast, ToastContainer } = useToast();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!selectedEmployee) errs.employee = 'Select an employee';
        if (!date) errs.date = 'Select a date';
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSubmitting(true);
        try {
            await markAttendance({ employee_id: selectedEmployee, date, status });
            const name = employees.find((e) => e.employee_id === selectedEmployee)?.full_name || selectedEmployee;
            showToast(`Attendance marked for "${name}" — ${status}`);
            setSelectedEmployee('');
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

    if (employees.length === 0) {
        return (
            <div className="page-container">
                <div className="page-header"><h2>Attendance</h2></div>
                <EmptyState icon="👤" title="No employees" message="Add employees first." action={<Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>} />
            </div>
        );
    }

    return (
        <div className="page-container">
            <ToastContainer />
            <div className="page-header">
                <h2>Mark Attendance</h2>
                <p>Record daily attendance</p>
            </div>
            <div className="card" style={{ maxWidth: 480 }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Employee</label>
                        <select className={`form-select${formErrors.employee ? ' error' : ''}`} value={selectedEmployee} onChange={(e) => { setSelectedEmployee(e.target.value); setFormErrors({}); }}>
                            <option value="">Select...</option>
                            {employees.map((emp) => <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name} ({emp.employee_id})</option>)}
                        </select>
                        {formErrors.employee && <p className="form-error">{formErrors.employee}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <div className="status-toggle">
                            <label className={`status-option present${status === 'Present' ? ' selected' : ''}`}>
                                <input type="radio" name="status" value="Present" checked={status === 'Present'} onChange={() => setStatus('Present')} />
                                ✓ Present
                            </label>
                            <label className={`status-option absent${status === 'Absent' ? ' selected' : ''}`}>
                                <input type="radio" name="status" value="Absent" checked={status === 'Absent'} onChange={() => setStatus('Absent')} />
                                ✕ Absent
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Mark Attendance'}</button>
                </form>
            </div>
        </div>
    );
}

export default Attendance;
