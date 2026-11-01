import { useState } from 'react';
import './App.css';

function Payslip({ isAdmin, loggedInUser, employees }) {
  const [payslips, setPayslips] = useState(() => {
    return JSON.parse(localStorage.getItem('payslips')) || [];
  });

  const [showForm, setShowForm] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState('');

  const [salaryData, setSalaryData] = useState({
    month: '',
    basicSalary: '',
    allowances: '',
    deductions: ''
  });

  const savePayslips = (updatedPayslips) => {
    localStorage.setItem('payslips', JSON.stringify(updatedPayslips));
    setPayslips(updatedPayslips);
  };

  const handleGenerate = (e) => {
    e.preventDefault();

    const employee = employees.find(
      item => item.id === selectedEmployee
    );

    if (!employee) {
      alert('Please select an employee.');
      return;
    }

    const basic = Number(salaryData.basicSalary);
    const allowances = Number(salaryData.allowances);
    const deductions = Number(salaryData.deductions);

    if (basic <= 0 || allowances < 0 || deductions < 0) {
      alert('Please enter valid salary values.');
      return;
    }

    if (deductions > basic + allowances) {
      alert('Deductions cannot exceed total earnings.');
      return;
    }

    const duplicate = payslips.some(
      item =>
        item.employeeId === employee.id &&
        item.month === salaryData.month
    );

    if (duplicate) {
      alert('A payslip already exists for this employee and month.');
      return;
    }

    const newPayslip = {
      id: `PAY-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      jobRole: employee.jobRole,
      month: salaryData.month,
      basicSalary: basic,
      allowances,
      deductions,
      netSalary: basic + allowances - deductions,
      generatedOn: new Date().toISOString().split('T')[0]
    };

    savePayslips([...payslips, newPayslip]);

    setSalaryData({
      month: '',
      basicSalary: '',
      allowances: '',
      deductions: ''
    });

    setSelectedEmployee('');
    setShowForm(false);

    alert('Payslip generated successfully!');
  };

  const deletePayslip = (id) => {
    if (!window.confirm('Are you sure you want to delete this payslip?')) {
      return;
    }

    savePayslips(
      payslips.filter(item => item.id !== id)
    );
  };

  const employeePayslips = payslips.filter(
    item =>
      item.employeeName.trim().toLowerCase() ===
      loggedInUser?.name?.trim().toLowerCase()
  );

  const formatMoney = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN')}`;

  const displayedPayslips = isAdmin
    ? payslips
    : employeePayslips;

  return (
    <div>
      <div className="page-heading employee-heading">
        <div>
          <h1>
            {isAdmin ? 'Payslip Management' : 'My Payslips'}
          </h1>

          <p>
            {isAdmin
              ? 'Generate and manage employee salary statements.'
              : 'View your monthly salary statements.'}
          </p>
        </div>

        {isAdmin && (
          <button
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : '+ Generate Payslip'}
          </button>
        )}
      </div>

      <div className="employee-summary">
        <div>
          <span>Total Payslips</span>
          <h2>{displayedPayslips.length}</h2>
        </div>

        <div>
          <span>Total Net Salary</span>
          <h2>
            {formatMoney(
              displayedPayslips.reduce(
                (total, item) => total + item.netSalary,
                0
              )
            )}
          </h2>
        </div>

        <div>
          <span>Basic Salary</span>
          <h2>
            {formatMoney(
              displayedPayslips.reduce(
                (total, item) => total + item.basicSalary,
                0
              )
            )}
          </h2>
        </div>
      </div>

      {isAdmin && showForm && (
        <div className="employee-form-card">
          <h2>Generate New Payslip</h2>

          <form onSubmit={handleGenerate}>
            <div className="employee-form-grid">

              <div className="input-group">
                <label>Select Employee</label>

                <select
                  value={selectedEmployee}
                  onChange={e => setSelectedEmployee(e.target.value)}
                  required
                >
                  <option value="">Choose Employee</option>

                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.id} - {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Salary Month</label>

                <input
                  type="month"
                  value={salaryData.month}
                  onChange={e =>
                    setSalaryData({
                      ...salaryData,
                      month: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Basic Salary (₹)</label>

                <input
                  type="number"
                  min="1"
                  value={salaryData.basicSalary}
                  onChange={e =>
                    setSalaryData({
                      ...salaryData,
                      basicSalary: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Allowances (₹)</label>

                <input
                  type="number"
                  min="0"
                  value={salaryData.allowances}
                  onChange={e =>
                    setSalaryData({
                      ...salaryData,
                      allowances: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Deductions (₹)</label>

                <input
                  type="number"
                  min="0"
                  value={salaryData.deductions}
                  onChange={e =>
                    setSalaryData({
                      ...salaryData,
                      deductions: e.target.value
                    })
                  }
                  required
                />
              </div>

            </div>

            <div className="welcome-panel">
              <strong>Net Salary Preview</strong>

              <h2>
                {formatMoney(
                  Number(salaryData.basicSalary || 0) +
                  Number(salaryData.allowances || 0) -
                  Number(salaryData.deductions || 0)
                )}
              </h2>

              <p>
                Net Salary = Basic Salary + Allowances - Deductions
              </p>
            </div>

            <div className="form-actions">
              <button type="submit" className="add-button">
                Generate Payslip
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="employee-table-card">
        <div className="table-header">
          <h2>
            {isAdmin ? 'Generated Payslips' : 'My Salary Statements'}
          </h2>
        </div>

        <div className="table-scroll">
          <table className="employee-table">
            <thead>
              <tr>
                {isAdmin && <th>Employee ID</th>}
                {isAdmin && <th>Employee Name</th>}
                <th>Month</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedPayslips.map(item => (
                <tr key={item.id}>
                  {isAdmin && <td>{item.employeeId}</td>}
                  {isAdmin && <td>{item.employeeName}</td>}
                  <td>{item.month}</td>
                  <td>{formatMoney(item.basicSalary)}</td>
                  <td>{formatMoney(item.allowances)}</td>
                  <td>{formatMoney(item.deductions)}</td>
                  <td>
                    <strong>{formatMoney(item.netSalary)}</strong>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => window.print()}
                      >
                        Print
                      </button>

                      {isAdmin && (
                        <button
                          className="delete-button"
                          onClick={() => deletePayslip(item.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {displayedPayslips.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 6}
                    className="empty-row"
                  >
                    No payslips available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payslip;