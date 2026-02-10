from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date

from database import engine, get_db, Base
from models import Employee, Attendance
from schemas import (
    EmployeeCreate, EmployeeResponse,
    AttendanceCreate, AttendanceResponse,
    DashboardResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== DASHBOARD ====================

@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    total_employees = db.query(Employee).count()

    today_str = date.today().isoformat()
    present_today = db.query(Attendance).filter(
        Attendance.date == today_str,
        Attendance.status == "Present"
    ).count()
    absent_today = db.query(Attendance).filter(
        Attendance.date == today_str,
        Attendance.status == "Absent"
    ).count()

    departments = [
        d[0] for d in db.query(Employee.department).distinct().all()
    ]

    return DashboardResponse(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        departments=departments
    )


# ==================== EMPLOYEES ====================

@app.post("/api/employees", response_model=EmployeeResponse, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Check duplicate employee_id
    existing = db.query(Employee).filter(
        Employee.employee_id == employee.employee_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Employee with ID '{employee.employee_id}' already exists"
        )

    # Check duplicate email
    existing_email = db.query(Employee).filter(
        Employee.email == employee.email
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=409,
            detail=f"Employee with email '{employee.email}' already exists"
        )

    db_employee = Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    # Get attendance counts
    present = db.query(Attendance).filter(
        Attendance.employee_id == db_employee.employee_id,
        Attendance.status == "Present"
    ).count()
    absent = db.query(Attendance).filter(
        Attendance.employee_id == db_employee.employee_id,
        Attendance.status == "Absent"
    ).count()

    return EmployeeResponse(
        id=db_employee.id,
        employee_id=db_employee.employee_id,
        full_name=db_employee.full_name,
        email=db_employee.email,
        department=db_employee.department,
        created_at=db_employee.created_at,
        total_present=present,
        total_absent=absent
    )


@app.get("/api/employees", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).order_by(Employee.created_at.desc()).all()
    result = []
    for emp in employees:
        present = db.query(Attendance).filter(
            Attendance.employee_id == emp.employee_id,
            Attendance.status == "Present"
        ).count()
        absent = db.query(Attendance).filter(
            Attendance.employee_id == emp.employee_id,
            Attendance.status == "Absent"
        ).count()
        result.append(EmployeeResponse(
            id=emp.id,
            employee_id=emp.employee_id,
            full_name=emp.full_name,
            email=emp.email,
            department=emp.department,
            created_at=emp.created_at,
            total_present=present,
            total_absent=absent
        ))
    return result


@app.get("/api/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID '{employee_id}' not found"
        )

    present = db.query(Attendance).filter(
        Attendance.employee_id == employee.employee_id,
        Attendance.status == "Present"
    ).count()
    absent = db.query(Attendance).filter(
        Attendance.employee_id == employee.employee_id,
        Attendance.status == "Absent"
    ).count()

    return EmployeeResponse(
        id=employee.id,
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department,
        created_at=employee.created_at,
        total_present=present,
        total_absent=absent
    )


@app.delete("/api/employees/{employee_id}", status_code=200)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID '{employee_id}' not found"
        )

    db.delete(employee)
    db.commit()
    return {"message": f"Employee '{employee_id}' deleted successfully"}


# ==================== ATTENDANCE ====================

@app.post("/api/attendance", response_model=AttendanceResponse, status_code=201)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.employee_id == attendance.employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )

    # Check duplicate attendance for the same date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Attendance already marked for employee '{attendance.employee_id}' on {attendance.date}"
        )

    db_attendance = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)

    return AttendanceResponse(
        id=db_attendance.id,
        employee_id=db_attendance.employee_id,
        date=db_attendance.date,
        status=db_attendance.status,
        employee_name=employee.full_name
    )


@app.get("/api/attendance/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(
    employee_id: str,
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID '{employee_id}' not found"
        )

    query = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    )

    if date_from:
        query = query.filter(Attendance.date >= date_from)
    if date_to:
        query = query.filter(Attendance.date <= date_to)

    records = query.order_by(Attendance.date.desc()).all()

    return [
        AttendanceResponse(
            id=r.id,
            employee_id=r.employee_id,
            date=r.date,
            status=r.status,
            employee_name=employee.full_name
        )
        for r in records
    ]


# ==================== HEALTH CHECK ====================

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "HRMS Lite API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
