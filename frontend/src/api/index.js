import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== DASHBOARD ====================
export const getDashboard = () => api.get('/api/dashboard');

// ==================== EMPLOYEES ====================
export const getEmployees = () => api.get('/api/employees');
export const getEmployee = (employeeId) => api.get(`/api/employees/${employeeId}`);
export const createEmployee = (data) => api.post('/api/employees', data);
export const deleteEmployee = (employeeId) => api.delete(`/api/employees/${employeeId}`);

// ==================== ATTENDANCE ====================
export const markAttendance = (data) => api.post('/api/attendance', data);
export const getAttendance = (employeeId, params = {}) =>
  api.get(`/api/attendance/${employeeId}`, { params });

export default api;
