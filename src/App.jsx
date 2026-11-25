import { useEffect, useMemo, useState } from "react";
import peopleDeskLogo from "./assets/peopledesk-logo.png";
import {
  LayoutDashboard,
  Users,
  Building2,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarDays,
  Wallet,
  FileBarChart,
  Megaphone,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Check,
  Clock,
  UserRound,
  ShieldCheck,
  ArrowUpRight,
  Download,
  IndianRupee,
} from "lucide-react";

import "./App.css";

const STORAGE = {
  users: "peopledesk_users",
  employees: "peopledesk_employees",
  attendance: "peopledesk_attendance",
  leaves: "peopledesk_leaves",
  payroll: "peopledesk_payroll",
  departments: "peopledesk_departments",
  notices: "peopledesk_notices",
  holidays: "peopledesk_holidays",
  currentUser: "peopledesk_current_user",
};

const DEFAULT_ADMIN = {
  id: "ADMIN-DEFAULT",
  name: "PeopleDesk Admin",
  username: "admin",
  email: "admin@peopledesk.local",
  password: "Admin@123",
  role: "Admin",
};

function getStoredData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Unable to save data:", error);
  }
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function validatePassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function StatCard({ title, value, icon, note }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <h2>{value}</h2>
      {note && <p>{note}</p>}
    </div>
  );
}

function EmptyState({ text = "No records found." }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FileBarChart size={25} />
      </div>
      <p>{text}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const className = String(status || "Pending")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${className}`}>
      {status || "Pending"}
    </span>
  );
}

function EmployeeTable({ employees, onEdit, onDelete, isAdmin }) {
  if (!employees.length) {
    return <EmptyState text="No employees found." />;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining Date</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="table-person">
                  <div className="table-avatar">
                    {employee.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{employee.name}</strong>
                    <small>{employee.id}</small>
                  </div>
                </div>
              </td>

              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td>{formatDate(employee.joiningDate)}</td>

              <td>
                <StatusBadge status={employee.status} />
              </td>

              {isAdmin && (
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEdit(employee)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      className="delete-action"
                      onClick={() => onDelete(employee.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AttendanceTable({ records, employees }) {
  if (!records.length) {
    return <EmptyState text="No attendance records available." />;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {[...records].reverse().map((record) => {
            const employee = employees.find(
              (item) => item.id === record.employeeId
            );

            return (
              <tr key={record.id}>
                <td>{employee?.name || "Unknown Employee"}</td>
                <td>{formatDate(record.date)}</td>
                <td>
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function LeaveTable({ leaves, employees, isAdmin, onUpdate }) {
  if (!leaves.length) {
    return <EmptyState text="No leave applications available." />;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Duration</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {[...leaves].reverse().map((leave) => {
            const employee = employees.find(
              (item) => item.id === leave.employeeId
            );

            return (
              <tr key={leave.id}>
                <td>{employee?.name || "Unknown"}</td>
                <td>{leave.type}</td>
                <td>
                  {formatDate(leave.from)} - {formatDate(leave.to)}
                </td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  <StatusBadge status={leave.status} />
                </td>

                {isAdmin && (
                  <td>
                    {leave.status === "Pending" && (
                      <div className="table-actions">
                        <button
                          type="button"
                          title="Approve"
                          onClick={() => onUpdate(leave.id, "Approved")}
                        >
                          <Check size={17} />
                        </button>

                        <button
                          type="button"
                          title="Reject"
                          className="delete-action"
                          onClick={() => onUpdate(leave.id, "Rejected")}
                        >
                          <X size={17} />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PayslipTable({ payroll, employees }) {
  if (!payroll.length) {
    return <EmptyState text="No payslip records available." />;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Salary</th>
          </tr>
        </thead>

        <tbody>
          {[...payroll].reverse().map((record) => {
            const employee = employees.find(
              (item) => item.id === record.employeeId
            );

            return (
              <tr key={record.id}>
                <td>{employee?.name || "Unknown"}</td>
                <td>{record.month}</td>
                <td>{formatCurrency(record.basic)}</td>
                <td>{formatCurrency(record.allowances)}</td>
                <td>{formatCurrency(record.deductions)}</td>
                <td>
                  <strong>{formatCurrency(record.netSalary)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState(() => {
    const savedUsers = getStoredData(STORAGE.users, []);
    const storedUsers = Array.isArray(savedUsers) ? savedUsers : [];
    const adminExists = storedUsers.some((user) => user.role === "Admin");

    return adminExists ? storedUsers : [...storedUsers, DEFAULT_ADMIN];
  });

  const [employees, setEmployees] = useState(() =>
    getStoredData(STORAGE.employees, [])
  );

  const [attendance, setAttendance] = useState(() =>
    getStoredData(STORAGE.attendance, [])
  );

  const [leaves, setLeaves] = useState(() =>
    getStoredData(STORAGE.leaves, [])
  );

  const [payroll, setPayroll] = useState(() =>
    getStoredData(STORAGE.payroll, [])
  );

  const [departments, setDepartments] = useState(() =>
    getStoredData(STORAGE.departments, [
      "Human Resources",
      "Engineering",
      "Finance",
      "Marketing",
      "Operations",
    ])
  );

  const [notices, setNotices] = useState(() =>
    getStoredData(STORAGE.notices, [])
  );

  const [holidays, setHolidays] = useState(() =>
    getStoredData(STORAGE.holidays, [])
  );

  const [currentUser, setCurrentUser] = useState(() =>
    getStoredData(STORAGE.currentUser, null)
  );

  const [page, setPage] = useState("Dashboard");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationRefresh, setNotificationRefresh] = useState(0);

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const emptyEmployeeForm = {
    name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: getToday(),
    salary: "",
    status: "Active",
  };

  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [departmentForm, setDepartmentForm] = useState("");

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    date: getToday(),
    status: "Present",
  });

  const [leaveForm, setLeaveForm] = useState({
    type: "Casual Leave",
    from: "",
    to: "",
    reason: "",
    employeeId: "",
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: "",
    month: "",
    basic: "",
    allowances: "",
    deductions: "",
  });

  const [noticeForm, setNoticeForm] = useState({
    title: "",
    description: "",
  });

  const [holidayForm, setHolidayForm] = useState({
    name: "",
    date: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => saveData(STORAGE.users, users), [users]);
  useEffect(() => saveData(STORAGE.employees, employees), [employees]);
  useEffect(() => saveData(STORAGE.attendance, attendance), [attendance]);
  useEffect(() => saveData(STORAGE.leaves, leaves), [leaves]);
  useEffect(() => saveData(STORAGE.payroll, payroll), [payroll]);
  useEffect(() => saveData(STORAGE.departments, departments), [departments]);
  useEffect(() => saveData(STORAGE.notices, notices), [notices]);
  useEffect(() => saveData(STORAGE.holidays, holidays), [holidays]);

  useEffect(() => {
    if (currentUser) {
      saveData(STORAGE.currentUser, currentUser);
    } else {
      localStorage.removeItem(STORAGE.currentUser);
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === "Admin";

  // Keep the browser Back button inside PeopleDesk while a user is logged in.
  // Every Back/Forward navigation returns to the main Dashboard instead of
  // reopening a previously visited module or logging the user out.
  useEffect(() => {
    if (!currentUser) return undefined;

    const dashboardHistoryState = { peopleDeskDashboardGuard: true };

    // Create an in-app history entry so the first Back press is handled here.
    window.history.pushState(
      dashboardHistoryState,
      "",
      window.location.href
    );

    const returnToDashboard = () => {
      setPage("Dashboard");
      setServicesOpen(false);
      setMobileSidebarOpen(false);
      setMessage("");

      // Re-add the guard so another Back press also stays in the app.
      window.history.pushState(
        dashboardHistoryState,
        "",
        window.location.href
      );
    };

    window.addEventListener("popstate", returnToDashboard);

    return () => {
      window.removeEventListener("popstate", returnToDashboard);
    };
  }, [currentUser]);

  const myEmployee = employees.find(
    (employee) => employee.userId === currentUser?.id
  );

  const readNoticeStorageKey = currentUser
    ? `peopledesk_notice_reads_${currentUser.id}`
    : null;
  const readNoticeIds = currentUser && !isAdmin
    ? getStoredData(readNoticeStorageKey, [])
    : [];
  const unreadNotices = currentUser && !isAdmin
    ? notices.filter((notice) => !readNoticeIds.includes(notice.id))
    : [];
  void notificationRefresh;

  function markNoticeAsRead(noticeId) {
    if (!currentUser || isAdmin) return;
    const existing = getStoredData(readNoticeStorageKey, []);
    if (!existing.includes(noticeId)) {
      saveData(readNoticeStorageKey, [...existing, noticeId]);
      setNotificationRefresh((value) => value + 1);
    }
  }

  function markAllNoticesAsRead() {
    if (!currentUser || isAdmin) return;
    saveData(readNoticeStorageKey, notices.map((notice) => notice.id));
    setNotificationRefresh((value) => value + 1);
  }

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const presentToday = attendance.filter(
    (item) => item.date === getToday() && item.status === "Present"
  ).length;

  const absentToday = attendance.filter(
    (item) => item.date === getToday() && item.status === "Absent"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const totalPayroll = payroll.reduce(
    (sum, item) => sum + Number(item.netSalary || 0),
    0
  );

  const filteredEmployees = useMemo(() => {
    const term = search.toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        (employee.name || "").toLowerCase().includes(term) ||
        (employee.id || "").toLowerCase().includes(term) ||
        (employee.department || "").toLowerCase().includes(term);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  function employeeName(id) {
    return employees.find((employee) => employee.id === id)?.name || "Unknown";
  }

  const adminMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Employees", icon: Users },
    { name: "Departments", icon: Building2 },
    {
      name: "Employee Services",
      icon: BriefcaseBusiness,
      submenu: [
        { name: "Attendance", icon: CalendarCheck },
        { name: "Leave Management", icon: CalendarDays },
        { name: "Payslips", icon: Wallet },
      ],
    },
    { name: "Reports", icon: FileBarChart },
    { name: "Notices", icon: Megaphone },
    { name: "Holidays", icon: CalendarDays },
    { name: "Settings", icon: Settings },
  ];

  const employeeMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Profile", icon: UserRound },
    {
      name: "Employee Services",
      icon: BriefcaseBusiness,
      submenu: [
        { name: "Attendance", icon: CalendarCheck },
        { name: "Leave Management", icon: CalendarDays },
        { name: "Payslips", icon: Wallet },
      ],
    },
    { name: "Notices", icon: Megaphone },
    { name: "Holidays", icon: CalendarDays },
    { name: "Settings", icon: Settings },
  ];

  const navigationMenu = isAdmin ? adminMenu : employeeMenu;

  function navigateTo(name) {
    setPage(name);
    setMobileSidebarOpen(false);
    setMessage("");

    if (["Attendance", "Leave Management", "Payslips"].includes(name)) {
      setServicesOpen(true);
    }
  }

  function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    const user = users.find(
      (item) =>
        item.username.toLowerCase() ===
          loginForm.username.trim().toLowerCase() &&
        item.password === loginForm.password
    );

    if (!user) {
      setMessage("Invalid username or password.");
      return;
    }

    setCurrentUser(user);
    setLoginForm({ username: "", password: "" });
    setPage("Dashboard");
    if (user.role === "Employee") {
      const readIds = getStoredData(`peopledesk_notice_reads_${user.id}`, []);
      const newNoticeCount = notices.filter(
        (notice) => !readIds.includes(notice.id)
      ).length;
      setShowNotifications(newNoticeCount > 0);
    } else {
      setShowNotifications(false);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setShowNotifications(false);
    setPage("Dashboard");
    setServicesOpen(false);
    setMessage("");
  }

  function saveEmployee(event) {
    event.preventDefault();

    // Employee accounts can only be created or maintained by an Admin.
    if (!isAdmin) {
      setMessage("Only administrators can manage employee accounts.");
      return;
    }

    if (!employeeForm.joiningDate || employeeForm.joiningDate > getToday()) {
      alert("Joining date cannot be in the future. Please select today or an earlier date.");
      return;
    }

    const normalizedUsername = employeeForm.username.trim().toLowerCase();
    const linkedUserId = editingEmployee?.userId;
    const usernameTaken = users.some(
      (user) =>
        user.username?.toLowerCase() === normalizedUsername &&
        user.id !== linkedUserId
    );

    if (usernameTaken) {
      alert("Username already exists. Please choose another username.");
      return;
    }

    if (
      !employeeForm.name.trim() ||
      !employeeForm.username.trim() ||
      !employeeForm.email.trim()
    ) {
      alert("Please complete all required employee details.");
      return;
    }

    if (editingEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingEmployee.id
            ? { ...employee, ...employeeForm }
            : employee
        )
      );

      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingEmployee.userId
            ? {
                ...user,
                name: employeeForm.name.trim(),
                username: employeeForm.username.trim(),
                email: employeeForm.email.trim(),
              }
            : user
        )
      );
    } else {
      const user = {
        id: generateId("USER"),
        name: employeeForm.name.trim(),
        username: employeeForm.username.trim(),
        email: employeeForm.email.trim(),
        password: "Welcome123!",
        role: "Employee",
      };

      const employee = {
        ...employeeForm,
        id: generateId("EMP"),
        userId: user.id,
      };

      setUsers((previous) => [...previous, user]);
      setEmployees((previous) => [...previous, employee]);

      alert("Employee added. Initial password: Welcome123!");
    }

    setEmployeeForm(emptyEmployeeForm);
    setEditingEmployee(null);
    setShowEmployeeForm(false);
  }

  function editEmployee(employee) {
    setEditingEmployee(employee);
    setEmployeeForm({ ...emptyEmployeeForm, ...employee });
    setShowEmployeeForm(true);
  }

  function deleteEmployee(id) {
    if (!window.confirm("Delete this employee?")) return;

    const employee = employees.find((item) => item.id === id);

    setEmployees((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (employee?.userId) {
      setUsers((previous) =>
        previous.filter((user) => user.id !== employee.userId)
      );
    }
  }

  function markAttendance(event) {
    event.preventDefault();

    const exists = attendance.some(
      (item) =>
        item.employeeId === attendanceForm.employeeId &&
        item.date === attendanceForm.date
    );

    if (exists) {
      alert("Attendance already marked for this employee on this date.");
      return;
    }

    setAttendance((previous) => [
      ...previous,
      {
        id: generateId("ATT"),
        ...attendanceForm,
      },
    ]);

    setAttendanceForm({
      employeeId: "",
      date: getToday(),
      status: "Present",
    });
  }

  function applyLeave(event) {
    event.preventDefault();

    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason.trim()) {
      alert("Please complete all leave details.");
      return;
    }

    if (leaveForm.to < leaveForm.from) {
      alert("End date cannot be before start date.");
      return;
    }

    const employeeId = isAdmin
      ? leaveForm.employeeId
      : myEmployee?.id;

    if (!employeeId) {
      alert("Employee profile not found.");
      return;
    }

    const days =
      Math.floor(
        (new Date(`${leaveForm.to}T00:00:00`) -
          new Date(`${leaveForm.from}T00:00:00`)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    setLeaves((previous) => [
      ...previous,
      {
        id: generateId("LEAVE"),
        employeeId,
        ...leaveForm,
        days,
        status: "Pending",
      },
    ]);

    setLeaveForm({
      type: "Casual Leave",
      from: "",
      to: "",
      reason: "",
      employeeId: "",
    });
  }

  function updateLeave(id, status) {
    setLeaves((previous) =>
      previous.map((leave) =>
        leave.id === id ? { ...leave, status } : leave
      )
    );
  }

  function addPayroll(event) {
    event.preventDefault();

    const basic = Number(payrollForm.basic);
    const allowances = Number(payrollForm.allowances);
    const deductions = Number(payrollForm.deductions);

    if (
      !payrollForm.employeeId ||
      !payrollForm.month ||
      !Number.isFinite(basic) ||
      !Number.isFinite(allowances) ||
      !Number.isFinite(deductions) ||
      basic < 0 ||
      allowances < 0 ||
      deductions < 0 ||
      deductions > basic + allowances
    ) {
      alert("Please enter valid salary amounts.");
      return;
    }

    const duplicate = payroll.some(
      (item) =>
        item.employeeId === payrollForm.employeeId &&
        item.month === payrollForm.month
    );

    if (duplicate) {
      alert("Payroll already exists for this employee and month.");
      return;
    }

    setPayroll((previous) => [
      ...previous,
      {
        id: generateId("PAY"),
        ...payrollForm,
        basic,
        allowances,
        deductions,
        netSalary: basic + allowances - deductions,
      },
    ]);

    setPayrollForm({
      employeeId: "",
      month: "",
      basic: "",
      allowances: "",
      deductions: "",
    });
  }
    // DEPARTMENTS

  function addDepartment(event) {
    event.preventDefault();

    const name = departmentForm.trim();

    if (!name) return;

    if (
      departments.some(
        (item) => item.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert("Department already exists.");
      return;
    }

    setDepartments((previous) => [...previous, name]);
    setDepartmentForm("");
  }

  function deleteDepartment(name) {
    if (
      employees.some((employee) => employee.department === name)
    ) {
      alert(
        "Move employees to another department before deleting this department."
      );
      return;
    }

    if (!window.confirm(`Delete ${name}?`)) return;

    setDepartments((previous) =>
      previous.filter((item) => item !== name)
    );
  }

  // NOTICES

  function addNotice(event) {
    event.preventDefault();

    if (
      !noticeForm.title.trim() ||
      !noticeForm.description.trim()
    ) {
      return;
    }

    setNotices((previous) => [
      ...previous,
      {
        id: generateId("NOTICE"),
        title: noticeForm.title.trim(),
        description: noticeForm.description.trim(),
        date: getToday(),
      },
    ]);

    setNoticeForm({ title: "", description: "" });
    alert("Notice published successfully. Employees will be notified when they log in.");
  }

  function deleteNotice(id) {
    if (!window.confirm("Delete this notice?")) return;

    setNotices((previous) =>
      previous.filter((notice) => notice.id !== id)
    );
  }

  // HOLIDAYS

  function addHoliday(event) {
    event.preventDefault();

    if (!holidayForm.name.trim() || !holidayForm.date) {
      alert("Please enter holiday name and date.");
      return;
    }

    const exists = holidays.some(
      (holiday) =>
        holiday.date === holidayForm.date &&
        holiday.name.toLowerCase() ===
          holidayForm.name.trim().toLowerCase()
    );

    if (exists) {
      alert("This holiday already exists.");
      return;
    }

    setHolidays((previous) => [
      ...previous,
      {
        id: generateId("HOL"),
        name: holidayForm.name.trim(),
        date: holidayForm.date,
      },
    ]);

    setHolidayForm({ name: "", date: "" });
  }

  function deleteHoliday(id) {
    if (!window.confirm("Delete this holiday?")) return;

    setHolidays((previous) =>
      previous.filter((holiday) => holiday.id !== id)
    );
  }

  // PASSWORD SETTINGS

  function changePassword(event) {
    event.preventDefault();

    if (currentUser.password !== passwordForm.currentPassword) {
      alert("Current password is incorrect.");
      return;
    }

    if (!validatePassword(passwordForm.newPassword)) {
      alert(
        "New password must contain at least 8 characters, uppercase, lowercase, number and special character."
      );
      return;
    }

    if (
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: passwordForm.newPassword,
    };

    setUsers((previous) =>
      previous.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      )
    );

    setCurrentUser(updatedUser);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    alert("Password updated successfully.");
  }

  // REPORT EXPORT

  function exportEmployees() {
    const headings = [
      "Employee ID",
      "Name",
      "Username",
      "Email",
      "Department",
      "Designation",
      "Joining Date",
      "Status",
    ];

    const rows = employees.map((employee) => [
      employee.id,
      employee.name,
      employee.username,
      employee.email,
      employee.department,
      employee.designation,
      employee.joiningDate,
      employee.status,
    ]);

    const csv = [headings, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "PeopleDesk-Employee-Report.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  // AUTHENTICATION UI

  if (!currentUser) {
    return (
      <div className="auth-layout">
        <section className="auth-brand-panel">
          <div className="auth-brand">
            <div className="brand-logo">
              <img
                src={peopleDeskLogo}
                alt="PeopleDesk logo"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span>P</span>
            </div>
            <span>PeopleDesk</span>
          </div>
        </section>

        <section className="auth-main">
          <div className="auth-card">
            <div className="mobile-brand">
              <div className="brand-logo">
                <img
                  src={peopleDeskLogo}
                  alt="PeopleDesk logo"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span>P</span>
              </div>
              <span>PeopleDesk</span>
            </div>

            <div className="auth-heading">
              <span className="auth-overline">WELCOME TO PEOPLEDESK</span>
              <h2>Welcome back</h2>
              <p>Sign in to access your workspace.</p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
              <label>
                Username
                <input
                  value={loginForm.username}
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,
                      username: event.target.value,
                    })
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,
                      password: event.target.value,
                    })
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </label>

              {message && <div className="auth-error">{message}</div>}

              <button className="auth-submit" type="submit">
                Sign In
                <ArrowUpRight size={19} />
              </button>
            </form>

            <div className="auth-security">
              <ShieldCheck size={16} />
              <span>PeopleDesk Workspace</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // MAIN APPLICATION LAYOUT

  return (
    <div className="app-layout">
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          mobileSidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">P</div>

          <div>
            <h2>PeopleDesk</h2>
            <span>WORKSPACE</span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {navigationMenu.map((item) => {
            const Icon = item.icon;

            if (item.submenu) {
              const active = item.submenu.some(
                (child) => child.name === page
              );

              return (
                <div className="nav-group" key={item.name}>
                  <button
                    type="button"
                    className={`nav-item ${
                      active ? "nav-active" : ""
                    }`}
                    onClick={() =>
                      setServicesOpen((previous) => !previous)
                    }
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>

                    {servicesOpen ? (
                      <ChevronDown
                        size={16}
                        className="nav-chevron"
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        className="nav-chevron"
                      />
                    )}
                  </button>

                  {servicesOpen && (
                    <div className="submenu">
                      {item.submenu.map((child) => {
                        const ChildIcon = child.icon;

                        return (
                          <button
                            type="button"
                            key={child.name}
                            className={`submenu-item ${
                              page === child.name
                                ? "submenu-active"
                                : ""
                            }`}
                            onClick={() => navigateTo(child.name)}
                          >
                            <ChildIcon size={17} />
                            <span>{child.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                type="button"
                key={item.name}
                className={`nav-item ${
                  page === item.name ? "nav-active" : ""
                }`}
                onClick={() => navigateTo(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div className="sidebar-user-info">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.role}</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="breadcrumb">
                <span>PeopleDesk</span>
                <ChevronRight size={15} />
                <strong>{page}</strong>
              </div>

              <p>Workforce Management System</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-date">
              {formatDate(getToday())}
            </div>

            <div className="notification-wrap">
              <button
                type="button"
                className="notification-button"
                title="Notifications"
                aria-label={`Notifications${!isAdmin && unreadNotices.length ? `, ${unreadNotices.length} unread` : ""}`}
                onClick={() => setShowNotifications((open) => !open)}
              >
                <Bell size={19} />
                {!isAdmin && unreadNotices.length > 0 && (
                  <span className="notification-count">{unreadNotices.length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-popover">
                  <div className="notification-popover-heading">
                    <strong>Notifications</strong>
                    {!isAdmin && unreadNotices.length > 0 && (
                      <button type="button" onClick={markAllNoticesAsRead}>Mark all as read</button>
                    )}
                  </div>
                  {isAdmin ? (
                    <p className="notification-empty">You are all caught up.</p>
                  ) : unreadNotices.length === 0 ? (
                    <p className="notification-empty">No new announcements.</p>
                  ) : (
                    unreadNotices.slice().reverse().map((notice) => (
                      <button
                        type="button"
                        className="notification-item"
                        key={notice.id}
                        onClick={() => {
                          markNoticeAsRead(notice.id);
                          setPage("Notices");
                          setShowNotifications(false);
                        }}
                      >
                        <span className="notification-item-dot" />
                        <span>
                          <strong>{notice.title}</strong>
                          <small>{notice.description}</small>
                          <small>{formatDate(notice.date)}</small>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="topbar-profile">
              <div className="user-avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{currentUser.name}</strong>
                <span>{currentUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {/* DASHBOARD */}

          {page === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">OVERVIEW</span>
                  <h1>Dashboard</h1>
                  <p>Welcome back, {currentUser.name}.</p>
                </div>

                <div className="date-badge">
                  {formatDate(getToday())}
                </div>
              </div>

              {isAdmin ? (
                <>
                  <div className="stats-grid">
                    <StatCard
                      title="Total Employees"
                      value={totalEmployees}
                      icon={<Users size={21} />}
                    />

                    <StatCard
                      title="Active Employees"
                      value={activeEmployees}
                      icon={<UserRound size={21} />}
                    />

                    <StatCard
                      title="Present Today"
                      value={presentToday}
                      icon={<CalendarCheck size={21} />}
                    />

                    <StatCard
                      title="Absent Today"
                      value={absentToday}
                      icon={<Clock size={21} />}
                    />

                    <StatCard
                      title="Pending Leaves"
                      value={pendingLeaves}
                      icon={<CalendarDays size={21} />}
                    />

                    <StatCard
                      title="Payroll Records"
                      value={payroll.length}
                      icon={<Wallet size={21} />}
                    />
                  </div>

                  <div className="dashboard-grid">
                    <section className="panel">
                      <div className="section-heading">
                        <div>
                          <h2>Recent Employees</h2>
                          <p>Recently added employees</p>
                        </div>

                        <button
                          type="button"
                          className="text-button"
                          onClick={() => navigateTo("Employees")}
                        >
                          View all →
                        </button>
                      </div>

                      <EmployeeTable
                        employees={employees.slice(-5).reverse()}
                        onEdit={editEmployee}
                        onDelete={deleteEmployee}
                        isAdmin={false}
                      />
                    </section>

                    <section className="panel">
                      <div className="section-heading">
                        <div>
                          <h2>Pending Requests</h2>
                          <p>Leave applications awaiting approval</p>
                        </div>
                      </div>

                      {leaves.filter(
                        (leave) => leave.status === "Pending"
                      ).length === 0 ? (
                        <EmptyState text="No pending requests." />
                      ) : (
                        leaves
                          .filter(
                            (leave) => leave.status === "Pending"
                          )
                          .slice(0, 5)
                          .map((leave) => (
                            <div
                              className="activity-row"
                              key={leave.id}
                            >
                              <div>
                                <strong>
                                  {employeeName(leave.employeeId)}
                                </strong>
                                <p>{leave.type}</p>
                              </div>

                              <StatusBadge status="Pending" />
                            </div>
                          ))
                      )}
                    </section>
                  </div>
                </>
              ) : (
                <>
                  <div className="stats-grid">
                    <StatCard
                      title="Present Days"
                      value={
                        attendance.filter(
                          (item) =>
                            item.employeeId === myEmployee?.id &&
                            item.status === "Present"
                        ).length
                      }
                      icon={<CalendarCheck size={21} />}
                    />

                    <StatCard
                      title="Leave Applications"
                      value={
                        leaves.filter(
                          (leave) =>
                            leave.employeeId === myEmployee?.id
                        ).length
                      }
                      icon={<CalendarDays size={21} />}
                    />

                    <StatCard
                      title="Payslips"
                      value={
                        payroll.filter(
                          (item) =>
                            item.employeeId === myEmployee?.id
                        ).length
                      }
                      icon={<Wallet size={21} />}
                    />
                  </div>

                  <section className="panel">
                    <h2>Welcome to your workspace</h2>
                    <p>
                      Use Employee Services to view attendance, apply
                      for leave and access your payslips.
                    </p>
                  </section>
                </>
              )}
            </>
          )}
                    {/* EMPLOYEES */}

          {page === "Employees" && isAdmin && (
            <section className="panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">WORKFORCE</span>
                  <h1>Employee Management</h1>
                  <p>Manage your employee records.</p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setEditingEmployee(null);
                    setEmployeeForm(emptyEmployeeForm);
                    setShowEmployeeForm(true);
                  }}
                >
                  <Plus size={18} />
                  Add Employee
                </button>
              </div>

              <div className="filter-row">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    placeholder="Search employees..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  value={departmentFilter}
                  onChange={(event) =>
                    setDepartmentFilter(event.target.value)
                  }
                >
                  <option value="All">All Departments</option>
                  {departments.map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </div>

              {showEmployeeForm && (
                <form className="form-panel" onSubmit={saveEmployee}>
                  <h2>
                    {editingEmployee ? "Edit Employee" : "Add New Employee"}
                  </h2>

                  <div className="form-grid">
                    {[
                      ["name", "Full Name", "text"],
                      ["username", "Username", "text"],
                      ["email", "Email Address", "email"],
                      ["phone", "Phone Number", "tel"],
                      ["designation", "Designation", "text"],
                      ["joiningDate", "Joining Date", "date"],
                      ["salary", "Monthly Salary", "number"],
                    ].map(([key, label, type]) => (
                      <label key={key}>
                        {label}
                        <input
                          type={type}
                          min={type === "number" ? "0" : undefined}
                          max={type === "date" ? getToday() : undefined}
                          value={employeeForm[key] ?? ""}
                          onChange={(event) =>
                            setEmployeeForm({
                              ...employeeForm,
                              [key]: event.target.value,
                            })
                          }
                          required
                        />
                      </label>
                    ))}

                    <label>
                      Department
                      <select
                        value={employeeForm.department}
                        onChange={(event) =>
                          setEmployeeForm({
                            ...employeeForm,
                            department: event.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((department) => (
                          <option key={department}>{department}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Status
                      <select
                        value={employeeForm.status}
                        onChange={(event) =>
                          setEmployeeForm({
                            ...employeeForm,
                            status: event.target.value,
                          })
                        }
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button className="primary-button" type="submit">
                      {editingEmployee ? "Update Employee" : "Save Employee"}
                    </button>

                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => {
                        setShowEmployeeForm(false);
                        setEditingEmployee(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <EmployeeTable
                employees={filteredEmployees}
                onEdit={editEmployee}
                onDelete={deleteEmployee}
                isAdmin
              />
            </section>
          )}

          {/* DEPARTMENTS */}

          {page === "Departments" && isAdmin && (
            <section className="panel">
              <span className="eyebrow">ORGANIZATION</span>
              <h1>Departments</h1>
              <p>Manage organization departments.</p>

              <form className="inline-form" onSubmit={addDepartment}>
                <input
                  placeholder="Enter department name"
                  value={departmentForm}
                  onChange={(event) =>
                    setDepartmentForm(event.target.value)
                  }
                  required
                />

                <button className="primary-button" type="submit">
                  <Plus size={18} />
                  Add Department
                </button>
              </form>

              <div className="department-grid">
                {departments.map((department) => (
                  <div className="department-card" key={department}>
                    <div className="stat-icon">
                      <Building2 size={22} />
                    </div>

                    <h3>{department}</h3>

                    <p>
                      {
                        employees.filter(
                          (employee) => employee.department === department
                        ).length
                      }{" "}
                      Employees
                    </p>

                    <button
                      type="button"
                      className="delete-action"
                      onClick={() => deleteDepartment(department)}
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ATTENDANCE */}

          {page === "Attendance" && (
            <section className="panel">
              <span className="eyebrow">EMPLOYEE SERVICES</span>
              <h1>Attendance Management</h1>
              <p>Track daily employee attendance.</p>

              {isAdmin && (
                <form className="inline-form" onSubmit={markAttendance}>
                  <select
                    value={attendanceForm.employeeId}
                    onChange={(event) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        employeeId: event.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={(event) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        date: event.target.value,
                      })
                    }
                    required
                  />

                  <select
                    value={attendanceForm.status}
                    onChange={(event) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Leave</option>
                  </select>

                  <button className="primary-button" type="submit">
                    Mark Attendance
                  </button>
                </form>
              )}

              <AttendanceTable
                records={
                  isAdmin
                    ? attendance
                    : attendance.filter(
                        (item) => item.employeeId === myEmployee?.id
                      )
                }
                employees={employees}
              />
            </section>
          )}

          {/* LEAVE MANAGEMENT */}

          {page === "Leave Management" && (
            <section className="panel">
              <span className="eyebrow">EMPLOYEE SERVICES</span>
              <h1>Leave Management</h1>
              <p>Apply for leave and manage leave requests.</p>

              <form className="form-panel" onSubmit={applyLeave}>
                <h2>Apply for Leave</h2>

                {isAdmin && (
                  <label>
                    Employee
                    <select
                      value={leaveForm.employeeId}
                      onChange={(event) =>
                        setLeaveForm({
                          ...leaveForm,
                          employeeId: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label>
                  Leave Type
                  <select
                    value={leaveForm.type}
                    onChange={(event) =>
                      setLeaveForm({
                        ...leaveForm,
                        type: event.target.value,
                      })
                    }
                  >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Earned Leave</option>
                    <option>Personal Leave</option>
                  </select>
                </label>

                <div className="form-grid">
                  <label>
                    From Date
                    <input
                      type="date"
                      value={leaveForm.from}
                      onChange={(event) =>
                        setLeaveForm({
                          ...leaveForm,
                          from: event.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    To Date
                    <input
                      type="date"
                      min={leaveForm.from || undefined}
                      value={leaveForm.to}
                      onChange={(event) =>
                        setLeaveForm({
                          ...leaveForm,
                          to: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                </div>

                <label>
                  Reason
                  <textarea
                    value={leaveForm.reason}
                    onChange={(event) =>
                      setLeaveForm({
                        ...leaveForm,
                        reason: event.target.value,
                      })
                    }
                    placeholder="Enter reason for leave"
                    required
                  />
                </label>

                <button className="primary-button" type="submit">
                  Submit Leave Application
                </button>
              </form>

              <LeaveTable
                leaves={
                  isAdmin
                    ? leaves
                    : leaves.filter(
                        (leave) => leave.employeeId === myEmployee?.id
                      )
                }
                employees={employees}
                isAdmin={isAdmin}
                onUpdate={updateLeave}
              />
            </section>
          )}

          {/* PAYSLIPS */}

          {page === "Payslips" && (
            <section className="panel">
              <span className="eyebrow">EMPLOYEE SERVICES</span>
              <h1>{isAdmin ? "Payroll Management" : "My Payslips"}</h1>
              <p>Manage and view salary records.</p>

              {isAdmin && (
                <form className="form-panel" onSubmit={addPayroll}>
                  <h2>Generate Payroll</h2>

                  <label>
                    Employee
                    <select
                      value={payrollForm.employeeId}
                      onChange={(event) =>
                        setPayrollForm({
                          ...payrollForm,
                          employeeId: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Payroll Month
                    <input
                      type="month"
                      value={payrollForm.month}
                      onChange={(event) =>
                        setPayrollForm({
                          ...payrollForm,
                          month: event.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <div className="form-grid">
                    {[
                      ["basic", "Basic Salary"],
                      ["allowances", "Allowances"],
                      ["deductions", "Deductions"],
                    ].map(([key, label]) => (
                      <label key={key}>
                        {label}
                        <input
                          type="number"
                          min="0"
                          value={payrollForm[key]}
                          onChange={(event) =>
                            setPayrollForm({
                              ...payrollForm,
                              [key]: event.target.value,
                            })
                          }
                          required
                        />
                      </label>
                    ))}
                  </div>

                  <button className="primary-button" type="submit">
                    Save Payroll Record
                  </button>
                </form>
              )}

              <PayslipTable
                payroll={
                  isAdmin
                    ? payroll
                    : payroll.filter(
                        (item) => item.employeeId === myEmployee?.id
                      )
                }
                employees={employees}
              />
            </section>
          )}

          {/* MY PROFILE */}

          {page === "My Profile" && !isAdmin && (
            <section className="panel">
              <span className="eyebrow">PERSONAL INFORMATION</span>
              <h1>My Profile</h1>
              <p>View your employee information.</p>

              <div className="profile-card">
                <div className="profile-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{currentUser.name}</h2>
                  <p>{currentUser.role}</p>
                </div>
              </div>

              {myEmployee ? (
                <div className="profile-details">
                  {[
                    ["Employee ID", myEmployee.id],
                    ["Full Name", myEmployee.name],
                    ["Username", myEmployee.username],
                    ["Email", myEmployee.email],
                    ["Phone", myEmployee.phone],
                    ["Department", myEmployee.department],
                    ["Designation", myEmployee.designation],
                    ["Joining Date", formatDate(myEmployee.joiningDate)],
                    ["Status", myEmployee.status],
                  ].map(([label, value]) => (
                    <div className="profile-detail" key={label}>
                      <span>{label}</span>
                      <strong>{value || "—"}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Employee profile not found." />
              )}
            </section>
          )}

          {/* REPORTS */}

          {page === "Reports" && isAdmin && (
            <section className="panel">
              <span className="eyebrow">ANALYTICS</span>
              <h1>Reports</h1>
              <p>Review organization information and export records.</p>

              <div className="stats-grid">
                <StatCard
                  title="Total Employees"
                  value={totalEmployees}
                  icon={<Users size={21} />}
                />

                <StatCard
                  title="Departments"
                  value={departments.length}
                  icon={<Building2 size={21} />}
                />

                <StatCard
                  title="Attendance Records"
                  value={attendance.length}
                  icon={<CalendarCheck size={21} />}
                />

                <StatCard
                  title="Total Payroll"
                  value={formatCurrency(totalPayroll)}
                  icon={<IndianRupee size={21} />}
                />
              </div>

              <div className="report-card">
                <div>
                  <h2>Employee Report</h2>
                  <p>Download employee information as a CSV file.</p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={exportEmployees}
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>
            </section>
          )}

          {/* NOTICES */}

          {page === "Notices" && (
            <section className="panel">
              <span className="eyebrow">ANNOUNCEMENTS</span>
              <h1>Notices</h1>
              <p>Organization announcements and updates.</p>

              {isAdmin && (
                <form className="form-panel" onSubmit={addNotice}>
                  <h2>Publish Notice</h2>

                  <label>
                    Notice Title
                    <input
                      value={noticeForm.title}
                      onChange={(event) =>
                        setNoticeForm({
                          ...noticeForm,
                          title: event.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      value={noticeForm.description}
                      onChange={(event) =>
                        setNoticeForm({
                          ...noticeForm,
                          description: event.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <button className="primary-button" type="submit">
                    Publish Notice
                  </button>
                </form>
              )}

              <div className="notice-list">
                {notices.length === 0 ? (
                  <EmptyState text="No notices published." />
                ) : (
                  [...notices].reverse().map((notice) => (
                    <article className="notice-card" key={notice.id}>
                      <div className="notice-icon">
                        <Megaphone size={21} />
                      </div>

                      <div className="notice-content">
                        <h3>{notice.title}</h3>
                        <p>{notice.description}</p>
                        <small>{formatDate(notice.date)}</small>
                      </div>

                      {isAdmin && (
                        <button
                          type="button"
                          className="delete-action"
                          onClick={() => deleteNotice(notice.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          )}

          {/* HOLIDAYS */}

          {page === "Holidays" && (
            <section className="panel">
              <span className="eyebrow">CALENDAR</span>
              <h1>Holiday Calendar</h1>
              <p>View organization holidays.</p>

              {isAdmin && (
                <form className="inline-form" onSubmit={addHoliday}>
                  <input
                    placeholder="Holiday name"
                    value={holidayForm.name}
                    onChange={(event) =>
                      setHolidayForm({
                        ...holidayForm,
                        name: event.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="date"
                    value={holidayForm.date}
                    onChange={(event) =>
                      setHolidayForm({
                        ...holidayForm,
                        date: event.target.value,
                      })
                    }
                    required
                  />

                  <button className="primary-button" type="submit">
                    <Plus size={18} />
                    Add Holiday
                  </button>
                </form>
              )}

              <div className="holiday-list">
                {holidays.length === 0 ? (
                  <EmptyState text="No holidays added yet." />
                ) : (
                  [...holidays]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((holiday) => (
                      <div className="holiday-card" key={holiday.id}>
                        <div className="holiday-date">
                          <CalendarDays size={22} />
                          <strong>{formatDate(holiday.date)}</strong>
                        </div>

                        <h3>{holiday.name}</h3>

                        {isAdmin && (
                          <button
                            type="button"
                            className="delete-action"
                            onClick={() => deleteHoliday(holiday.id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    ))
                )}
              </div>
            </section>
          )}

          {/* SETTINGS */}

          {page === "Settings" && (
            <section className="panel">
              <span className="eyebrow">ACCOUNT</span>
              <h1>Settings</h1>
              <p>Manage your account settings.</p>

              <div className="settings-card">
                <h2>Account Information</h2>

                <div className="profile-details">
                  <div className="profile-detail">
                    <span>Name</span>
                    <strong>{currentUser.name}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>Username</span>
                    <strong>{currentUser.username}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>Email</span>
                    <strong>{currentUser.email || "—"}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>Role</span>
                    <strong>{currentUser.role}</strong>
                  </div>
                </div>
              </div>

              <form className="form-panel" onSubmit={changePassword}>
                <h2>Change Password</h2>

                <label>
                  Current Password
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  New Password
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Confirm New Password
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <small className="password-hint">
                  Use at least 8 characters, including uppercase,
                  lowercase, number and special character.
                </small>

                <button className="primary-button" type="submit">
                  Update Password
                </button>
              </form>
            </section>
          )}
        </div>

        <footer className="app-footer">
          © {new Date().getFullYear()} PeopleDesk. All rights reserved.
        </footer>
      </main>
    </div>
  );
}