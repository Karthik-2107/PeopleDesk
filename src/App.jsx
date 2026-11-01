import { useState } from 'react';
import './App.css';
import Payslip from './Payslip';
import MyDetails from './MyDetails';

// CUSTOM LOGO
function Logo() {
  return (
    <div className="brand">
      <div className="brand-icon">
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="3" y="3" width="42" height="42" rx="13" fill="#10B981" />
          <circle cx="18" cy="17" r="5" fill="white" />
          <circle cx="31" cy="18" r="4" fill="white" />
          <path d="M9 34C9 27 13 24 18 24C23 24 27 27 27 34" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 27C28 25 30 25 32 25C37 25 40 28 40 34" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div>
        <h2>PeopleDesk</h2>
        <span>EMPLOYEE MANAGEMENT</span>
      </div>
    </div>
  );
}

// SAMPLE EMPLOYEE DATA
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Rahul Kumar',
    department: 'IT',
    jobRole: 'Software Developer',
    salary: 35000,
    email: 'rahul@example.com',
    phone: '9876543210',
    joiningDate: '2025-06-10',
    status: 'Active'
  },
  {
    id: 'EMP002',
    name: 'Priya Sharma',
    department: 'HR',
    jobRole: 'HR Executive',
    salary: 30000,
    email: 'priya@example.com',
    phone: '9876543211',
    joiningDate: '2025-07-15',
    status: 'Active'
  },
  {
    id: 'EMP003',
    name: 'Arun Kumar',
    department: 'Finance',
    jobRole: 'Accountant',
    salary: 32000,
    email: 'arun@example.com',
    phone: '9876543212',
    joiningDate: '2025-08-20',
    status: 'Active'
  }
];

function App() {

  // USERS
  const [users, setUsers] = useState(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (!storedUsers.some(user => user.username.toLowerCase() === 'admin')) {
      storedUsers.push({
        name: 'Admin',
        username: 'admin',
        password: '1234',
        role: 'Admin'
      });
    }

    localStorage.setItem('users', JSON.stringify(storedUsers));
    return storedUsers;
  });

  // LOGIN STATUS
  const [page, setPage] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' &&
      localStorage.getItem('loggedInUser')
      ? 'dashboard'
      : 'login';
  });

  const [loggedInUser, setLoggedInUser] = useState(() => {
    return JSON.parse(localStorage.getItem('loggedInUser')) || null;
  });

  // EMPLOYEES
  const [employees, setEmployees] = useState(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees'));

    if (storedEmployees) {
      return storedEmployees;
    }

    localStorage.setItem('employees', JSON.stringify(sampleEmployees));
    return sampleEmployees;
  });

  // ATTENDANCE RECORDS
  const todayDate = new Date().toLocaleDateString('en-CA');

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    return JSON.parse(localStorage.getItem('attendanceRecords')) || [];
  });

  const [attendanceData, setAttendanceData] = useState({
    employeeId: '',
    date: todayDate,
    status: 'Present'
  });

  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [myAttendanceSearch, setMyAttendanceSearch] = useState('');

  // LEAVE MANAGEMENT
  const [leaveRecords, setLeaveRecords] = useState(() => {
    return JSON.parse(localStorage.getItem('leaveRecords')) || [];
  });

  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const [leaveData, setLeaveData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const [leaveSearch, setLeaveSearch] = useState('');

  const [activeModule, setActiveModule] = useState('Dashboard');

  // LOGIN AND SIGNUP DATA
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // EMPLOYEE FORM
  const emptyEmployee = {
    id: '',
    name: '',
    department: '',
    jobRole: '',
    salary: '',
    email: '',
    phone: '',
    joiningDate: '',
    status: 'Active'
  };

  const [employeeData, setEmployeeData] = useState(emptyEmployee);
  const [editingEmployee, setEditingEmployee] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // SAVE EMPLOYEES
  const saveEmployees = (updatedEmployees) => {
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
  };

  // LOGIN INPUT
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // SIGNUP INPUT
  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  // SIGNUP
  const handleSignup = (e) => {
    e.preventDefault();

    const { name, username, password, confirmPassword } = signupData;

    if (password.length < 4) {
      setMessage('Password must contain at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const exists = users.some(
      user => user.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (exists) {
      setMessage('Username already exists.');
      return;
    }

    const newUser = {
      name: name.trim(),
      username: username.trim(),
      password,
      role: 'User'
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    setSignupData({
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    });

    setMessage('Account created successfully!');

    setTimeout(() => {
      setPage('login');
      setMessage('');
    }, 1200);
  };

    // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      item =>
        item.username.toLowerCase() === loginData.username.trim().toLowerCase() &&
        item.password === loginData.password
    );

    if (!user) {
      setMessage('Invalid username or password.');
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    setLoggedInUser(user);
    setActiveModule('Dashboard');
    setPage('dashboard');
    setMessage('');
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');

    setLoggedInUser(null);
    setLoginData({ username: '', password: '' });
    setActiveModule('Dashboard');
    setPage('login');
    setMessage('');
  };

  // OPEN ADD EMPLOYEE FORM
  const openAddForm = () => {
    setEmployeeData({
      ...emptyEmployee,
      id: `EMP${String(Date.now()).slice(-6)}`
    });

    setEditingEmployee(false);
    setShowEmployeeForm(true);
  };

  // OPEN EDIT EMPLOYEE FORM
  const openEditForm = (employee) => {
    setEmployeeData({ ...employee });
    setEditingEmployee(true);
    setShowEmployeeForm(true);
  };

  // EMPLOYEE INPUT
  const handleEmployeeChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value
    });
  };

  // ADD OR UPDATE EMPLOYEE
  const handleEmployeeSubmit = (e) => {
    e.preventDefault();

    if (Number(employeeData.salary) <= 0) {
      alert('Please enter a valid salary.');
      return;
    }

    if (!/^[0-9]{10}$/.test(employeeData.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    let updatedEmployees;

    if (editingEmployee) {
      updatedEmployees = employees.map(employee =>
        employee.id === employeeData.id
          ? { ...employeeData, salary: Number(employeeData.salary) }
          : employee
      );

      alert('Employee details updated successfully!');
    } else {
      const duplicateId = employees.some(
        employee => employee.id === employeeData.id
      );

      if (duplicateId) {
        alert('Employee ID already exists.');
        return;
      }

      updatedEmployees = [
        ...employees,
        { ...employeeData, salary: Number(employeeData.salary) }
      ];

      alert('Employee added successfully!');
    }

    saveEmployees(updatedEmployees);
    setShowEmployeeForm(false);
    setEmployeeData(emptyEmployee);
  };

  // DELETE EMPLOYEE
  const deleteEmployee = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this employee?'
    );

    if (!confirmDelete) {
      return;
    }

    const updatedEmployees = employees.filter(
      employee => employee.id !== id
    );

    saveEmployees(updatedEmployees);
  };

  // SAVE ATTENDANCE RECORDS
  const saveAttendanceRecords = (updatedRecords) => {
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
    setAttendanceRecords(updatedRecords);
  };

  // ADD ATTENDANCE
  const handleAttendanceSubmit = (e) => {
    e.preventDefault();

    const selectedEmployee = employees.find(
      employee => employee.id === attendanceData.employeeId
    );

    if (!selectedEmployee) {
      alert('Please select an employee.');
      return;
    }

    const duplicateRecord = attendanceRecords.some(
      record =>
        record.employeeId === attendanceData.employeeId &&
        record.date === attendanceData.date
    );

    if (duplicateRecord) {
      alert('Attendance is already recorded for this employee on this date.');
      return;
    }

    const newRecord = {
      id: `${attendanceData.employeeId}-${attendanceData.date}`,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      date: attendanceData.date,
      status: attendanceData.status
    };

    saveAttendanceRecords([...attendanceRecords, newRecord]);
    setAttendanceData({
      employeeId: '',
      date: todayDate,
      status: 'Present'
    });
    setShowAttendanceForm(false);
    alert('Attendance saved successfully!');
  };

  // DELETE ATTENDANCE RECORD
  const deleteAttendance = (recordId) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    saveAttendanceRecords(
      attendanceRecords.filter(record => record.id !== recordId)
    );
  };

  // SAVE LEAVE RECORDS
  const saveLeaveRecords = (updatedRecords) => {
    localStorage.setItem('leaveRecords', JSON.stringify(updatedRecords));
    setLeaveRecords(updatedRecords);
  };

  // APPLY FOR LEAVE
  const handleLeaveSubmit = (e) => {
    e.preventDefault();

    if (leaveData.toDate < leaveData.fromDate) {
      alert('To date cannot be earlier than From date.');
      return;
    }

    const matchingEmployee = employees.find(
      employee =>
        employee.name.trim().toLowerCase() ===
        loggedInUser?.name?.trim().toLowerCase()
    );

    const newLeave = {
      id: `LEAVE-${Date.now()}`,
      employeeId: matchingEmployee?.id || 'N/A',
      employeeName: loggedInUser?.name || 'Employee',
      leaveType: leaveData.leaveType,
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason.trim(),
      status: 'Pending',
      appliedOn: todayDate
    };

    saveLeaveRecords([...leaveRecords, newLeave]);

    setLeaveData({
      leaveType: 'Casual Leave',
      fromDate: '',
      toDate: '',
      reason: ''
    });

    setShowLeaveForm(false);
    alert('Leave application submitted successfully!');
  };

  // APPROVE OR REJECT LEAVE
  const updateLeaveStatus = (leaveId, status) => {
    const updatedRecords = leaveRecords.map(record =>
      record.id === leaveId
        ? { ...record, status }
        : record
    );

    saveLeaveRecords(updatedRecords);
  };

  // DELETE LEAVE REQUEST
  const deleteLeave = (leaveId) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    saveLeaveRecords(
      leaveRecords.filter(record => record.id !== leaveId)
    );
  };

  // NAVIGATION MODULES
  const adminModules = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'Employees', icon: '♙' },
    { name: 'Attendance', icon: '◷' },
    { name: 'Leave', icon: '▤' },
    { name: 'Payslip', icon: '₹' }
  ];

  const employeeModules = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'My Details', icon: '♙' },
    { name: 'My Attendance', icon: '◷' },
    { name: 'Apply Leave', icon: '▤' },
    { name: 'My Payslip', icon: '₹' }
  ];

  // LOGIN PAGE


    if (page === 'login') {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <Logo />

          <div className="auth-intro">
            <span className="welcome-label">WELCOME TO PEOPLEDESK</span>

            <h1>
              Manage your people.<br />
              <span>Grow your organization.</span>
            </h1>

            <p>
              A simple and organized way to manage employee information,
              attendance, leave and payroll.
            </p>

            <div className="auth-features">
              <div>✓ Employee Management</div>
              <div>✓ Attendance Tracking</div>
              <div>✓ Leave & Payroll Management</div>
            </div>
          </div>

          <div className="auth-bottom">
            Employee Management System · 2026
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="mobile-logo">
              <Logo />
            </div>

            <span className="form-label">ACCOUNT LOGIN</span>
            <h2>Welcome back!</h2>

            <p className="form-description">
              Please enter your details to sign in.
            </p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>

                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button className="auth-button" type="submit">
                Sign In →
              </button>
            </form>

            {message && <p className="message">{message}</p>}

            <p className="auth-switch">
              Don't have an account?
              <button onClick={() => {
                setPage('signup');
                setMessage('');
              }}>
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SIGNUP PAGE
  if (page === 'signup') {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <Logo />

          <div className="auth-intro">
            <span className="welcome-label">JOIN PEOPLEDESK</span>

            <h1>
              One place for<br />
              <span>your work journey.</span>
            </h1>

            <p>
              Create your account and access your employee dashboard
              with all your important information.
            </p>

            <div className="auth-features">
              <div>✓ View Your Details</div>
              <div>✓ Track Attendance</div>
              <div>✓ Apply for Leave</div>
            </div>
          </div>

          <div className="auth-bottom">
            Employee Management System · 2026
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="mobile-logo">
              <Logo />
            </div>

            <span className="form-label">CREATE ACCOUNT</span>
            <h2>Get started</h2>

            <p className="form-description">
              Fill in your details to create an account.
            </p>

            <form onSubmit={handleSignup}>
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Create a username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <button className="auth-button" type="submit">
                Create Account →
              </button>
            </form>

            {message && <p className="message">{message}</p>}

            <p className="auth-switch">
              Already have an account?
              <button onClick={() => {
                setPage('login');
                setMessage('');
              }}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

    // DASHBOARD
  const isAdmin = loggedInUser?.role === 'Admin';
  const modules = isAdmin ? adminModules : employeeModules;

  const filteredEmployees = employees.filter(employee =>
    `${employee.name} ${employee.id} ${employee.department} ${employee.jobRole}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const departments = new Set(
    employees.map(employee => employee.department)
  ).size;

  // DASHBOARD SUMMARY DATA
const dashboardPayslips =
  JSON.parse(localStorage.getItem('payslips')) || [];

const totalPayroll = dashboardPayslips.reduce(
  (total, item) => total + Number(item.netSalary || 0),
  0
);

const presentToday = attendanceRecords.filter(
  record =>
    record.date === todayDate &&
    record.status === 'Present'
).length;

const absentToday = attendanceRecords.filter(
  record =>
    record.date === todayDate &&
    record.status === 'Absent'
).length;

const pendingLeaves = leaveRecords.filter(
  record => record.status === 'Pending'
);

const recentLeaves = [...leaveRecords]
  .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
  .slice(0, 5);
  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <Logo />

        <div className="sidebar-heading">MAIN MENU</div>

        <nav className="sidebar-nav">
          {modules.map(module => (
            <button
              key={module.name}
              className={
                activeModule === module.name
                  ? 'sidebar-link selected'
                  : 'sidebar-link'
              }
              onClick={() => {
                setActiveModule(module.name);
                setShowEmployeeForm(false);
                setSearchTerm('');
              }}
            >
              <span className="sidebar-icon">{module.icon}</span>
              {module.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="user-avatar">
              {loggedInUser?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{loggedInUser?.name}</strong>
              <span>{loggedInUser?.role}</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-content">

        <header className="topbar">
          <div>
            <h2>{activeModule}</h2>
            <p>PeopleDesk / {activeModule}</p>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">
              {loggedInUser?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{loggedInUser?.name}</span>
          </div>
        </header>

        <section className="content-area">

          {/* ADMIN DASHBOARD */}
          {/* EMPLOYEE MY DETAILS */}
{activeModule === 'My Details' && !isAdmin && (
  <MyDetails
    loggedInUser={loggedInUser}
    employees={employees}
  />
)}
          {activeModule === 'Dashboard' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Hello, {loggedInUser?.name} 👋</h1>
                  <p>Here's an overview of your workspace.</p>
                </div>
              </div>

              {isAdmin ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span>Total Employees</span>
                      <h2>{employees.length}</h2>
                      <p>Employee records</p>
                    </div>

                    <div className="stat-card">
                      <span>Present Today</span>
                      <h2>
                        {attendanceRecords.filter(
                          record =>
                            record.date === todayDate &&
                            record.status === 'Present'
                        ).length}
                      </h2>
                      <p>Present attendance records</p>
                    </div>

                    <div className="stat-card">
                      <span>Leave Requests</span>
                      <h2>
                        {leaveRecords.filter(
                          record => record.status === 'Pending'
                        ).length}
                      </h2>
                      <p>Pending requests</p>
                    </div>

                    <div className="stat-card">
                      <span>Departments</span>
                      <h2>{departments}</h2>
                      <p>Organization units</p>
                    </div>
                    {/* DASHBOARD OVERVIEW */}
<div className="dashboard-extra-grid">

  <div className="dashboard-extra-card">
    <h2>Attendance Overview</h2>

    <div className="overview-row">
      <span>Present Today</span>
      <strong className="overview-green">{presentToday}</strong>
    </div>

    <div className="overview-row">
      <span>Absent Today</span>
      <strong className="overview-red">{absentToday}</strong>
    </div>

    <div className="overview-row">
      <span>Total Employees</span>
      <strong>{employees.length}</strong>
    </div>
  </div>

  <div className="dashboard-extra-card">
    <h2>Payroll Summary</h2>

    <div className="payroll-highlight">
      ₹{totalPayroll.toLocaleString('en-IN')}
    </div>

    <p>Total net salary of generated payslips</p>

    <div className="overview-row">
      <span>Generated Payslips</span>
      <strong>{dashboardPayslips.length}</strong>
    </div>
  </div>

</div>

{/* RECENT LEAVE REQUESTS */}
<div className="dashboard-extra-card recent-leaves-card">

  <h2>Recent Leave Requests</h2>

  {recentLeaves.length > 0 ? (
    <div className="recent-leave-list">
      {recentLeaves.map(leave => (
        <div className="recent-leave-item" key={leave.id}>

          <div>
            <strong>{leave.employeeName}</strong>
            <p>{leave.leaveType} · {leave.fromDate}</p>
          </div>

          <span className={`status-badge ${
            leave.status === 'Approved'
              ? 'active-status'
              : leave.status === 'Rejected'
              ? 'inactive-status'
              : 'pending-status'
          }`}>
            {leave.status}
          </span>

        </div>
      ))}
    </div>
  ) : (
    <p>No leave requests available.</p>
  )}

</div>
                  </div>

                  <div className="welcome-panel">
                    <h2>Welcome to your Admin Workspace</h2>
                    <p>
                      Manage employees, monitor attendance, review leave
                      requests and access payslip information from one place.
                    </p>
                  </div>
                </>
              ) : (
                <div className="welcome-panel">
                  <h2>Welcome to your Employee Workspace</h2>
                  <p>
                    View your personal details, check attendance,
                    apply for leave and access your payslip.
                  </p>
                </div>
              )}
            </>
          )}

          {/* EMPLOYEE MANAGEMENT */}
          {activeModule === 'Employees' && isAdmin && (
            <>
              <div className="page-heading employee-heading">
                <div>
                  <h1>Employee Management</h1>
                  <p>Manage your organization's employee records.</p>
                </div>

                <button className="add-button" onClick={openAddForm}>
                  + Add Employee
                </button>
              </div>

              <div className="employee-summary">
                <div>
                  <span>Total Employees</span>
                  <h2>{employees.length}</h2>
                </div>

                <div>
                  <span>Active Employees</span>
                  <h2>
                    {employees.filter(
                      employee => employee.status === 'Active'
                    ).length}
                  </h2>
                </div>

                <div>
                  <span>Departments</span>
                  <h2>{departments}</h2>
                </div>
              </div>

              {showEmployeeForm && (
                <div className="employee-form-card">
                  <h2>
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h2>

                  <form onSubmit={handleEmployeeSubmit}>
                    <div className="employee-form-grid">

                      <div className="input-group">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          name="id"
                          value={employeeData.id}
                          readOnly={!editingEmployee}
                          onChange={handleEmployeeChange}
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={employeeData.name}
                          onChange={handleEmployeeChange}
                          placeholder="Enter employee name"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Department</label>
                        <select
                          name="department"
                          value={employeeData.department}
                          onChange={handleEmployeeChange}
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="IT">IT</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Job Role</label>
                        <input
                          type="text"
                          name="jobRole"
                          value={employeeData.jobRole}
                          onChange={handleEmployeeChange}
                          placeholder="Enter job role"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Salary (₹)</label>
                        <input
                          type="number"
                          name="salary"
                          value={employeeData.salary}
                          onChange={handleEmployeeChange}
                          placeholder="Enter salary"
                          min="1"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={employeeData.email}
                          onChange={handleEmployeeChange}
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={employeeData.phone}
                          onChange={handleEmployeeChange}
                          placeholder="10-digit phone number"
                          maxLength="10"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Joining Date</label>
                        <input
                          type="date"
                          name="joiningDate"
                          value={employeeData.joiningDate}
                          onChange={handleEmployeeChange}
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Status</label>
                        <select
                          name="status"
                          value={employeeData.status}
                          onChange={handleEmployeeChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                    </div>

                    <div className="form-actions">
                      <button type="submit" className="add-button">
                        {editingEmployee ? 'Update Employee' : 'Save Employee'}
                      </button>

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowEmployeeForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="employee-table-card">
                <div className="table-header">
                  <h2>Employee Records</h2>

                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="table-scroll">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Job Role</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEmployees.map(employee => (
                        <tr key={employee.id}>
                          <td>{employee.id}</td>
                          <td>
                            <strong>{employee.name}</strong>
                          </td>
                          <td>{employee.department}</td>
                          <td>{employee.jobRole}</td>
                          <td>
                            ₹{Number(employee.salary).toLocaleString('en-IN')}
                          </td>
                          <td>
                            <span
                              className={
                                employee.status === 'Active'
                                  ? 'status-badge active-status'
                                  : 'status-badge inactive-status'
                              }
                            >
                              {employee.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => openEditForm(employee)}
                              >
                                Edit
                              </button>

                              <button
                                className="delete-button"
                                onClick={() => deleteEmployee(employee.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan="7" className="empty-row">
                            No employee records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}


                    {/* ATTENDANCE MANAGEMENT */}
          {activeModule === 'Attendance' && isAdmin && (
            <>
              <div className="page-heading employee-heading">
                <div>
                  <h1>Attendance Management</h1>
                  <p>Record and monitor daily employee attendance.</p>
                </div>

                <button
                  className="add-button"
                  onClick={() => setShowAttendanceForm(!showAttendanceForm)}
                >
                  {showAttendanceForm ? 'Close Form' : '+ Mark Attendance'}
                </button>
              </div>

              <div className="employee-summary">
                <div>
                  <span>Total Records</span>
                  <h2>{attendanceRecords.length}</h2>
                </div>

                <div>
                  <span>Present Today</span>
                  <h2>
                    {attendanceRecords.filter(
                      record =>
                        record.date === todayDate &&
                        record.status === 'Present'
                    ).length}
                  </h2>
                </div>

                <div>
                  <span>Absent Today</span>
                  <h2>
                    {attendanceRecords.filter(
                      record =>
                        record.date === todayDate &&
                        record.status === 'Absent'
                    ).length}
                  </h2>
                </div>
              </div>

              {showAttendanceForm && (
                <div className="employee-form-card">
                  <h2>Mark Employee Attendance</h2>

                  <form onSubmit={handleAttendanceSubmit}>
                    <div className="employee-form-grid">

                      <div className="input-group">
                        <label>Employee</label>

                        <select
                          value={attendanceData.employeeId}
                          onChange={e =>
                            setAttendanceData({
                              ...attendanceData,
                              employeeId: e.target.value
                            })
                          }
                          required
                        >
                          <option value="">Select Employee</option>

                          {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                              {employee.id} - {employee.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Date</label>

                        <input
                          type="date"
                          value={attendanceData.date}
                          onChange={e =>
                            setAttendanceData({
                              ...attendanceData,
                              date: e.target.value
                            })
                          }
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>Attendance Status</label>

                        <select
                          value={attendanceData.status}
                          onChange={e =>
                            setAttendanceData({
                              ...attendanceData,
                              status: e.target.value
                            })
                          }
                          required
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>

                    </div>

                    <div className="form-actions">
                      <button type="submit" className="add-button">
                        Save Attendance
                      </button>

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowAttendanceForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="employee-table-card">
                <div className="table-header">
                  <h2>Attendance Records</h2>

                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search attendance..."
                    value={attendanceSearch}
                    onChange={e => setAttendanceSearch(e.target.value)}
                  />
                </div>

                <div className="table-scroll">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceRecords
                        .filter(record =>
                          `${record.employeeId} ${record.employeeName} ${record.date} ${record.status}`
                            .toLowerCase()
                            .includes(attendanceSearch.toLowerCase())
                        )
                        .map(record => (
                          <tr key={record.id}>
                            <td>{record.employeeId}</td>
                            <td>{record.employeeName}</td>
                            <td>{record.date}</td>
                            <td>
                              <span
                                className={`status-badge ${
                                  record.status === 'Present'
                                    ? 'active-status'
                                    : record.status === 'Absent'
                                    ? 'inactive-status'
                                    : 'pending-status'
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="delete-button"
                                onClick={() => deleteAttendance(record.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}

                      {attendanceRecords.filter(record =>
                        `${record.employeeId} ${record.employeeName} ${record.date} ${record.status}`
                          .toLowerCase()
                          .includes(attendanceSearch.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan="5" className="empty-row">
                            No attendance records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

                    {/* ADMIN LEAVE MANAGEMENT */}
          {/* EMPLOYEE MY ATTENDANCE */}
          {activeModule === 'My Attendance' && !isAdmin && (
            <>
              <div className="page-heading employee-heading">
                <div>
                  <h1>My Attendance</h1>
                  <p>View your daily attendance history.</p>
                </div>
              </div>

              <div className="employee-summary">
                <div>
                  <span>Total Records</span>
                  <h2>{attendanceRecords.filter(record =>
                    record.employeeName?.trim().toLowerCase() ===
                    loggedInUser?.name?.trim().toLowerCase()
                  ).length}</h2>
                </div>
                <div>
                  <span>Present Days</span>
                  <h2>{attendanceRecords.filter(record =>
                    record.employeeName?.trim().toLowerCase() ===
                    loggedInUser?.name?.trim().toLowerCase() && record.status === 'Present'
                  ).length}</h2>
                </div>
                <div>
                  <span>Absent Days</span>
                  <h2>{attendanceRecords.filter(record =>
                    record.employeeName?.trim().toLowerCase() ===
                    loggedInUser?.name?.trim().toLowerCase() && record.status === 'Absent'
                  ).length}</h2>
                </div>
                <div>
                  <span>Leave Days</span>
                  <h2>{attendanceRecords.filter(record =>
                    record.employeeName?.trim().toLowerCase() ===
                    loggedInUser?.name?.trim().toLowerCase() && record.status === 'Leave'
                  ).length}</h2>
                </div>
              </div>

              <div className="employee-table-card">
                <div className="table-header">
                  <h2>My Attendance History</h2>
                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search date or status..."
                    value={myAttendanceSearch}
                    onChange={e => setMyAttendanceSearch(e.target.value)}
                  />
                </div>
                <div className="table-scroll">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords
                        .filter(record =>
                          record.employeeName?.trim().toLowerCase() ===
                          loggedInUser?.name?.trim().toLowerCase()
                        )
                        .filter(record =>
                          `${record.date} ${record.status}`.toLowerCase().includes(myAttendanceSearch.toLowerCase())
                        )
                        .slice()
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map(record => (
                          <tr key={record.id}>
                            <td>{record.date}</td>
                            <td>
                              <span className={`status-badge ${
                                record.status === 'Present'
                                  ? 'active-status'
                                  : record.status === 'Absent'
                                  ? 'inactive-status'
                                  : 'pending-status'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      {attendanceRecords.filter(record =>
                        record.employeeName?.trim().toLowerCase() ===
                        loggedInUser?.name?.trim().toLowerCase()
                      ).filter(record =>
                        `${record.date} ${record.status}`.toLowerCase().includes(myAttendanceSearch.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan="2" className="empty-row">
                            {myAttendanceSearch
                              ? 'No attendance records match your search.'
                              : 'No attendance records found for your account yet.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeModule === 'Leave' && isAdmin && (
            <>
              <div className="page-heading employee-heading">
                <div>
                  <h1>Leave Management</h1>
                  <p>Review and manage employee leave applications.</p>
                </div>
              </div>

              <div className="employee-summary">
                <div>
                  <span>Total Applications</span>
                  <h2>{leaveRecords.length}</h2>
                </div>

                <div>
                  <span>Pending Requests</span>
                  <h2>
                    {leaveRecords.filter(
                      record => record.status === 'Pending'
                    ).length}
                  </h2>
                </div>

                <div>
                  <span>Approved Requests</span>
                  <h2>
                    {leaveRecords.filter(
                      record => record.status === 'Approved'
                    ).length}
                  </h2>
                </div>
              </div>

              <div className="employee-table-card">
                <div className="table-header">
                  <h2>Leave Applications</h2>

                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search employee..."
                    value={leaveSearch}
                    onChange={e => setLeaveSearch(e.target.value)}
                  />
                </div>

                <div className="table-scroll">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Leave Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaveRecords
                        .filter(record =>
                          `${record.employeeId} ${record.employeeName}`
                            .toLowerCase()
                            .includes(leaveSearch.toLowerCase())
                        )
                        .slice()
                        .sort((a, b) =>
                          b.appliedOn.localeCompare(a.appliedOn)
                        )
                        .map(record => (
                          <tr key={record.id}>
                            <td>{record.employeeId}</td>
                            <td>
                              <strong>{record.employeeName}</strong>
                            </td>
                            <td>{record.leaveType}</td>
                            <td>{record.fromDate}</td>
                            <td>{record.toDate}</td>
                            <td className="leave-reason">
                              {record.reason}
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  record.status === 'Approved'
                                    ? 'active-status'
                                    : record.status === 'Rejected'
                                    ? 'inactive-status'
                                    : 'pending-status'
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td>
                              {record.status === 'Pending' ? (
                                <div className="action-buttons">
                                  <button
                                    className="approve-button"
                                    onClick={() =>
                                      updateLeaveStatus(record.id, 'Approved')
                                    }
                                  >
                                    Approve
                                  </button>

                                  <button
                                    className="delete-button"
                                    onClick={() =>
                                      updateLeaveStatus(record.id, 'Rejected')
                                    }
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="delete-button"
                                  onClick={() => deleteLeave(record.id)}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}

                      {leaveRecords.filter(record =>
                        `${record.employeeId} ${record.employeeName}`
                          .toLowerCase()
                          .includes(leaveSearch.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan="8" className="empty-row">
                            No leave applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* EMPLOYEE APPLY LEAVE */}
          {activeModule === 'Apply Leave' && !isAdmin && (
            <>
              <div className="page-heading employee-heading">
                <div>
                  <h1>Apply for Leave</h1>
                  <p>
                    Submit a leave request and track its approval status.
                  </p>
                </div>

                <button
                  className="add-button"
                  onClick={() => setShowLeaveForm(!showLeaveForm)}
                >
                  {showLeaveForm ? 'Close Form' : '+ Apply Leave'}
                </button>
              </div>

              {showLeaveForm && (
                <div className="employee-form-card">
                  <h2>New Leave Application</h2>

                  <form onSubmit={handleLeaveSubmit}>
                    <div className="employee-form-grid">

                      <div className="input-group">
                        <label>Leave Type</label>

                        <select
                          value={leaveData.leaveType}
                          onChange={e =>
                            setLeaveData({
                              ...leaveData,
                              leaveType: e.target.value
                            })
                          }
                          required
                        >
                          <option>Casual Leave</option>
                          <option>Sick Leave</option>
                          <option>Earned Leave</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>From Date</label>

                        <input
                          type="date"
                          min={todayDate}
                          value={leaveData.fromDate}
                          onChange={e =>
                            setLeaveData({
                              ...leaveData,
                              fromDate: e.target.value
                            })
                          }
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>To Date</label>

                        <input
                          type="date"
                          min={leaveData.fromDate || todayDate}
                          value={leaveData.toDate}
                          onChange={e =>
                            setLeaveData({
                              ...leaveData,
                              toDate: e.target.value
                            })
                          }
                          required
                        />
                      </div>

                      <div className="input-group leave-reason-field">
                        <label>Reason</label>

                        <input
                          type="text"
                          placeholder="Enter reason for leave"
                          value={leaveData.reason}
                          onChange={e =>
                            setLeaveData({
                              ...leaveData,
                              reason: e.target.value
                            })
                          }
                          maxLength="180"
                          required
                        />
                      </div>

                    </div>

                    <div className="form-actions">
                      <button type="submit" className="add-button">
                        Submit Application
                      </button>

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowLeaveForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="employee-table-card">
                <div className="table-header">
                  <h2>My Leave Applications</h2>
                </div>

                <div className="table-scroll">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaveRecords
                        .filter(
                          record =>
                            record.employeeName.trim().toLowerCase() ===
                            loggedInUser?.name?.trim().toLowerCase()
                        )
                        .slice()
                        .sort((a, b) =>
                          b.appliedOn.localeCompare(a.appliedOn)
                        )
                        .map(record => (
                          <tr key={record.id}>
                            <td>{record.leaveType}</td>
                            <td>{record.fromDate}</td>
                            <td>{record.toDate}</td>
                            <td className="leave-reason">
                              {record.reason}
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  record.status === 'Approved'
                                    ? 'active-status'
                                    : record.status === 'Rejected'
                                    ? 'inactive-status'
                                    : 'pending-status'
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                      {leaveRecords.filter(
                        record =>
                          record.employeeName.trim().toLowerCase() ===
                          loggedInUser?.name?.trim().toLowerCase()
                      ).length === 0 && (
                        <tr>
                          <td colSpan="5" className="empty-row">
                            You have not submitted any leave applications.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {/* ADMIN PAYSLIP MANAGEMENT */}
          {activeModule === 'Payslip' && isAdmin && (
            <Payslip
              isAdmin={true}
              loggedInUser={loggedInUser}
              employees={employees}
            />
          )}

          {/* EMPLOYEE MY PAYSLIP */}
          {activeModule === 'My Payslip' && !isAdmin && (
            <Payslip
              isAdmin={false}
              loggedInUser={loggedInUser}
              employees={employees}
            />
          )}

          {/* OTHER MODULES */}

          {activeModule !== 'Dashboard' &&
            activeModule !== 'Employees' &&
          activeModule !== 'My Details' &&
            activeModule !== 'Attendance' &&
            activeModule !== 'My Attendance' &&
            activeModule !== 'Leave' &&
            activeModule !== 'Apply Leave' &&
            activeModule !== 'Payslip' &&
            activeModule !== 'My Payslip' && (
              <div className="welcome-panel">
                <h2>{activeModule}</h2>
                <p>
                  This module will be implemented in the upcoming
                  development steps.
                </p>
              </div>
            )}
                    </section>
      </main>
    </div>
  );
}

export default App;