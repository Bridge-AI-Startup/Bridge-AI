const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const Company = require('../models/Company');

// Middleware to check if we're in development mode
const devOnly = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin console is only available in development mode'
    });
  }
};

/**
 * @desc    Get admin console HTML
 * @route   GET /api/admin/console
 * @access  Development only
 */
router.get('/console', devOnly, (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bridge AI - Dev Console</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      color: #60a5fa;
      margin-bottom: 10px;
      font-size: 28px;
    }
    .warning {
      background: #7c2d12;
      border: 2px solid #ea580c;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      color: #fed7aa;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #1e293b;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .stat-card h3 {
      color: #94a3b8;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .stat-card .number {
      font-size: 32px;
      font-weight: bold;
      color: #60a5fa;
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .action-card {
      background: #1e293b;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .action-card h3 {
      color: #e2e8f0;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .action-card p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 15px;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    button:hover {
      background: #2563eb;
    }
    button.danger {
      background: #dc2626;
    }
    button.danger:hover {
      background: #b91c1c;
    }
    button:disabled {
      background: #475569;
      cursor: not-allowed;
    }
    .data-section {
      margin-top: 30px;
    }
    .data-section h2 {
      color: #60a5fa;
      margin-bottom: 15px;
      font-size: 20px;
    }
    .table-container {
      background: #1e293b;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      border: 1px solid #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #334155;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      color: #94a3b8;
    }
    td {
      padding: 12px;
      border-top: 1px solid #334155;
      font-size: 14px;
    }
    tr:hover {
      background: #293548;
    }
    .delete-btn {
      background: #dc2626;
      padding: 6px 12px;
      font-size: 12px;
    }
    .delete-btn:hover {
      background: #b91c1c;
    }
    .empty-state {
      padding: 40px;
      text-align: center;
      color: #64748b;
    }
    .refresh-btn {
      background: #10b981;
      margin-bottom: 20px;
    }
    .refresh-btn:hover {
      background: #059669;
    }
    .loading {
      text-align: center;
      padding: 20px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛠️ Bridge AI - Development Console</h1>
    <div class="warning">
      ⚠️ <strong>Development Only:</strong> This console is only available in development mode and should never be exposed in production.
    </div>

    <div class="stats" id="stats">
      <div class="stat-card">
        <h3>Students</h3>
        <div class="number" id="userCount">-</div>
      </div>
      <div class="stat-card">
        <h3>Employers</h3>
        <div class="number" id="employerCount">-</div>
      </div>
      <div class="stat-card">
        <h3>Companies</h3>
        <div class="number" id="companyCount">-</div>
      </div>
      <div class="stat-card">
        <h3>Total Entries</h3>
        <div class="number" id="totalCount">-</div>
      </div>
    </div>

    <div class="actions">
      <div class="action-card">
        <h3>Clear All Auth Data</h3>
        <p>Remove all users, employers, and companies</p>
        <button class="danger" onclick="clearAuthData()">Clear Auth Data</button>
      </div>
      <div class="action-card">
        <h3>Clear All Users</h3>
        <p>Remove all student accounts</p>
        <button class="danger" onclick="clearCollection('users')">Clear Students</button>
      </div>
      <div class="action-card">
        <h3>Clear All Employers</h3>
        <p>Remove all employer accounts</p>
        <button class="danger" onclick="clearCollection('employers')">Clear Employers</button>
      </div>
      <div class="action-card">
        <h3>Clear All Companies</h3>
        <p>Remove all company records</p>
        <button class="danger" onclick="clearCollection('companies')">Clear Companies</button>
      </div>
    </div>

    <button class="refresh-btn" onclick="loadData()">🔄 Refresh Data</button>

    <div class="data-section">
      <h2>Students</h2>
      <div class="table-container">
        <div id="usersLoading" class="loading">Loading...</div>
        <div id="usersTable"></div>
      </div>

      <h2>Employers</h2>
      <div class="table-container">
        <div id="employersLoading" class="loading">Loading...</div>
        <div id="employersTable"></div>
      </div>

      <h2>Companies</h2>
      <div class="table-container">
        <div id="companiesLoading" class="loading">Loading...</div>
        <div id="companiesTable"></div>
      </div>
    </div>
  </div>

  <script>
    async function loadData() {
      loadStats();
      loadUsers();
      loadEmployers();
      loadCompanies();
    }

    async function loadStats() {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (data.success) {
        document.getElementById('userCount').textContent = data.data.users;
        document.getElementById('employerCount').textContent = data.data.employers;
        document.getElementById('companyCount').textContent = data.data.companies;
        document.getElementById('totalCount').textContent = data.data.total;
      }
    }

    async function loadUsers() {
      document.getElementById('usersLoading').style.display = 'block';
      document.getElementById('usersTable').innerHTML = '';

      const response = await fetch('/api/admin/users');
      const data = await response.json();

      document.getElementById('usersLoading').style.display = 'none';

      if (data.success && data.data.length > 0) {
        const table = \`
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>University</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${data.data.map(user => \`
                <tr>
                  <td>\${user.name || '-'}</td>
                  <td>\${user.email}</td>
                  <td>\${user.university || '-'}</td>
                  <td>\${new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button class="delete-btn" onclick="deleteUser('\${user._id}')">Delete</button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        \`;
        document.getElementById('usersTable').innerHTML = table;
      } else {
        document.getElementById('usersTable').innerHTML = '<div class="empty-state">No students found</div>';
      }
    }

    async function loadEmployers() {
      document.getElementById('employersLoading').style.display = 'block';
      document.getElementById('employersTable').innerHTML = '';

      const response = await fetch('/api/admin/employers');
      const data = await response.json();

      document.getElementById('employersLoading').style.display = 'none';

      if (data.success && data.data.length > 0) {
        const table = \`
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${data.data.map(emp => \`
                <tr>
                  <td>\${emp.firstName} \${emp.lastName}</td>
                  <td>\${emp.email}</td>
                  <td>\${emp.companyId?.companyName || '-'}</td>
                  <td>\${emp.companyRole}</td>
                  <td>\${new Date(emp.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button class="delete-btn" onclick="deleteEmployer('\${emp._id}')">Delete</button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        \`;
        document.getElementById('employersTable').innerHTML = table;
      } else {
        document.getElementById('employersTable').innerHTML = '<div class="empty-state">No employers found</div>';
      }
    }

    async function loadCompanies() {
      document.getElementById('companiesLoading').style.display = 'block';
      document.getElementById('companiesTable').innerHTML = '';

      const response = await fetch('/api/admin/companies');
      const data = await response.json();

      document.getElementById('companiesLoading').style.display = 'none';

      if (data.success && data.data.length > 0) {
        const table = \`
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Website</th>
                <th>Industry</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${data.data.map(company => \`
                <tr>
                  <td>\${company.companyName}</td>
                  <td>\${company.companyWebsite || '-'}</td>
                  <td>\${company.industry || '-'}</td>
                  <td>\${new Date(company.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button class="delete-btn" onclick="deleteCompany('\${company._id}')">Delete</button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        \`;
        document.getElementById('companiesTable').innerHTML = table;
      } else {
        document.getElementById('companiesTable').innerHTML = '<div class="empty-state">No companies found</div>';
      }
    }

    async function clearAuthData() {
      if (!confirm('Are you sure you want to clear ALL auth data (users, employers, companies)? This cannot be undone.')) {
        return;
      }

      const response = await fetch('/api/admin/clear/auth', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        alert(\`Cleared: \${data.data.usersDeleted} users, \${data.data.employersDeleted} employers, \${data.data.companiesDeleted} companies\`);
        loadData();
      } else {
        alert('Error: ' + data.message);
      }
    }

    async function clearCollection(type) {
      if (!confirm(\`Are you sure you want to clear all \${type}? This cannot be undone.\`)) {
        return;
      }

      const response = await fetch(\`/api/admin/clear/\${type}\`, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        alert(\`Deleted \${data.data.deletedCount} \${type}\`);
        loadData();
      } else {
        alert('Error: ' + data.message);
      }
    }

    async function deleteUser(id) {
      if (!confirm('Are you sure you want to delete this user?')) {
        return;
      }

      const response = await fetch(\`/api/admin/users/\${id}\`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        loadData();
      } else {
        alert('Error: ' + data.message);
      }
    }

    async function deleteEmployer(id) {
      if (!confirm('Are you sure you want to delete this employer?')) {
        return;
      }

      const response = await fetch(\`/api/admin/employers/\${id}\`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        loadData();
      } else {
        alert('Error: ' + data.message);
      }
    }

    async function deleteCompany(id) {
      if (!confirm('Are you sure you want to delete this company?')) {
        return;
      }

      const response = await fetch(\`/api/admin/companies/\${id}\`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        loadData();
      } else {
        alert('Error: ' + data.message);
      }
    }

    // Load data on page load
    loadData();
  </script>
</body>
</html>
  `;

  res.send(html);
});

/**
 * @desc    Get database statistics
 * @route   GET /api/admin/stats
 * @access  Development only
 */
router.get('/stats', devOnly, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const employerCount = await TeamMember.countDocuments();
    const companyCount = await Company.countDocuments();

    res.json({
      success: true,
      data: {
        users: userCount,
        employers: employerCount,
        companies: companyCount,
        total: userCount + employerCount + companyCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Development only
 */
router.get('/users', devOnly, async (req, res) => {
  try {
    const users = await User.find().select('-__v').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Get all employers
 * @route   GET /api/admin/employers
 * @access  Development only
 */
router.get('/employers', devOnly, async (req, res) => {
  try {
    const employers = await TeamMember.find()
      .populate('companyId', 'companyName')
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Get all companies
 * @route   GET /api/admin/companies
 * @access  Development only
 */
router.get('/companies', devOnly, async (req, res) => {
  try {
    const companies = await Company.find().select('-__v').sort({ createdAt: -1 });
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Delete a specific user
 * @route   DELETE /api/admin/users/:id
 * @access  Development only
 */
router.delete('/users/:id', devOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Delete a specific employer
 * @route   DELETE /api/admin/employers/:id
 * @access  Development only
 */
router.delete('/employers/:id', devOnly, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Delete a specific company
 * @route   DELETE /api/admin/companies/:id
 * @access  Development only
 */
router.delete('/companies/:id', devOnly, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Clear all auth data
 * @route   POST /api/admin/clear/auth
 * @access  Development only
 */
router.post('/clear/auth', devOnly, async (req, res) => {
  try {
    const usersResult = await User.deleteMany({});
    const employersResult = await TeamMember.deleteMany({});
    const companiesResult = await Company.deleteMany({});

    res.json({
      success: true,
      data: {
        usersDeleted: usersResult.deletedCount,
        employersDeleted: employersResult.deletedCount,
        companiesDeleted: companiesResult.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Clear specific collection
 * @route   POST /api/admin/clear/:type
 * @access  Development only
 */
router.post('/clear/:type', devOnly, async (req, res) => {
  try {
    let result;

    switch (req.params.type) {
      case 'users':
        result = await User.deleteMany({});
        break;
      case 'employers':
        result = await TeamMember.deleteMany({});
        break;
      case 'companies':
        result = await Company.deleteMany({});
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    res.json({ success: true, data: { deletedCount: result.deletedCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
