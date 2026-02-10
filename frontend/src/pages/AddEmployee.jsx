import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../api';
import { useToast } from '../components/Toast';

function AddEmployee() {
    const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { showToast, ToastContainer } = useToast();
    const navigate = useNavigate();

    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Customer Support', 'Legal'];

    const validate = () => {
        const errs = {};
        if (!form.employee_id.trim()) errs.employee_id = 'Required';
        if (!form.full_name.trim()) errs.full_name = 'Required';
        if (!form.email.trim()) errs.email = 'Required';
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) errs.email = 'Invalid email';
        if (!form.department.trim()) errs.department = 'Required';
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
            showToast(`"${form.full_name}" added`);
            setTimeout(() => navigate('/employees'), 800);
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to add employee';
            showToast(msg, 'error');
            if (msg.includes('ID')) setErrors({ employee_id: msg });
            else if (msg.includes('email')) setErrors({ email: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => { const c = { ...prev }; delete c[field]; return c; });
    };

    return (
        <div className="page-container">
            <ToastContainer />
            <button className="back-link" onClick={() => navigate('/employees')}>← Back</button>
            <div className="page-header">
                <h2>Add Employee</h2>
                <p>Register a new team member</p>
            </div>
            <div className="card" style={{ maxWidth: 600 }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Employee ID</label>
                            <input type="text" className={`form-input${errors.employee_id ? ' error' : ''}`} placeholder="EMP001" value={form.employee_id} onChange={(e) => handleChange('employee_id', e.target.value)} />
                            {errors.employee_id && <p className="form-error">{errors.employee_id}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className={`form-input${errors.full_name ? ' error' : ''}`} placeholder="John Doe" value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} />
                            {errors.full_name && <p className="form-error">{errors.full_name}</p>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className={`form-input${errors.email ? ' error' : ''}`} placeholder="john@company.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className={`form-select${errors.department ? ' error' : ''}`} value={form.department} onChange={(e) => handleChange('department', e.target.value)}>
                                <option value="">Select...</option>
                                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.department && <p className="form-error">{errors.department}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Employee'}</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
