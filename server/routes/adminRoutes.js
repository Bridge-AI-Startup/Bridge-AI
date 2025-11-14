const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const Company = require('../models/Company');
const JobListing = require('../models/JobListing');

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
 * @desc    Get full database table view
 * @route   GET /api/admin/table
 * @access  Development only
 */
router.get('/table', devOnly, (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bridge AI - Full Database Table</title>
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
      font-size: 12px;
    }
    .container {
      max-width: 100%;
      margin: 0 auto;
      overflow-x: auto;
    }
    h1 {
      color: #60a5fa;
      margin-bottom: 10px;
      font-size: 24px;
    }
    .warning {
      background: #7c2d12;
      border: 2px solid #ea580c;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      color: #fed7aa;
      font-size: 14px;
    }
    .controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s;
    }
    button:hover {
      background: #2563eb;
    }
    .table-container {
      background: #1e293b;
      border-radius: 8px;
      overflow: auto;
      margin-bottom: 20px;
      border: 1px solid #334155;
      max-height: 80vh;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 2000px;
    }
    th {
      background: #334155;
      padding: 10px 8px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      color: #94a3b8;
      position: sticky;
      top: 0;
      z-index: 10;
      white-space: nowrap;
    }
    td {
      padding: 10px 8px;
      border-top: 1px solid #334155;
      font-size: 11px;
      vertical-align: top;
    }
    tr:hover {
      background: #293548;
    }
    .json-cell {
      max-width: 200px;
      overflow: auto;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      background: #0f172a;
      padding: 4px;
      border-radius: 4px;
    }
    .array-cell {
      font-size: 10px;
      color: #a5b4fc;
    }
    .link {
      color: #60a5fa;
      text-decoration: none;
    }
    .link:hover {
      text-decoration: underline;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      margin: 2px;
    }
    .badge-true {
      background: #065f46;
      color: #6ee7b7;
    }
    .badge-false {
      background: #7c2d12;
      color: #fca5a5;
    }
    .badge-pending {
      background: #78350f;
      color: #fcd34d;
    }
    .empty {
      color: #64748b;
      font-style: italic;
    }
    .section-title {
      color: #60a5fa;
      font-size: 18px;
      margin: 30px 0 15px 0;
      font-weight: 600;
    }
    .loading {
      text-align: center;
      padding: 40px;
      font-size: 16px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🗄️ Bridge AI - Full Database Table View</h1>
    <div class="warning">
      ⚠️ <strong>Development Only:</strong> Complete database view with all fields. Do not expose in production.
    </div>

    <div class="controls">
      <button onclick="loadAllData()">🔄 Refresh All</button>
      <button onclick="exportToJSON()">📥 Export JSON</button>
      <span id="lastUpdated" style="color: #64748b; margin-left: auto;"></span>
    </div>

    <h2 class="section-title">Students (Users)</h2>
    <div class="table-container">
      <div id="usersLoading" class="loading">Loading students...</div>
      <div id="usersTable"></div>
    </div>

    <h2 class="section-title">Employers (Team Members)</h2>
    <div class="table-container">
      <div id="employersLoading" class="loading">Loading employers...</div>
      <div id="employersTable"></div>
    </div>

    <h2 class="section-title">Companies</h2>
    <div class="table-container">
      <div id="companiesLoading" class="loading">Loading companies...</div>
      <div id="companiesTable"></div>
    </div>

    <h2 class="section-title">Job Listings</h2>
    <div class="table-container">
      <div id="jobListingsLoading" class="loading">Loading job listings...</div>
      <div id="jobListingsTable"></div>
    </div>
  </div>

  <script>
    let allData = { users: [], employers: [], companies: [], jobListings: [] };

    function formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function formatJSON(obj) {
      if (!obj) return '<span class="empty">null</span>';
      return '<div class="json-cell">' + JSON.stringify(obj, null, 2) + '</div>';
    }

    function formatArray(arr) {
      if (!arr || arr.length === 0) return '<span class="empty">[]</span>';
      return '<div class="array-cell">[' + arr.join(', ') + ']</div>';
    }

    function formatBoolean(value) {
      if (value === null || value === undefined) return '<span class="empty">-</span>';
      return '<span class="badge badge-' + value + '">' + (value ? 'Yes' : 'No') + '</span>';
    }

    function formatLink(url, text) {
      if (!url) return '<span class="empty">-</span>';
      return '<a href="' + url + '" target="_blank" class="link">' + (text || url) + '</a>';
    }

    async function loadUsers() {
      document.getElementById('usersLoading').style.display = 'block';
      document.getElementById('usersTable').innerHTML = '';

      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();

        document.getElementById('usersLoading').style.display = 'none';

        if (data.success && data.data.length > 0) {
          allData.users = data.data;

          let html = '<table><thead><tr>';
          html += '<th>ID</th>';
          html += '<th>UID</th>';
          html += '<th>Name</th>';
          html += '<th>Email</th>';
          html += '<th>Auth Provider</th>';
          html += '<th>University</th>';
          html += '<th>LinkedIn</th>';
          html += '<th>GitHub</th>';
          html += '<th>Resume</th>';
          html += '<th>Projects</th>';
          html += '<th>Company Stage</th>';
          html += '<th>Industries</th>';
          html += '<th>Work Style</th>';
          html += '<th>Needs Visa</th>';
          html += '<th>Email Verified</th>';
          html += '<th>Active</th>';
          html += '<th>Created</th>';
          html += '<th>Updated</th>';
          html += '<th>Last Login</th>';
          html += '</tr></thead><tbody>';

          data.data.forEach(user => {
            html += '<tr>';
            html += '<td><code>' + (user._id || '-') + '</code></td>';
            html += '<td><code>' + (user.uid || '-') + '</code></td>';
            html += '<td>' + (user.name || '-') + '</td>';
            html += '<td>' + (user.email || '-') + '</td>';
            html += '<td>' + (user.authProvider || '-') + '</td>';
            html += '<td>' + (user.university || '-') + '</td>';
            html += '<td>' + formatLink(user.linkedinUrl, 'View') + '</td>';
            html += '<td>' + formatLink(user.githubUrl, 'View') + '</td>';
            html += '<td>' + (user.resume && user.resume.fileUrl ? formatLink(user.resume.fileUrl, user.resume.fileName || 'View') : '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (user.projects && user.projects.length > 0 ? user.projects.length + ' projects' : '<span class="empty">0</span>') + '</td>';
            html += '<td>' + formatArray(user.jobPreferences?.companyStages) + '</td>';
            html += '<td>' + formatArray(user.jobPreferences?.industries) + '</td>';
            html += '<td>' + formatArray(user.jobPreferences?.workStyles) + '</td>';
            html += '<td>' + formatBoolean(user.jobPreferences?.needsVisa) + '</td>';
            html += '<td>' + formatBoolean(user.emailVerified) + '</td>';
            html += '<td>' + formatBoolean(user.isActive) + '</td>';
            html += '<td>' + formatDate(user.createdAt) + '</td>';
            html += '<td>' + formatDate(user.updatedAt) + '</td>';
            html += '<td>' + formatDate(user.lastLoginAt) + '</td>';
            html += '</tr>';
          });

          html += '</tbody></table>';
          document.getElementById('usersTable').innerHTML = html;
        } else {
          document.getElementById('usersTable').innerHTML = '<div class="loading">No students found</div>';
        }
      } catch (error) {
        document.getElementById('usersLoading').style.display = 'none';
        document.getElementById('usersTable').innerHTML = '<div class="loading" style="color: #ef4444;">Error: ' + error.message + '</div>';
      }
    }

    async function loadEmployers() {
      document.getElementById('employersLoading').style.display = 'block';
      document.getElementById('employersTable').innerHTML = '';

      try {
        const response = await fetch('/api/admin/employers');
        const data = await response.json();

        document.getElementById('employersLoading').style.display = 'none';

        if (data.success && data.data.length > 0) {
          allData.employers = data.data;

          let html = '<table><thead><tr>';
          html += '<th>ID</th>';
          html += '<th>UID</th>';
          html += '<th>First Name</th>';
          html += '<th>Last Name</th>';
          html += '<th>Email</th>';
          html += '<th>Auth Provider</th>';
          html += '<th>Company</th>';
          html += '<th>Role</th>';
          html += '<th>Email Verified</th>';
          html += '<th>Active</th>';
          html += '<th>Created</th>';
          html += '<th>Updated</th>';
          html += '<th>Last Login</th>';
          html += '</tr></thead><tbody>';

          data.data.forEach(emp => {
            html += '<tr>';
            html += '<td><code>' + (emp._id || '-') + '</code></td>';
            html += '<td><code>' + (emp.uid || '-') + '</code></td>';
            html += '<td>' + (emp.firstName || '-') + '</td>';
            html += '<td>' + (emp.lastName || '-') + '</td>';
            html += '<td>' + (emp.email || '-') + '</td>';
            html += '<td>' + (emp.authProvider || '-') + '</td>';
            html += '<td>' + (emp.companyId?.companyName || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (emp.companyRole || '-') + '</td>';
            html += '<td>' + formatBoolean(emp.emailVerified) + '</td>';
            html += '<td>' + formatBoolean(emp.isActive) + '</td>';
            html += '<td>' + formatDate(emp.createdAt) + '</td>';
            html += '<td>' + formatDate(emp.updatedAt) + '</td>';
            html += '<td>' + formatDate(emp.lastLoginAt) + '</td>';
            html += '</tr>';
          });

          html += '</tbody></table>';
          document.getElementById('employersTable').innerHTML = html;
        } else {
          document.getElementById('employersTable').innerHTML = '<div class="loading">No employers found</div>';
        }
      } catch (error) {
        document.getElementById('employersLoading').style.display = 'none';
        document.getElementById('employersTable').innerHTML = '<div class="loading" style="color: #ef4444;">Error: ' + error.message + '</div>';
      }
    }

    async function loadCompanies() {
      document.getElementById('companiesLoading').style.display = 'block';
      document.getElementById('companiesTable').innerHTML = '';

      try {
        const response = await fetch('/api/admin/companies');
        const data = await response.json();

        document.getElementById('companiesLoading').style.display = 'none';

        if (data.success && data.data.length > 0) {
          allData.companies = data.data;

          let html = '<table><thead><tr>';
          html += '<th>ID</th>';
          html += '<th>Company Name</th>';
          html += '<th>Pitch</th>';
          html += '<th>Description</th>';
          html += '<th>Website</th>';
          html += '<th>Logo</th>';
          html += '<th>Headquarters</th>';
          html += '<th>Industry</th>';
          html += '<th>Company Size</th>';
          html += '<th>Funding Stage</th>';
          html += '<th>Founded Year</th>';
          html += '<th>Setup Method</th>';
          html += '<th>Onboarding Complete</th>';
          html += '<th>Team Members</th>';
          html += '<th>Created</th>';
          html += '<th>Updated</th>';
          html += '</tr></thead><tbody>';

          data.data.forEach(company => {
            html += '<tr>';
            html += '<td><code>' + (company._id || '-') + '</code></td>';
            html += '<td>' + (company.companyName || '-') + '</td>';
            html += '<td style="max-width: 200px;">' + (company.oneSentencePitch || '<span class="empty">-</span>') + '</td>';
            html += '<td style="max-width: 250px;">' + (company.companyDescription || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + formatLink(company.companyWebsite, company.companyWebsite) + '</td>';
            html += '<td>' + (company.companyLogo && company.companyLogo.fileUrl ? formatLink(company.companyLogo.fileUrl, '🖼️ View') : '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (company.headquarters && company.headquarters.city || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (company.industry || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (company.companySize || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (company.fundingStage || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (company.foundedYear || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (company.setupMethod || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + formatBoolean(company.onboardingComplete) + '</td>';
            html += '<td>' + (company.teamMembers && company.teamMembers.length > 0 ? company.teamMembers.length + ' members' : '<span class="empty">0</span>') + '</td>';
            html += '<td>' + formatDate(company.createdAt) + '</td>';
            html += '<td>' + formatDate(company.updatedAt) + '</td>';
            html += '</tr>';
          });

          html += '</tbody></table>';
          document.getElementById('companiesTable').innerHTML = html;
        } else {
          document.getElementById('companiesTable').innerHTML = '<div class="loading">No companies found</div>';
        }
      } catch (error) {
        document.getElementById('companiesLoading').style.display = 'none';
        document.getElementById('companiesTable').innerHTML = '<div class="loading" style="color: #ef4444;">Error: ' + error.message + '</div>';
      }
    }

    async function loadJobListings() {
      document.getElementById('jobListingsLoading').style.display = 'block';
      document.getElementById('jobListingsTable').innerHTML = '';

      try {
        const response = await fetch('/api/admin/job-listings');
        const data = await response.json();

        document.getElementById('jobListingsLoading').style.display = 'none';

        if (data.success && data.data.length > 0) {
          allData.jobListings = data.data;

          let html = '<table><thead><tr>';
          html += '<th>ID</th>';
          html += '<th>Role Title</th>';
          html += '<th>Company</th>';
          html += '<th>Department</th>';
          html += '<th>Location Type</th>';
          html += '<th>Office Location</th>';
          html += '<th>Status</th>';
          html += '<th>Visibility</th>';
          html += '<th>Created By</th>';
          html += '<th>Posted At</th>';
          html += '<th>Application Deadline</th>';
          html += '<th>Created</th>';
          html += '</tr></thead><tbody>';

          data.data.forEach(listing => {
            html += '<tr>';
            html += '<td><code>' + (listing._id || '-') + '</code></td>';
            html += '<td>' + (listing.roleTitle || '-') + '</td>';
            html += '<td>' + (listing.companyId?.companyName || '<span class="empty">-</span>') + '</td>';
            html += '<td>' + (listing.department || '<span class="empty">-</span>') + '</td>';
            html += '<td><span class="badge badge-true">' + (listing.locationType || '-') + '</span></td>';
            html += '<td>' + (listing.officeLocation?.city ? listing.officeLocation.city + ', ' + (listing.officeLocation.state || '') : '<span class="empty">-</span>') + '</td>';
            html += '<td><span class="badge ' + (listing.status === 'active' ? 'badge-true' : listing.status === 'draft' ? 'badge-pending' : 'badge-false') + '">' + (listing.status || '-') + '</span></td>';
            html += '<td>' + (listing.visibility || '-') + '</td>';
            html += '<td>' + (listing.createdBy ? (listing.createdBy.firstName + ' ' + listing.createdBy.lastName) : '<span class="empty">-</span>') + '</td>';
            html += '<td>' + formatDate(listing.postedAt) + '</td>';
            html += '<td>' + formatDate(listing.applicationDeadline) + '</td>';
            html += '<td>' + formatDate(listing.createdAt) + '</td>';
            html += '</tr>';
          });

          html += '</tbody></table>';
          document.getElementById('jobListingsTable').innerHTML = html;
        } else {
          document.getElementById('jobListingsTable').innerHTML = '<div class="loading">No job listings found</div>';
        }
      } catch (error) {
        document.getElementById('jobListingsLoading').style.display = 'none';
        document.getElementById('jobListingsTable').innerHTML = '<div class="loading" style="color: #ef4444;">Error: ' + error.message + '</div>';
      }
    }

    function loadAllData() {
      loadUsers();
      loadEmployers();
      loadCompanies();
      loadJobListings();
      document.getElementById('lastUpdated').textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    }

    function exportToJSON() {
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bridge-ai-database-' + Date.now() + '.json';
      link.click();
      URL.revokeObjectURL(url);
    }

    // Load data on page load
    loadAllData();

    // Auto-refresh every 30 seconds
    setInterval(loadAllData, 30000);
  </script>
</body>
</html>
  `;

  res.send(html);
});

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
        <h3>With Resume</h3>
        <div class="number" id="resumeCount">-</div>
      </div>
      <div class="stat-card">
        <h3>With Projects</h3>
        <div class="number" id="projectCount">-</div>
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
        document.getElementById('resumeCount').textContent = data.data.usersWithResume || 0;
        document.getElementById('projectCount').textContent = data.data.usersWithProjects || 0;
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
                <th>Resume</th>
                <th>LinkedIn</th>
                <th>GitHub</th>
                <th>Projects</th>
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
                  <td>\${user.resume && user.resume.fileUrl ? \`<a href="\${user.resume.fileUrl}" target="_blank" style="color: #60a5fa;">📄 View</a>\` : '❌ No'}</td>
                  <td>\${user.linkedinUrl ? \`<a href="\${user.linkedinUrl}" target="_blank" style="color: #60a5fa;">View</a>\` : '❌ No'}</td>
                  <td>\${user.githubUrl ? \`<a href="\${user.githubUrl}" target="_blank" style="color: #60a5fa;">View</a>\` : '❌ No'}</td>
                  <td>\${user.projects && user.projects.length > 0 ? user.projects.length : '0'}</td>
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
                <th>Headquarters</th>
                <th>Industry</th>
                <th>Size</th>
                <th>Funding</th>
                <th>Setup Method</th>
                <th>Onboarding</th>
                <th>Team Members</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${data.data.map(company => \`
                <tr>
                  <td>\${company.companyName}</td>
                  <td>\${company.companyWebsite ? \`<a href="\${company.companyWebsite}" target="_blank" style="color: #60a5fa;">View</a>\` : '-'}</td>
                  <td>\${company.headquarters || '-'}</td>
                  <td>\${company.industry || '-'}</td>
                  <td>\${company.companySize || '-'}</td>
                  <td>\${company.fundingStage || '-'}</td>
                  <td>\${company.setupMethod || '-'}</td>
                  <td>\${company.onboardingComplete ? '✅ Complete' : '⏳ Incomplete'}</td>
                  <td>\${company.teamMembers?.length || 0}</td>
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

    // Onboarding statistics
    const usersWithResume = await User.countDocuments({ 'resume.fileUrl': { $exists: true, $ne: null } });
    const usersWithProjects = await User.countDocuments({ 'projects.0': { $exists: true } });

    res.json({
      success: true,
      data: {
        users: userCount,
        employers: employerCount,
        companies: companyCount,
        usersWithResume: usersWithResume,
        usersWithProjects: usersWithProjects,
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
 * @desc    Get all job listings
 * @route   GET /api/admin/job-listings
 * @access  Development only
 */
router.get('/job-listings', devOnly, async (req, res) => {
  try {
    const jobListings = await JobListing.find()
      .populate('companyId', 'companyName')
      .populate('createdBy', 'firstName lastName')
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: jobListings });
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
