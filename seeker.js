// Check if job seeker is logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(currentUser);
    
    // Only allow job seekers
    if (user.userType !== 'jobseeker') {
        alert('This page is for job seekers only');
        window.location.href = 'index.html';
        return;
    }
    
    // Update navbar
    updateNavbar();
    
    loadSeekerData();
});

// Load job seeker data
function loadSeekerData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get all applications for this user
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    const userApplications = applications.filter(app => app.userId === currentUser.id);

    // Calculate statistics
    const pending = userApplications.filter(app => app.status === 'pending').length;
    const accepted = userApplications.filter(app => app.status === 'accepted').length;

    // Update stats
    document.getElementById('jobsAppliedCount').textContent = userApplications.length;
    document.getElementById('pendingApplications').textContent = pending;
    document.getElementById('acceptedApplications').textContent = accepted;

    // Display applications
    displayApplications(userApplications);
}

// Display user's applications
function displayApplications(applications) {
    const container = document.getElementById('applicationsContainer');
    
    if (applications.length === 0) {
        container.innerHTML = '<p class="empty-message">You haven\'t applied for any jobs yet. <a href="index.html">Browse jobs</a></p>';
        return;
    }

    let html = '<div class="applications-list">';
    
    applications.forEach(app => {
        const statusClass = `status-${app.status}`;
        const statusBadge = app.status === 'pending' ? '⏳ Pending' : 
                           app.status === 'accepted' ? '✅ Accepted' : 
                           app.status === 'rejected' ? '❌ Rejected' : app.status;
        
        html += `
            <div class="application-card ${statusClass}">
                <div class="app-header">
                    <div>
                        <h3>${app.jobTitle}</h3>
                        <p class="company">${app.company}</p>
                    </div>
                    <span class="app-status">${statusBadge}</span>
                </div>
                <div class="app-details">
                    <p><strong>Location:</strong> ${app.location}</p>
                    <p><strong>Salary:</strong> ${app.salary}</p>
                    <p><strong>Applied on:</strong> ${app.appliedDate}</p>
                </div>
                <div class="app-actions">
                    <button onclick="openApplicationDetailsModal(${app.id})" class="btn btn-small">View Details</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Open application details modal
function openApplicationDetailsModal(applicationId) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const app = applications.find(a => a.id === applicationId);
    
    if (!app) {
        alert('Application not found');
        return;
    }

    // Populate modal
    document.getElementById('detailJobTitle').textContent = app.jobTitle;
    document.getElementById('detailCompany').textContent = app.company;
    document.getElementById('detailLocation').textContent = app.location;
    document.getElementById('detailSalary').textContent = app.salary;
    document.getElementById('detailType').textContent = app.type || 'Full-time';
    document.getElementById('detailMode').textContent = app.mode || 'On-site';
    document.getElementById('detailDescription').textContent = app.description;
    document.getElementById('detailAppliedDate').textContent = app.appliedDate;
    
    const statusDisplay = app.status === 'pending' ? '⏳ Pending Review' : 
                         app.status === 'accepted' ? '✅ Accepted' : 
                         app.status === 'rejected' ? '❌ Rejected' : app.status;
    document.getElementById('detailStatus').textContent = statusDisplay;
    document.getElementById('detailStatus').className = `app-status status-${app.status}`;

    // Store current application for withdrawal
    window.currentApplicationId = applicationId;

    const modal = document.getElementById('applicationDetailsModal');
    modal.classList.add('show');
}

// Close application details modal
function closeApplicationDetailsModal() {
    const modal = document.getElementById('applicationDetailsModal');
    modal.classList.remove('show');
    window.currentApplicationId = null;
}

// Withdraw application
function withdrawApplication() {
    if (!window.currentApplicationId) {
        alert('Application not found');
        return;
    }

    if (!confirm('Are you sure you want to withdraw this application?')) {
        return;
    }

    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const index = applications.findIndex(a => a.id === window.currentApplicationId);

    if (index !== -1) {
        applications.splice(index, 1);
        localStorage.setItem('applications', JSON.stringify(applications));
        alert('Application withdrawn successfully');
        closeApplicationDetailsModal();
        loadSeekerData();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('applicationDetailsModal');
    if (event.target === modal) {
        closeApplicationDetailsModal();
    }
});
