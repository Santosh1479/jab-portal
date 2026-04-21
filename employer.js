// Check if employer is logged in
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }

    loadEmployerData();
});

// Load employer data
function loadEmployerData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get all jobs posted by this employer
    let postedJobs = JSON.parse(localStorage.getItem('postedJobs')) || [];
    const employerJobs = postedJobs.filter(job => job.employerId === currentUser.id);
    
    // Get applications for these jobs
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    const employerApplications = applications.filter(app => 
        employerJobs.some(job => job.id === app.jobId)
    );

    // Update stats
    document.getElementById('jobsPostedCount').textContent = employerJobs.length;
    document.getElementById('totalApplicationsCount').textContent = employerApplications.length;
    document.getElementById('viewsCount').textContent = employerJobs.reduce((sum, job) => sum + (job.views || 0), 0);

    // Display jobs
    displayEmployerJobs(employerJobs);
    
    // Display applications
    displayApplications(employerApplications, employerJobs);
}

// Display employer's posted jobs
function displayEmployerJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    
    if (jobs.length === 0) {
        container.innerHTML = '<p class="empty-message">No jobs posted yet. <a href="#" onclick="openPostJobModal()">Post a job</a></p>';
        return;
    }

    let html = '<table class="jobs-table"><thead><tr><th>Job Title</th><th>Location</th><th>Posted</th><th>Applications</th><th>Actions</th></tr></thead><tbody>';
    
    jobs.forEach(job => {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const appCount = applications.filter(app => app.jobId === job.id).length;
        
        html += `
            <tr>
                <td><strong>${job.title}</strong></td>
                <td>${job.location}</td>
                <td>${job.postedDate}</td>
                <td><span class="badge">${appCount}</span></td>
                <td>
                    <button onclick="editJob(${job.id})" class="btn-small">Edit</button>
                    <button onclick="deleteJob(${job.id})" class="btn-small btn-danger">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Display applications
function displayApplications(applications, jobs) {
    const container = document.getElementById('applicationsContainer');
    
    if (applications.length === 0) {
        container.innerHTML = '<p class="empty-message">No applications yet.</p>';
        return;
    }

    let html = '<div class="applications-list">';
    
    applications.forEach(app => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const applicant = users.find(u => u.id === app.userId);
        const job = jobs.find(j => j.id === app.jobId);
        
        if (applicant && job) {
            const statusClass = `status-${app.status}`;
            html += `
                <div class="application-card ${statusClass}">
                    <div class="app-header">
                        <h3>${applicant.fullname}</h3>
                        <span class="app-status">${app.status}</span>
                    </div>
                    <div class="app-details">
                        <p><strong>Applied for:</strong> ${job.title}</p>
                        <p><strong>Email:</strong> ${applicant.email}</p>
                        <p><strong>Phone:</strong> ${applicant.phone}</p>
                        <p><strong>Applied on:</strong> ${app.appliedDate}</p>
                    </div>
                    <button onclick="openApplicantModal(${app.id}, '${applicant.fullname}', '${applicant.email}', '${applicant.phone}', '${job.title}', '${app.appliedDate}', '${app.status}')" class="btn btn-secondary">View Details</button>
                </div>
            `;
        }
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Open post job modal
function openPostJobModal() {
    document.getElementById('postJobForm').reset();
    document.getElementById('postJobModal').classList.add('show');
}

// Close post job modal
function closePostJobModal() {
    document.getElementById('postJobModal').classList.remove('show');
}

// Handle post job
function handlePostJob(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const newJob = {
        id: Date.now(),
        employerId: currentUser.id,
        company: currentUser.fullname,
        title: document.getElementById('jobTitle').value,
        location: document.getElementById('jobLocation').value,
        salary: document.getElementById('jobSalary').value,
        type: document.getElementById('jobType').value,
        mode: document.getElementById('jobMode').value,
        description: document.getElementById('jobDescription').value,
        postedDate: new Date().toLocaleDateString(),
        views: 0
    };

    let postedJobs = JSON.parse(localStorage.getItem('postedJobs')) || [];
    postedJobs.push(newJob);
    localStorage.setItem('postedJobs', JSON.stringify(postedJobs));

    alert('Job posted successfully!');
    closePostJobModal();
    loadEmployerData();
}

// Edit job
function editJob(jobId) {
    alert('Edit functionality - Job ID: ' + jobId);
    // Would implement edit functionality here
}

// Delete job
function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        let postedJobs = JSON.parse(localStorage.getItem('postedJobs')) || [];
        postedJobs = postedJobs.filter(job => job.id !== jobId);
        localStorage.setItem('postedJobs', JSON.stringify(postedJobs));
        
        alert('Job deleted successfully!');
        loadEmployerData();
    }
}

// Open applicant modal
function openApplicantModal(appId, name, email, phone, jobTitle, date, status) {
    document.getElementById('applicantName').textContent = name;
    document.getElementById('applicantEmail').textContent = email;
    document.getElementById('applicantPhone').textContent = phone;
    document.getElementById('applicantJobTitle').textContent = jobTitle;
    document.getElementById('applicantDate').textContent = date;
    document.getElementById('applicantStatus').textContent = status;
    
    window.currentApplicationId = appId;
    document.getElementById('applicantModal').classList.add('show');
}

// Close applicant modal
function closeApplicantModal() {
    document.getElementById('applicantModal').classList.remove('show');
}

// Update application status
function updateApplicationStatus(newStatus) {
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    const appIndex = applications.findIndex(app => app.id === window.currentApplicationId);
    if (appIndex !== -1) {
        applications[appIndex].status = newStatus;
        localStorage.setItem('applications', JSON.stringify(applications));
        
        alert(`Application ${newStatus}!`);
        closeApplicantModal();
        loadEmployerData();
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active to clicked button
    event.target.classList.add('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const postJobModal = document.getElementById('postJobModal');
    const applicantModal = document.getElementById('applicantModal');
    
    if (event.target == postJobModal) {
        closePostJobModal();
    }
    if (event.target == applicantModal) {
        closeApplicantModal();
    }
}
