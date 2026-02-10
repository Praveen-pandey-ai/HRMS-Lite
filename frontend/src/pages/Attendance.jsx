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

    useEffect(() => {
        fetchEmployees();
    }, []);

    const validate = () => {
        const errs = {};
        if (!selectedEmployee) errs.employee = 'Please select an employee';
        if (!date) errs.date = 'Please select a date';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSubmitting(true);
        try {
            await markAttendance({
                employee_id: selectedEmployee,
                date,
                status,
            });
            const empName = employees.find((e) => e.employee_id === selectedEmployee)?.full_name || selectedEmployee;
            showToast(`Attendance marked for "${empName}" on ${date} — ${status}`);
            setSelectedEmployee('');
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to mark attendance', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading employees..." />;
    if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

    if (employees.length === 0) {
        return (
            <div className="page-container fade-in">
                <div className="page-header">
                    <h2>Mark Attendance</h2>
                    <p>Record daily attendance for your employees</p>
                </div>
                <EmptyState
                    icon="👥"
                    title="No employees found"
                    message="You need to add employees before marking attendance."
                    action={
                        <Link to="/employees/add" className="btn btn-primary">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Employee First
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="page-container fade-in">
            <ToastContainer />
            <div className="page-header">
                <h2>Mark Attendance</h2>
                <p>Record daily attendance for your employees</p>
            </div>

            <div className="card" style={{ maxWidth: '560px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Employee</label>
                        <select
                            className={`form-select${formErrors.employee ? ' error' : ''}`}
                            value={selectedEmployee}
                            onChange={(e) => {
                                setSelectedEmployee(e.target.value);
                                if (formErrors.employee) {
                                    setFormErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.employee;
                                        return copy;
                                    });
                                }
                            }}
                        >
                            <option value="">Select an employee</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                        {formErrors.employee && <p className="form-error">{formErrors.employee}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className={`form-input${formErrors.date ? ' error' : ''}`}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        {formErrors.date && <p className="form-error">{formErrors.date}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <div className="status-toggle">
                            <label className={`status-option present${status === 'Present' ? ' selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Present"
                                    checked={status === 'Present'}
                                    onChange={() => setStatus('Present')}
                                />
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                Present
                            </label>
                            <label className={`status-option absent${status === 'Absent' ? ' selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="Absent"
                                    checked={status === 'Absent'}
                                    onChange={() => setStatus('Absent')}
                                />
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                Absent
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '8px' }}>
                        {submitting ? (
                            <>
                                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                                Marking...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                                Mark Attendance
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Attendance;
