import './App.css';

function MyDetails({ loggedInUser, employees }) {

  // Find the employee record of the logged-in user
  const employee = employees.find(
    item =>
      item.name?.trim().toLowerCase() ===
      loggedInUser?.name?.trim().toLowerCase()
  );

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const profileDetails = [
    {
      label: 'Employee ID',
      value: employee?.id || 'Not Assigned'
    },
    {
      label: 'Full Name',
      value: employee?.name || loggedInUser?.name || 'Not Available'
    },
    {
      label: 'Email Address',
      value: employee?.email || loggedInUser?.email || 'Not Available'
    },
    {
      label: 'Phone Number',
      value: employee?.phone || 'Not Available'
    },
    {
      label: 'Department',
      value: employee?.department || 'Not Assigned'
    },
    {
      label: 'Job Role',
      value: employee?.jobRole || 'Not Assigned'
    },
    {
      label: 'Joining Date',
      value: employee?.joiningDate || 'Not Available'
    },
    {
      label: 'Employment Status',
      value: employee?.status || 'Not Available'
    }
  ];

  return (
    <div className="my-details-page">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <h1>My Details</h1>
          <p>View your personal and professional information.</p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {(employee?.name || loggedInUser?.name || 'U')
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-header-info">
            <h2>{employee?.name || loggedInUser?.name}</h2>

            <p>
              {employee?.jobRole || 'Employee'}
            </p>

            <span className="profile-status">
              {employee?.status || 'Account Active'}
            </span>
          </div>

        </div>

        <div className="profile-divider"></div>

        {/* PERSONAL AND PROFESSIONAL DETAILS */}
        <h3>Personal & Professional Information</h3>

        <div className="profile-details-grid">

          {profileDetails.map((detail, index) => (
            <div className="profile-detail-item" key={index}>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}

        </div>

      </div>

      {/* SALARY CARD */}
      <div className="profile-salary-card">

        <div>
          <span>Monthly Salary</span>

          <h2>
            {employee
              ? formatMoney(employee.salary)
              : 'Not Available'}
          </h2>
        </div>

        <div className="salary-icon">
          ₹
        </div>

      </div>

      {!employee && (
        <div className="profile-notice">
          Your login account is active, but an employee record
          has not been linked to your account yet. Please contact
          the administrator to link your employee details.
        </div>
      )}

    </div>
  );
}

export default MyDetails;