from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
import re

# Employee schemas

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

    @field_validator("employee_id")
    @classmethod
    def employee_id_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Employee ID is required")
        return v.strip()

    @field_validator("full_name")
    @classmethod
    def full_name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Full name is required")
        return v.strip()

    @field_validator("email")
    @classmethod
    def email_valid(cls, v):
        if not v or not v.strip():
            raise ValueError("Email is required")
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v.strip()):
            raise ValueError("Invalid email format")
        return v.strip().lower()

    @field_validator("department")
    @classmethod
    def department_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Department is required")
        return v.strip()


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime
    total_present: Optional[int] = 0
    total_absent: Optional[int] = 0

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    employee_id: str
    date: str
    status: str

    @field_validator("employee_id")
    @classmethod
    def employee_id_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Employee ID is required")
        return v.strip()

    @field_validator("date")
    @classmethod
    def date_valid(cls, v):
        if not v or not v.strip():
            raise ValueError("Date is required")
        try:
            datetime.strptime(v.strip(), "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v.strip()

    @field_validator("status")
    @classmethod
    def status_valid(cls, v):
        if not v or not v.strip():
            raise ValueError("Status is required")
        if v.strip() not in ["Present", "Absent"]:
            raise ValueError("Status must be 'Present' or 'Absent'")
        return v.strip()


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: str
    status: str
    employee_name: Optional[str] = None

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    departments: List[str]
