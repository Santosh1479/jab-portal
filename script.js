// Check if user is logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
});

// Update navbar based on login status
function updateNavbar() {
    const currentUser = localStorage.getItem('currentUser');
    const userSection = document.getElementById('nav-user-section');
    const authSection = document.getElementById('nav-auth-section');
    const dashboardSection = document.getElementById('nav-dashboard-section');
    const seekerDashboardSection = document.getElementById('nav-seeker-dashboard-section');
    const username = document.getElementById('nav-username');
    const heroContent = document.getElementById('heroContent');
    const employerHero = document.getElementById('employerHero');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (userSection) userSection.style.display = 'flex';
        if (authSection) authSection.style.display = 'none';
        if (username) username.textContent = `Welcome, ${user.fullname}!`;
        
        // Show dashboard link for employers
        if (user.userType === 'employer') {
            if (dashboardSection) dashboardSection.style.display = 'block';
            if (seekerDashboardSection) seekerDashboardSection.style.display = 'none';
            if (heroContent) heroContent.style.display = 'none';
            if (employerHero) employerHero.style.display = 'block';
        } else {
            // Show dashboard link for job seekers
            if (dashboardSection) dashboardSection.style.display = 'none';
            if (seekerDashboardSection) seekerDashboardSection.style.display = 'block';
            if (heroContent) heroContent.style.display = 'block';
            if (employerHero) employerHero.style.display = 'none';
        }
    } else {
        if (userSection) userSection.style.display = 'none';
        if (authSection) authSection.style.display = 'flex';
        if (dashboardSection) dashboardSection.style.display = 'none';
        if (seekerDashboardSection) seekerDashboardSection.style.display = 'none';
        if (heroContent) heroContent.style.display = 'block';
        if (employerHero) employerHero.style.display = 'none';
    }
}

// Handle Registration
function handleRegister(event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');

    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validation
    if (!fullname || !email || !phone || !password || !confirmPassword || !userType) {
        errorDiv.textContent = 'All fields are required.';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long.';
        errorDiv.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
    }

    // Check if email already exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        errorDiv.textContent = 'Email already registered.';
        errorDiv.style.display = 'block';
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        fullname: fullname,
        email: email,
        phone: phone,
        password: password, // Note: In real app, use hashing
        userType: userType,
        registeredDate: new Date().toLocaleDateString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    successDiv.textContent = 'Registration successful! Redirecting to login...';
    successDiv.style.display = 'block';

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');

    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validation
    if (!email || !password) {
        errorDiv.textContent = 'Please enter email and password.';
        errorDiv.style.display = 'block';
        return;
    }

    // Check user credentials
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        errorDiv.textContent = 'Invalid email or password.';
        errorDiv.style.display = 'block';
        return;
    }

    // Save current user session
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Show success message
    successDiv.textContent = 'Login successful! Redirecting to home...';
    successDiv.style.display = 'block';

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Handle Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data only (keep user accounts for login)
        localStorage.removeItem('currentUser');
        
        // Clear temporary variables
        window.currentJobData = null;
        window.currentApplicationId = null;
        
        // Redirect to home
        window.location.href = 'index.html';
    }
}

// Search Jobs
function searchJobs() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        alert('Please enter a job title or keyword');
        return;
    }

    // Get all jobs (Indian jobs only)
    const featuredJobs = [
        { title: 'Senior Java Developer', company: 'Infosys Limited', location: 'Bangalore, Karnataka', salary: '₹12,00,000 - ₹18,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'Business Analyst', company: 'TCS (Tata Consultancy Services)', location: 'Mumbai, Maharashtra', salary: '₹8,00,000 - ₹12,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'Full Stack Developer', company: 'HCL Technologies', location: 'Bangalore, Karnataka', salary: '₹10,00,000 - ₹15,00,000/year', type: 'Full-time', mode: 'Remote' },
        { title: 'QA Automation Engineer', company: 'Wipro Limited', location: 'Pune, Maharashtra', salary: '₹7,00,000 - ₹10,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'Cloud Solutions Architect', company: 'Amazon India', location: 'Bangalore, Karnataka', salary: '₹18,00,000 - ₹25,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'Python Developer', company: 'Accenture India', location: 'Mysore, Karnataka', salary: '₹8,00,000 - ₹13,00,000/year', type: 'Full-time', mode: 'Remote' },
        { title: 'Data Science Engineer', company: 'LinkedIn India', location: 'Bangalore, Karnataka', salary: '₹15,00,000 - ₹22,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'Android Developer', company: 'Flipkart', location: 'Bangalore, Karnataka', salary: '₹11,00,000 - ₹16,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: '.NET Developer', company: 'Cognizant', location: 'Mangalore, Karnataka', salary: '₹9,00,000 - ₹14,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'DevOps Engineer', company: 'Google India', location: 'Bangalore, Karnataka', salary: '₹16,00,000 - ₹24,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'Database Administrator', company: 'Capgemini', location: 'Mysore, Karnataka', salary: '₹8,50,000 - ₹12,50,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'UI/UX Designer', company: 'Ola', location: 'Bangalore, Karnataka', salary: '₹9,00,000 - ₹14,00,000/year', type: 'Full-time', mode: 'On-site' }
    ];

    // Filter jobs
    const filteredJobs = featuredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) || 
        job.company.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredJobs, searchTerm);
}

// Advanced Search with Filters
function advancedSearch() {
    const keyword = document.getElementById('filterKeyword').value.trim().toLowerCase();
    const location = document.getElementById('filterLocation').value.trim().toLowerCase();
    const jobType = document.getElementById('filterJobType').value;
    const workMode = document.getElementById('filterWorkMode').value;

    // Get all Indian jobs (no international jobs)
    const featuredJobs = [
        { title: 'Senior Java Developer', company: 'Infosys Limited', location: 'Bangalore, Karnataka', salary: '₹12,00,000 - ₹18,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'Business Analyst', company: 'TCS', location: 'Mumbai, Maharashtra', salary: '₹8,00,000 - ₹12,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'Full Stack Developer', company: 'HCL Technologies', location: 'Bangalore, Karnataka', salary: '₹10,00,000 - ₹15,00,000/year', type: 'Full-time', mode: 'Remote' },
        { title: 'QA Automation Engineer', company: 'Wipro Limited', location: 'Pune, Maharashtra', salary: '₹7,00,000 - ₹10,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'Cloud Solutions Architect', company: 'Amazon India', location: 'Bangalore, Karnataka', salary: '₹18,00,000 - ₹25,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'Python Developer', company: 'Accenture India', location: 'Mysore, Karnataka', salary: '₹8,00,000 - ₹13,00,000/year', type: 'Full-time', mode: 'Remote' },
        { title: 'Data Science Engineer', company: 'LinkedIn India', location: 'Bangalore, Karnataka', salary: '₹15,00,000 - ₹22,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'Android Developer', company: 'Flipkart', location: 'Bangalore, Karnataka', salary: '₹11,00,000 - ₹16,00,000/year', type: 'Full-time', mode: 'On-site' },
        { title: '.NET Developer', company: 'Cognizant', location: 'Mangalore, Karnataka', salary: '₹9,00,000 - ₹14,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'DevOps Engineer', company: 'Google India', location: 'Bangalore, Karnataka', salary: '₹16,00,000 - ₹24,00,000/year', type: 'Full-time', mode: 'Hybrid' },
        { title: 'Database Administrator', company: 'Capgemini', location: 'Mysore, Karnataka', salary: '₹8,50,000 - ₹12,50,000/year', type: 'Full-time', mode: 'On-site' },
        { title: 'UI/UX Designer', company: 'Ola', location: 'Bangalore, Karnataka', salary: '₹9,00,000 - ₹14,00,000/year', type: 'Full-time', mode: 'On-site' }
    ];

    // Filter jobs based on all criteria
    const filteredJobs = featuredJobs.filter(job => {
        const keywordMatch = !keyword || 
            job.title.toLowerCase().includes(keyword) || 
            job.company.toLowerCase().includes(keyword);
        
        const locationMatch = !location || 
            job.location.toLowerCase().includes(location);
        
        const typeMatch = !jobType || job.type === jobType;
        const modeMatch = !workMode || job.mode === workMode;

        return keywordMatch && locationMatch && typeMatch && modeMatch;
    });

    const filterSummary = `${keyword ? 'Keyword: ' + keyword : ''} ${location ? 'Location: ' + location : ''} ${jobType ? 'Type: ' + jobType : ''} ${workMode ? 'Mode: ' + workMode : ''}`.trim();
    
    displaySearchResults(filteredJobs, filterSummary || 'All Jobs');
}

// Display Search Results
function displaySearchResults(jobs, searchTerm) {
    if (jobs.length === 0) {
        alert(`No jobs found for "${searchTerm}". Please try another search.`);
        return;
    }

    // Display search results
    let resultHTML = `<h2>Search Results for "${searchTerm}" (${jobs.length} jobs found)</h2>`;
    resultHTML += '<div class="search-results">';
    
    jobs.forEach(job => {
        resultHTML += `
            <div class="search-result-card">
                <h3>${job.title}</h3>
                <p class="company">${job.company}</p>
                <p class="location">🌍 ${job.location}</p>
                <p class="salary">💰 ${job.salary}</p>
                <div class="job-tags">
                    <span>${job.type}</span>
                    <span>${job.mode}</span>
                </div>
                <button onclick="applyJob()" class="btn btn-secondary">Apply Now</button>
            </div>
        `;
    });
    
    resultHTML += '</div>';

    // Scroll to results section
    const container = document.querySelector('.container');
    const searchResultsDiv = document.createElement('div');
    searchResultsDiv.className = 'search-results-section';
    searchResultsDiv.innerHTML = resultHTML;
    
    // Remove previous search results if any
    const previousResults = document.querySelector('.search-results-section');
    if (previousResults) {
        previousResults.remove();
    }
    
    // Insert after hero section or search-filters section
    const jobsSection = document.getElementById('jobs');
    jobsSection.parentNode.insertBefore(searchResultsDiv, jobsSection);
    
    // Scroll to results
    searchResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Apply for Job
function applyJob() {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        alert('Please login to apply for jobs');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(currentUser);
    if (user.userType !== 'jobseeker') {
        alert('Only job seekers can apply for jobs');
        return;
    }

    // Check if already applied
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    const alreadyApplied = applications.some(app => 
        app.userId === user.id && 
        app.jobTitle === window.currentJobData.title &&
        app.company === window.currentJobData.company
    );

    if (alreadyApplied) {
        alert('You have already applied for this job');
        return;
    }

    // Save complete application with all job details
    const application = {
        id: Date.now(),
        userId: user.id,
        jobTitle: window.currentJobData.title,
        company: window.currentJobData.company,
        location: window.currentJobData.location,
        salary: window.currentJobData.salary,
        type: window.currentJobData.type,
        mode: window.currentJobData.mode,
        description: window.currentJobData.description,
        appliedDate: new Date().toLocaleDateString(),
        status: 'pending'
    };
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    alert('Application submitted! You can view your applications in your dashboard.');
    closeJobModal();
}

// Open Job Modal
function openJobModal(jobTitle, company, location, salary, description, jobType = 'Full-time', workMode = 'On-site') {
    const modal = document.getElementById('jobModal');
    document.getElementById('modalJobTitle').textContent = jobTitle;
    document.getElementById('modalCompany').textContent = company;
    document.getElementById('modalLocation').textContent = location;
    document.getElementById('modalSalary').textContent = salary;
    document.getElementById('modalDescription').textContent = description;
    
    // Store current job data
    window.currentJobData = {
        title: jobTitle,
        company: company,
        location: location,
        salary: salary,
        type: jobType,
        mode: workMode,
        description: description
    };
    
    modal.classList.add('show');
}

// Close Job Modal
function closeJobModal() {
    const modal = document.getElementById('jobModal');
    modal.classList.remove('show');
    window.currentJobData = null;
}

// Submit Job Application
function submitJobApplication() {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        alert('Please login to apply for jobs');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(currentUser);
    if (user.userType !== 'jobseeker') {
        alert('Only job seekers can apply for jobs');
        return;
    }

    // Save application
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    const application = {
        id: Date.now(),
        userId: user.id,
        jobTitle: window.currentJobData.title,
        company: window.currentJobData.company,
        appliedDate: new Date().toLocaleDateString(),
        status: 'pending'
    };
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    alert('Application submitted successfully! We will review it and contact you soon.');
    closeJobModal();
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('jobModal');
    if (event.target == modal) {
        closeJobModal();
    }
}

// Demo: Create sample users for testing
function createDemoUsers() {
    if (!localStorage.getItem('users')) {
        const demoUsers = [
            {
                id: 1,
                fullname: 'John Doe',
                email: 'john@example.com',
                phone: '9876543210',
                password: 'password123',
                userType: 'jobseeker',
                registeredDate: '2026-01-15'
            },
            {
                id: 2,
                fullname: 'Tech Solutions Inc',
                email: 'jobs@techsolutions.com',
                phone: '9876543211',
                password: 'password123',
                userType: 'employer',
                registeredDate: '2026-01-10'
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
}

// Initialize demo users
createDemoUsers();
