import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../api';
import { useToast } from '../components/Toast';

function AddEmployee() {
    const [form, setForm] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { showToast, ToastContainer } = useToast();
    const navigate = useNavigate();

    const departments = [
        'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
        'Human Resources', 'Finance', 'Operations', 'Customer Support', 'Legal',
    ];

    const validate = () => {
        const errs = {};
        if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required';
        if (!form.full_name.trim()) errs.full_name = 'Full name is required';
        if (!form.email.trim()) {
            errs.email = 'Email is required';
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(form.email)) errs.email = 'Invalid email format';
        }
        if (!form.department.trim()) errs.department = 'Department is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSubmitting(true);
        try {
            await createEmployee(form);
            showToast(`Employee "${form.full_name}" added successfully!`);
            setTimeout(() => navigate('/employees'), 1000);
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to add employee';
            showToast(msg, 'error');
            if (msg.includes('ID')) {
                setErrors({ employee_id: msg });
            } else if (msg.includes('email')) {
                setErrors({ email: msg });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }
    };

    return (
        <div className="page-container fade-in">
            <ToastContainer />
            <button className="back-link" onClick={() => navigate('/employees')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back to Employees
            </button>
            <div className="page-header">
                <h2>Add New Employee</h2>
                <p>Fill in the details to register a new team member</p>
            </div>

            <div className="card" style={{ maxWidth: '660px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Employee ID</label>
                            <input
                                type="text"
                                className={`form-input${errors.employee_id ? ' error' : ''}`}
                                placeholder="e.g. EMP001"
                                value={form.employee_id}
                                onChange={(e) => handleChange('employee_id', e.target.value)}
                            />
                            {errors.employee_id && <p className="form-error">{errors.employee_id}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className={`form-input${errors.full_name ? ' error' : ''}`}
                                placeholder="e.g. John Doe"
                                value={form.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                            />
                            {errors.full_name && <p className="form-error">{errors.full_name}</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-input${errors.email ? ' error' : ''}`}
                                placeholder="e.g. john@company.com"
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select
                                className={`form-select${errors.department ? ' error' : ''}`}
                                value={form.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {errors.department && <p className="form-error">{errors.department}</p>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Add Employee
                                </>
                            )}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
