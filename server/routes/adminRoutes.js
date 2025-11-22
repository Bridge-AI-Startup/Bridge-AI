const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const Company = require('../models/Company');
const JobListing = require('../models/JobListing');
const Application = require('../models/Application');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Match = require('../models/Match');

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

/**
 * @desc    Get all pending assessments for admin grading
 * @route   GET /api/admin/assessments/pending
 * @access  Development only
 */
router.get('/assessments/pending', devOnly, async (req, res) => {
  try {
    // Get ALL applications with completed assessments (not filtered by company)
    const applications = await Application.find({
      stage: 'assessment_completed'
    })
      .populate('candidateId', 'firstName lastName email profilePicture')
      .populate('jobListingId', 'roleTitle')
      .populate('companyId', 'companyName')
      .sort({ lastActivityAt: -1 });

    // Get assessment results for these applications
    const applicationsWithAssessments = await Promise.all(
      applications.map(async (app) => {
        const assessmentResults = await AssessmentResult.find({
          candidateId: app.candidateId._id,
          jobListingId: app.jobListingId._id,
          status: 'completed'
        }).populate('assessmentId', 'title assessmentType timeLimit');

        return {
          application: app,
          assessmentResults: assessmentResults
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        pendingAssessments: applicationsWithAssessments,
        count: applicationsWithAssessments.length
      }
    });
  } catch (error) {
    console.error('Error in admin getPendingAssessments:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch pending assessments'
    });
  }
});

/**
 * @desc    Get single application with assessment details
 * @route   GET /api/admin/applications/:id
 * @access  Development only
 */
router.get('/applications/:id', devOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidateId')
      .populate('jobListingId')
      .populate('companyId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Get assessment results
    const assessmentResults = await AssessmentResult.find({
      candidateId: application.candidateId._id,
      jobListingId: application.jobListingId._id
    }).populate('assessmentId', 'title assessmentType timeLimit description');

    return res.status(200).json({
      success: true,
      data: {
        application: application,
        assessmentResults: assessmentResults
      }
    });
  } catch (error) {
    console.error('Error in admin getApplication:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch application'
    });
  }
});

/**
 * @desc    Admin grade assessment (manual grading)
 * @route   POST /api/admin/applications/:id/grade
 * @access  Development only
 */
router.post('/applications/:id/grade', devOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { assessmentResultId, score, feedback, moveToInterview } = req.body;

    // Find assessment result
    const assessmentResult = await AssessmentResult.findById(assessmentResultId);
    if (!assessmentResult) {
      return res.status(404).json({
        success: false,
        message: 'Assessment result not found'
      });
    }

    // Update assessment result with manual grade
    assessmentResult.score = score;
    assessmentResult.results.detailedFeedback = feedback || '';
    assessmentResult.results.evaluatorNotes = `Manually graded by admin`;
    await assessmentResult.save();

    // Update application
    const application = await Application.findById(id);
    if (application && moveToInterview) {
      application.stage = 'interview_scheduled';
      application.lastActivityAt = new Date();
      application.stageHistory.push({
        stage: 'interview_scheduled',
        movedAt: new Date(),
        movedBy: 'admin',
        notes: `Passed assessment with score ${score}`
      });
      await application.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment graded successfully',
      data: {
        assessmentResult: assessmentResult,
        application: application
      }
    });
  } catch (error) {
    console.error('Error in admin gradeAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to grade assessment'
    });
  }
});

/**
 * ========================================
 * MATCHING ENDPOINTS
 * ========================================
 */

/**
 * @desc    Get all students and companies for matching
 * @route   GET /api/admin/matching/data
 * @access  Development only
 */
router.get('/matching/data', devOnly, async (req, res) => {
  try {
    // Get all students
    const students = await User.find({})
      .select('_id name email university education skills onboardingCompleted')
      .lean();

    // Add firstName and lastName from name field for compatibility
    students.forEach(student => {
      const nameParts = (student.name || '').split(' ');
      student.firstName = nameParts[0] || '';
      student.lastName = nameParts.slice(1).join(' ') || '';
    });

    // Get all companies with job listings
    const companies = await Company.find({ isActive: true })
      .select('_id companyName industry companySize companyWebsite')
      .lean();

    // Get all job listings
    const jobListings = await JobListing.find({ status: 'active' })
      .populate('companyId', 'companyName')
      .select('_id roleTitle companyId requiredSkills workLocation salaryRange')
      .lean();

    // Get existing matches
    const matches = await Match.find({})
      .populate('studentId', 'firstName lastName email')
      .populate('companyId', 'companyName')
      .populate('jobListingId', 'roleTitle')
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        students,
        companies,
        jobListings,
        matches
      }
    });
  } catch (error) {
    console.error('Error fetching matching data:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch matching data'
    });
  }
});

/**
 * @desc    Create a new match
 * @route   POST /api/admin/matching/create
 * @access  Development only
 */
router.post('/matching/create', devOnly, async (req, res) => {
  try {
    const {
      studentId,
      companyId,
      jobListingId,
      overallScore,
      matchFactors,
      adminNotes,
      matchReason
    } = req.body;

    // Validate required fields
    if (!studentId || !companyId || overallScore === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Student ID, Company ID, and overall score are required'
      });
    }

    // Check if match already exists
    const existingMatch = await Match.findOne({
      studentId,
      companyId,
      ...(jobListingId && { jobListingId })
    });

    if (existingMatch) {
      return res.status(409).json({
        success: false,
        message: 'A match between this student and company/job already exists',
        data: { existingMatch }
      });
    }

    // Create new match
    const match = new Match({
      studentId,
      companyId,
      jobListingId,
      overallScore,
      matchFactors: matchFactors || {},
      adminNotes,
      matchReason,
      matchType: 'manual',
      createdBy: 'admin',
      status: 'active'
    });

    await match.save();

    // Populate for response
    await match.populate([
      { path: 'studentId', select: 'firstName lastName email' },
      { path: 'companyId', select: 'companyName' },
      { path: 'jobListingId', select: 'roleTitle' }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Match created successfully',
      data: { match }
    });
  } catch (error) {
    console.error('Error creating match:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create match'
    });
  }
});

/**
 * @desc    Update an existing match
 * @route   PUT /api/admin/matching/:matchId
 * @access  Development only
 */
router.put('/matching/:matchId', devOnly, async (req, res) => {
  try {
    const { matchId } = req.params;
    const {
      overallScore,
      matchFactors,
      status,
      adminNotes,
      matchReason,
      visibleToStudent,
      visibleToEmployer
    } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Update fields
    if (overallScore !== undefined) match.overallScore = overallScore;
    if (matchFactors) match.matchFactors = { ...match.matchFactors, ...matchFactors };
    if (status) match.status = status;
    if (adminNotes !== undefined) match.adminNotes = adminNotes;
    if (matchReason !== undefined) match.matchReason = matchReason;
    if (visibleToStudent !== undefined) match.visibleToStudent = visibleToStudent;
    if (visibleToEmployer !== undefined) match.visibleToEmployer = visibleToEmployer;

    match.lastModifiedBy = 'admin';

    await match.save();

    // Populate for response
    await match.populate([
      { path: 'studentId', select: 'firstName lastName email' },
      { path: 'companyId', select: 'companyName' },
      { path: 'jobListingId', select: 'roleTitle' }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Match updated successfully',
      data: { match }
    });
  } catch (error) {
    console.error('Error updating match:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update match'
    });
  }
});

/**
 * @desc    Delete a match by query (studentId, companyId, jobListingId)
 * @route   DELETE /api/admin/matching/delete
 * @access  Development only
 */
router.delete('/matching/delete', devOnly, async (req, res) => {
  try {
    const { studentId, companyId, jobListingId } = req.body;

    if (!studentId || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Company ID are required'
      });
    }

    const query = {
      studentId,
      companyId,
      ...(jobListingId && { jobListingId })
    };

    const deletedMatch = await Match.findOneAndDelete(query);

    if (!deletedMatch) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Match deleted successfully',
      data: { deletedMatch }
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete match'
    });
  }
});

/**
 * @desc    Populate matches with random test data
 * @route   POST /api/admin/matching/populate-random
 * @access  Development only
 */
router.post('/matching/populate-random', devOnly, async (req, res) => {
  try {
    // Get all students and job listings
    // Find users who have university field (students) or no userType/userType='student'
    const students = await User.find({
      $or: [
        { university: { $exists: true, $ne: null } },
        { userType: 'student' }
      ]
    }).select('_id firstName lastName');
    const jobListings = await JobListing.find({}).select('_id roleTitle companyId').populate('companyId');

    if (students.length === 0 || jobListings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Need at least one student and one job listing to generate matches'
      });
    }

    // Helper function to generate random score with decimal precision
    const generateRandomScore = () => {
      // Generate scores with varied distribution
      const rand = Math.random();
      let score;

      if (rand < 0.2) {
        // 20% poor matches (0-39)
        score = Math.random() * 40;
      } else if (rand < 0.5) {
        // 30% fair matches (40-59)
        score = 40 + Math.random() * 20;
      } else if (rand < 0.8) {
        // 30% good matches (60-79)
        score = 60 + Math.random() * 20;
      } else {
        // 20% excellent matches (80-100)
        score = 80 + Math.random() * 20;
      }

      return Math.round(score * 10) / 10; // Round to 1 decimal place
    };

    // Generate match factors
    const generateMatchFactors = (overallScore) => {
      const variation = 15; // +/- variation from overall score
      return {
        skillsMatch: Math.max(0, Math.min(100, overallScore + (Math.random() * variation * 2 - variation))),
        experienceMatch: Math.max(0, Math.min(100, overallScore + (Math.random() * variation * 2 - variation))),
        educationMatch: Math.max(0, Math.min(100, overallScore + (Math.random() * variation * 2 - variation))),
        locationMatch: Math.max(0, Math.min(100, overallScore + (Math.random() * variation * 2 - variation))),
        cultureMatch: Math.max(0, Math.min(100, overallScore + (Math.random() * variation * 2 - variation)))
      };
    };

    const matches = [];
    let createdCount = 0;

    // Create matches for each student-job combination
    for (const student of students) {
      for (const job of jobListings) {
        // Check if match already exists
        const existingMatch = await Match.findOne({
          studentId: student._id,
          jobListingId: job._id
        });

        if (!existingMatch) {
          const overallScore = generateRandomScore();
          const matchFactors = generateMatchFactors(overallScore);

          const match = new Match({
            studentId: student._id,
            jobListingId: job._id,
            companyId: job.companyId._id,
            overallScore: overallScore,
            matchFactors: matchFactors,
            status: 'pending',
            matchType: 'ai_generated',
            createdBy: 'admin',
            matchReason: 'Random test data for development',
            visibleToStudent: false,
            visibleToEmployer: false
          });

          await match.save();
          matches.push(match);
          createdCount++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Created ${createdCount} random matches`,
      data: {
        matchesCreated: createdCount,
        studentsCount: students.length,
        jobListingsCount: jobListings.length,
        totalPossible: students.length * jobListings.length
      }
    });
  } catch (error) {
    console.error('Error populating random matches:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to populate random matches'
    });
  }
});

/**
 * @desc    Clear all matches from the database
 * @route   DELETE /api/admin/matching/clear-all
 * @access  Development only
 */
router.delete('/matching/clear-all', devOnly, async (req, res) => {
  try {
    // Delete all matches
    const matchResult = await Match.deleteMany({});

    // Also delete all assessment results that were auto-created
    const assessmentResult = await AssessmentResult.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `Deleted ${matchResult.deletedCount} matches and ${assessmentResult.deletedCount} assessment results`,
      data: {
        matchesDeleted: matchResult.deletedCount,
        assessmentResultsDeleted: assessmentResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing matches:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear matches'
    });
  }
});

/**
 * @desc    Delete a match by ID
 * @route   DELETE /api/admin/matching/:matchId
 * @access  Development only
 */
router.delete('/matching/:matchId', devOnly, async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findByIdAndDelete(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete match'
    });
  }
});

/**
 * @desc    Get matches for a specific student
 * @route   GET /api/admin/matching/student/:studentId
 * @access  Development only
 */
router.get('/matching/student/:studentId', devOnly, async (req, res) => {
  try {
    const { studentId } = req.params;

    const matches = await Match.find({ studentId })
      .populate('companyId', 'companyName industry companyWebsite')
      .populate('jobListingId', 'roleTitle workLocation salaryRange')
      .sort({ overallScore: -1 });

    return res.status(200).json({
      success: true,
      data: { matches }
    });
  } catch (error) {
    console.error('Error fetching student matches:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student matches'
    });
  }
});

/**
 * @desc    Get matches for a specific job listing
 * @route   GET /api/admin/matching/job/:jobListingId
 * @access  Development only
 */
router.get('/matching/job/:jobListingId', devOnly, async (req, res) => {
  try {
    const { jobListingId } = req.params;

    const matches = await Match.find({
      jobListingId,
      visibleToEmployer: true
    })
      .populate('studentId', 'firstName lastName email university skills education')
      .populate('companyId', 'companyName')
      .sort({ overallScore: -1 });

    return res.status(200).json({
      success: true,
      data: { matches }
    });
  } catch (error) {
    console.error('Error fetching job listing matches:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch job listing matches'
    });
  }
});

/**
 * @desc    Batch create multiple matches
 * @route   POST /api/admin/matching/batch
 * @access  Development only
 */
router.post('/matching/batch', devOnly, async (req, res) => {
  try {
    const { matches } = req.body;

    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Matches array is required'
      });
    }

    const results = {
      created: [],
      updated: [],
      errors: []
    };

    for (const matchData of matches) {
      try {
        const {
          studentId,
          companyId,
          jobListingId,
          overallScore,
          matchFactors,
          adminNotes,
          matchReason
        } = matchData;

        // Check if match already exists
        const existingMatch = await Match.findOne({
          studentId,
          companyId,
          ...(jobListingId && { jobListingId })
        });

        if (existingMatch) {
          // Update existing match
          existingMatch.overallScore = overallScore;
          existingMatch.matchFactors = matchFactors || existingMatch.matchFactors;
          existingMatch.adminNotes = adminNotes || existingMatch.adminNotes;
          existingMatch.matchReason = matchReason || existingMatch.matchReason;
          existingMatch.lastModifiedBy = 'admin';
          await existingMatch.save();

          results.updated.push(existingMatch._id);
        } else {
          // Create new match
          const match = new Match({
            studentId,
            companyId,
            jobListingId,
            overallScore,
            matchFactors: matchFactors || {},
            adminNotes,
            matchReason,
            matchType: 'manual',
            createdBy: 'admin',
            status: 'active'
          });
          await match.save();

          results.created.push(match._id);
        }
      } catch (err) {
        results.errors.push({
          matchData,
          error: err.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Batch operation completed: ${results.created.length} created, ${results.updated.length} updated, ${results.errors.length} errors`,
      data: results
    });
  } catch (error) {
    console.error('Error in batch match creation:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create batch matches'
    });
  }
});

/**
 * @desc    Get AI suggestion for a student-job match
 * @route   POST /api/admin/matching/ai-suggest
 * @access  Development only
 */
router.post('/matching/ai-suggest', devOnly, async (req, res) => {
  try {
    const { student, job } = req.body;

    if (!student || !job) {
      return res.status(400).json({
        success: false,
        message: 'Student and job data are required'
      });
    }

    // Use OpenAI directly
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Build prompt for AI
    const prompt = `You are an expert recruiter. Analyze this student-job match and provide ratings from 0-100 for each category.

Student Profile:
- Name: ${student.firstName} ${student.lastName}
- University: ${student.university || 'Unknown'}
- Skills: ${student.skills?.map(s => s.skillName || s).join(', ') || 'None listed'}
- Education: ${student.education?.map(e => `${e.degree} in ${e.major}`).join(', ') || 'None listed'}

Job Posting:
- Role: ${job.roleTitle}
- Company: ${job.companyId?.companyName || 'Unknown'}
- Required Skills: ${job.requiredSkills?.join(', ') || 'None listed'}
- Location: ${job.workLocation || 'Unknown'}
- Salary Range: ${job.salaryRange?.min || 0} - ${job.salaryRange?.max || 0}

Provide ratings (0-100) for:
1. skillsMatch - Technical skills alignment
2. experienceMatch - Experience level match
3. educationMatch - Educational background fit
4. culturalFit - Overall cultural alignment
5. locationMatch - Location/remote work match
6. compensationMatch - Salary expectation match

Also provide a brief explanation (2-3 sentences) justifying your overall assessment.

Respond ONLY with a JSON object in this exact format:
{
  "overallScore": 75,
  "matchFactors": {
    "skillsMatch": 80,
    "experienceMatch": 70,
    "educationMatch": 75,
    "culturalFit": 70,
    "locationMatch": 85,
    "compensationMatch": 70
  },
  "explanation": "This candidate shows strong technical skills alignment with the role requirements. Their educational background matches well with the position level. The location and compensation expectations align closely with what the company offers."
}`;

    // Call OpenAI with cheapest model
    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const aiResponse = result.choices[0].message.content;

    // Parse AI response
    let rating;
    try {
      rating = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, aiResponse);
      // Fallback to default ratings
      rating = {
        overallScore: 50,
        matchFactors: {
          skillsMatch: 50,
          experienceMatch: 50,
          educationMatch: 50,
          culturalFit: 50,
          locationMatch: 50,
          compensationMatch: 50
        },
        explanation: "Unable to generate AI analysis. Default neutral ratings provided."
      };
    }

    return res.status(200).json({
      success: true,
      data: { rating }
    });
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI suggestion'
    });
  }
});

/**
 * @desc    Generate optimal matches based on constraints
 * @route   POST /api/admin/matching/generate-optimal
 * @access  Development only
 */
router.post('/matching/generate-optimal', devOnly, async (req, res) => {
  try {
    const { studentLimit, jobLimit, minScore } = req.body;

    // Fetch all matches with scores above minimum
    const allMatches = await Match.find({
      overallScore: { $gte: minScore || 0 }
    })
      .populate('studentId', 'firstName lastName email')
      .populate('companyId', 'companyName')
      .populate('jobListingId', 'roleTitle workLocation')
      .sort({ overallScore: -1 }); // Sort by score descending (best first)

    // Track how many matches each student and job listing has
    const studentMatchCount = {};
    const jobMatchCount = {};
    const selectedMatches = [];

    // Greedy algorithm: go through matches from best to worst
    for (const match of allMatches) {
      const studentId = match.studentId._id.toString();
      const jobId = match.jobListingId._id.toString();

      // Check if constraints are met
      const studentCount = studentMatchCount[studentId] || 0;
      const jobCount = jobMatchCount[jobId] || 0;

      if (studentCount < studentLimit && jobCount < jobLimit) {
        // Add this match
        selectedMatches.push(match);
        studentMatchCount[studentId] = studentCount + 1;
        jobMatchCount[jobId] = jobCount + 1;
      }
    }

    // Calculate statistics
    const uniqueStudents = Object.keys(studentMatchCount).length;
    const uniqueJobs = Object.keys(jobMatchCount).length;
    const avgScore = selectedMatches.length > 0
      ? Math.round(selectedMatches.reduce((sum, m) => sum + m.overallScore, 0) / selectedMatches.length)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        matches: selectedMatches,
        stats: {
          totalMatches: selectedMatches.length,
          studentsMatched: uniqueStudents,
          companiesMatched: uniqueJobs, // Field name kept for compatibility, but this is jobs matched
          avgScore
        }
      }
    });
  } catch (error) {
    console.error('Error generating optimal matches:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate optimal matches'
    });
  }
});

/**
 * @desc    Publish final matches (make them visible to students and companies)
 * @route   POST /api/admin/matching/publish-final
 * @access  Development only
 */
router.post('/matching/publish-final', devOnly, async (req, res) => {
  try {
    const { matches } = req.body;

    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Matches array is required'
      });
    }

    // First, set all existing matches to not visible
    await Match.updateMany(
      {},
      {
        $set: {
          visibleToStudent: false,
          visibleToEmployer: false,
          status: 'archived'
        }
      }
    );

    const results = {
      published: [],
      errors: []
    };

    // Publish each selected match
    for (const matchData of matches) {
      try {
        const { studentId, companyId, jobListingId, overallScore, matchFactors } = matchData;

        // Find or create the match
        let match = await Match.findOne({
          studentId,
          companyId,
          ...(jobListingId && { jobListingId })
        });

        if (match) {
          // Update existing match
          match.visibleToStudent = true;
          match.visibleToEmployer = true;
          match.status = 'active';
          match.overallScore = overallScore;
          match.matchFactors = matchFactors || match.matchFactors;
          match.matchType = 'ai_generated';
          match.lastModifiedBy = 'admin';
          await match.save();
        } else {
          // Create new match
          match = new Match({
            studentId,
            companyId,
            jobListingId,
            overallScore,
            matchFactors: matchFactors || {},
            visibleToStudent: true,
            visibleToEmployer: true,
            status: 'active',
            matchType: 'ai_generated',
            createdBy: 'admin',
            matchReason: 'Published from optimal matching algorithm'
          });
          await match.save();
        }

        // Auto-assign assessments if job listing has assessments
        if (jobListingId) {
          const jobListing = await JobListing.findById(jobListingId).populate('assessments');

          if (jobListing && jobListing.assessments && jobListing.assessments.length > 0) {
            for (const assessment of jobListing.assessments) {
              // Check if assessment result already exists for this student-assessment combination
              const existingResult = await AssessmentResult.findOne({
                assessmentId: assessment._id,
                candidateId: studentId,
                jobListingId: jobListingId
              });

              if (!existingResult) {
                // Calculate due date (e.g., 7 days from now or use assessment time limit)
                const dueDate = new Date();
                const daysToComplete = 7; // Default 7 days
                dueDate.setDate(dueDate.getDate() + daysToComplete);

                // Create assessment result
                const assessmentResult = new AssessmentResult({
                  assessmentResultId: uuidv4(),
                  assessmentId: assessment._id,
                  candidateId: studentId,
                  jobListingId: jobListingId,
                  applicationId: null, // Will be linked when student applies
                  status: 'not_started',
                  dueDate: dueDate,
                  timeAllowed: assessment.timeLimit || 60, // Default 60 minutes
                });

                await assessmentResult.save();
              }
            }
          }
        }

        results.published.push(match._id);
      } catch (err) {
        results.errors.push({
          matchData,
          error: err.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Published ${results.published.length} matches, ${results.errors.length} errors`,
      data: results
    });
  } catch (error) {
    console.error('Error publishing matches:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to publish matches'
    });
  }
});

module.exports = router;
