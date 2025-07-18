// Global variables
let students = JSON.parse(localStorage.getItem('eaccess_students') || '[]');
let logs = JSON.parse(localStorage.getItem('eaccess_logs') || '[]');
let courses = JSON.parse(localStorage.getItem('eaccess_courses') || '[]');
let studentCourses = JSON.parse(localStorage.getItem('eaccess_student_courses') || '[]');
let currentStudent = null;
let editingStudent = null;
let editingCourse = null;
let currentStudentIndex = 0;
let pieChart = null;
let barChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in - redirect to login if not
    const isLoggedIn = sessionStorage.getItem('eaccess_logged_in');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize demo courses if none exist
    if (courses.length === 0) {
        courses = [
            { id: Date.now().toString(), code: 'CSC101', title: 'Introduction to Computer Science', credits: 3, department: 'Computer Science' },
            { id: (Date.now() + 1).toString(), code: 'MTH101', title: 'Calculus I', credits: 4, department: 'Mathematics' },
            { id: (Date.now() + 2).toString(), code: 'PHY101', title: 'Physics I', credits: 3, department: 'Physics' },
            { id: (Date.now() + 3).toString(), code: 'CHM101', title: 'General Chemistry', credits: 3, department: 'Chemistry' },
            { id: (Date.now() + 4).toString(), code: 'ENG101', title: 'English Composition', credits: 2, department: 'English' }
        ];
        saveCourses();
    }

    // Initialize the app
    updateStudentCount();
    renderStudents();
    renderCourses();
    renderLogs();
    updateLogStats();
    loadStudentSelect();
    updateAnalytics();
    
    console.log('e-Access School Management System initialized successfully!');
});

// Tab Management
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected nav tab
    const clickedTab = Array.from(navTabs).find(tab => 
        tab.onclick?.toString().includes(tabName)
    );
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Special handling for specific tabs
    if (tabName === 'profile' && currentStudent) {
        renderStudentProfile(currentStudent);
    } else if (tabName === 'analytics') {
        updateAnalytics();
    }
}

// Student Management Functions
function openStudentForm(student = null) {
    editingStudent = student;
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (student) {
        modalTitle.textContent = 'Edit Student';
        submitBtn.textContent = 'Update Student';
        populateForm(student);
    } else {
        modalTitle.textContent = 'Add New Student';
        submitBtn.textContent = 'Add Student';
        clearForm();
    }
    
    modal.classList.add('active');
}

function closeStudentForm() {
    const modal = document.getElementById('studentModal');
    modal.classList.remove('active');
    clearForm();
    editingStudent = null;
}

function populateForm(student) {
    document.getElementById('fullName').value = student.fullName;
    document.getElementById('matricNo').value = student.matricNo;
    document.getElementById('phoneNo').value = student.phoneNo;
    document.getElementById('email').value = student.email;
    document.getElementById('cardNo').value = student.cardNo;
    
    if (student.photo) {
        const photoPreview = document.getElementById('photoPreview');
        photoPreview.innerHTML = `<img src="${student.photo}" alt="Student Photo">`;
        document.getElementById('removePhotoBtn').style.display = 'inline-flex';
    }
}

function clearForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('photoPreview').innerHTML = '<i class="fas fa-camera"></i>';
    document.getElementById('removePhotoBtn').style.display = 'none';
    clearErrors();
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.classList.remove('show'));
    
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('error'));
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    field.parentElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function validateForm() {
    clearErrors();
    let isValid = true;
    
    const fullName = document.getElementById('fullName').value.trim();
    const matricNo = document.getElementById('matricNo').value.trim();
    const phoneNo = document.getElementById('phoneNo').value.trim();
    const email = document.getElementById('email').value.trim();
    const cardNo = document.getElementById('cardNo').value.trim();
    
    if (!fullName) {
        showError('fullName', 'Full name is required');
        isValid = false;
    }
    
    if (!matricNo) {
        showError('matricNo', 'Matric number is required');
        isValid = false;
    } else if (matricNo.length < 3) {
        showError('matricNo', 'Matric number must be at least 3 characters');
        isValid = false;
    }
    
    if (!phoneNo) {
        showError('phoneNo', 'Phone number is required');
        isValid = false;
    } else if (!/^\+?[\d\s-()]{10,15}$/.test(phoneNo)) {
        showError('phoneNo', 'Invalid phone number format');
        isValid = false;
    }
    
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Invalid email format');
        isValid = false;
    }
    
    if (!cardNo) {
        showError('cardNo', 'Card number is required');
        isValid = false;
    } else if (cardNo.length < 3) {
        showError('cardNo', 'Card number must be at least 3 characters');
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        matricNo: document.getElementById('matricNo').value.trim(),
        phoneNo: document.getElementById('phoneNo').value.trim(),
        email: document.getElementById('email').value.trim(),
        cardNo: document.getElementById('cardNo').value.trim(),
        photo: document.getElementById('photoPreview').querySelector('img')?.src || ''
    };
    
    if (editingStudent) {
        // Update existing student
        const index = students.findIndex(s => s.id === editingStudent.id);
        students[index] = {
            ...editingStudent,
            ...formData,
            updatedAt: new Date().toISOString()
        };
        addLog(editingStudent.id, formData.fullName, 'Profile Updated', 'Student information was modified');
        showSuccess('Student updated successfully!');
    } else {
        // Add new student
        const newStudent = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        students.push(newStudent);
        addLog(newStudent.id, formData.fullName, 'Student Registered', 'New student added to the system');
        showSuccess('Student added successfully!');
    }
    
    saveStudents();
    renderStudents();
    updateStudentCount();
    loadStudentSelect();
    updateAnalytics();
    closeStudentForm();
});

// Photo upload handling
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Photo size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoPreview = document.getElementById('photoPreview');
            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Student Photo">`;
            document.getElementById('removePhotoBtn').style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    document.getElementById('photoPreview').innerHTML = '<i class="fas fa-camera"></i>';
    document.getElementById('photoInput').value = '';
    document.getElementById('removePhotoBtn').style.display = 'none';
}

// Render functions
function renderStudents() {
    const studentsGrid = document.getElementById('studentsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (students.length === 0) {
        studentsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    studentsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    studentsGrid.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-header">
                ${student.photo ? 
                    `<img src="${student.photo}" alt="${student.fullName}" class="student-photo">` :
                    `<div class="student-photo-placeholder"><i class="fas fa-user"></i></div>`
                }
                <div class="student-info">
                    <h3>${student.fullName}</h3>
                    <p>${student.matricNo}</p>
                </div>
            </div>
            <div class="student-details">
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${student.phoneNo}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${student.email}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-credit-card"></i>
                    <span>${student.cardNo}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-primary" onclick="viewProfile('${student.id}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="btn btn-secondary" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm) ||
        student.matricNo.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
    );
    
    const studentsGrid = document.getElementById('studentsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredStudents.length === 0) {
        studentsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No students found</h3>
            <p>Try adjusting your search terms</p>
        `;
        return;
    }
    
    studentsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    studentsGrid.innerHTML = filteredStudents.map(student => `
        <div class="student-card">
            <div class="student-header">
                ${student.photo ? 
                    `<img src="${student.photo}" alt="${student.fullName}" class="student-photo">` :
                    `<div class="student-photo-placeholder"><i class="fas fa-user"></i></div>`
                }
                <div class="student-info">
                    <h3>${student.fullName}</h3>
                    <p>${student.matricNo}</p>
                </div>
            </div>
            <div class="student-details">
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${student.phoneNo}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${student.email}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-credit-card"></i>
                    <span>${student.cardNo}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-primary" onclick="viewProfile('${student.id}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="btn btn-secondary" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Student actions
function viewProfile(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        currentStudent = student;
        currentStudentIndex = students.findIndex(s => s.id === studentId);
        addLog(studentId, student.fullName, 'Profile Viewed', 'Student profile was accessed');
        showTab('profile');
        renderStudentProfile(student);
    }
}

function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        openStudentForm(student);
    }
}

function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student && confirm(`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`)) {
        students = students.filter(s => s.id !== studentId);
        // Remove student course registrations
        studentCourses = studentCourses.filter(sc => sc.studentId !== studentId);
        
        addLog(studentId, student.fullName, 'Student Deleted', 'Student record was removed from the system');
        saveStudents();
        saveStudentCourses();
        renderStudents();
        updateStudentCount();
        loadStudentSelect();
        updateAnalytics();
        showSuccess('Student deleted successfully!');
        
        if (currentStudent && currentStudent.id === studentId) {
            currentStudent = null;
            document.getElementById('profileContent').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user"></i>
                    <h3>No Student Selected</h3>
                    <p>Select a student from the Students tab to view their profile</p>
                </div>
            `;
        }
    }
}

// Profile rendering
function renderStudentProfile(student) {
    const profileContent = document.getElementById('profileContent');
    
    profileContent.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-nav">
                    ${students.length > 1 ? `
                        <button class="btn" onclick="previousStudent()">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span style="color: white; font-size: 0.875rem;">
                            ${currentStudentIndex + 1} of ${students.length}
                        </span>
                        <button class="btn" onclick="nextStudent()">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    ` : ''}
                    <button class="btn" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                        Edit Profile
                    </button>
                </div>
                <div class="profile-main">
                    ${student.photo ? 
                        `<img src="${student.photo}" alt="${student.fullName}" class="profile-photo">` :
                        `<div class="profile-photo-placeholder"><i class="fas fa-user"></i></div>`
                    }
                    <div class="profile-info">
                        <h1>${student.fullName}</h1>
                        <p>${student.matricNo}</p>
                    </div>
                </div>
            </div>
            <div class="profile-content">
                <div class="profile-sections">
                    <div class="profile-section">
                        <h3>Contact Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-icon email">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="info-details">
                                    <h4>Email Address</h4>
                                    <p>${student.email}</p>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-icon phone">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="info-details">
                                    <h4>Phone Number</h4>
                                    <p>${student.phoneNo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="profile-section">
                        <h3>Academic Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-icon matric">
                                    <i class="fas fa-hashtag"></i>
                                </div>
                                <div class="info-details">
                                    <h4>Matric Number</h4>
                                    <p>${student.matricNo}</p>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-icon card">
                                    <i class="fas fa-credit-card"></i>
                                </div>
                                <div class="info-details">
                                    <h4>Student Card Number</h4>
                                    <p>${student.cardNo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h3>Registration Information</h3>
                    <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                        <div class="info-item">
                            <div class="info-icon date">
                                <i class="fas fa-calendar"></i>
                            </div>
                            <div class="info-details">
                                <h4>Registration Date</h4>
                                <p>${new Date(student.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-icon date">
                                <i class="fas fa-calendar"></i>
                            </div>
                            <div class="info-details">
                                <h4>Last Updated</h4>
                                <p>${new Date(student.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-section">
                    <h3>Registered Courses</h3>
                    <div class="registered-courses">
                        ${getStudentCourses(student.id).map(course => `
                            <div class="registered-course">
                                <div class="registered-course-info">
                                    <div class="registered-course-code">${course.code}</div>
                                    <div class="registered-course-title">${course.title}</div>
                                </div>
                                <div class="course-credits">${course.credits} credits</div>
                            </div>
                        `).join('') || '<p style="color: #718096;">No courses registered</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function previousStudent() {
    if (students.length > 1) {
        currentStudentIndex = currentStudentIndex > 0 ? currentStudentIndex - 1 : students.length - 1;
        currentStudent = students[currentStudentIndex];
        renderStudentProfile(currentStudent);
        addLog(currentStudent.id, currentStudent.fullName, 'Profile Viewed', 'Student profile was accessed');
    }
}

function nextStudent() {
    if (students.length > 1) {
        currentStudentIndex = currentStudentIndex < students.length - 1 ? currentStudentIndex + 1 : 0;
        currentStudent = students[currentStudentIndex];
        renderStudentProfile(currentStudent);
        addLog(currentStudent.id, currentStudent.fullName, 'Profile Viewed', 'Student profile was accessed');
    }
}

// Course Management Functions
function openCourseForm(course = null) {
    editingCourse = course;
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('courseModalTitle');
    const submitBtn = document.getElementById('courseSubmitBtn');
    
    if (course) {
        modalTitle.textContent = 'Edit Course';
        submitBtn.textContent = 'Update Course';
        populateCourseForm(course);
    } else {
        modalTitle.textContent = 'Add New Course';
        submitBtn.textContent = 'Add Course';
        clearCourseForm();
    }
    
    modal.classList.add('active');
}

function closeCourseForm() {
    const modal = document.getElementById('courseModal');
    modal.classList.remove('active');
    clearCourseForm();
    editingCourse = null;
}

function populateCourseForm(course) {
    document.getElementById('courseCode').value = course.code;
    document.getElementById('courseTitle').value = course.title;
    document.getElementById('credits').value = course.credits;
    document.getElementById('department').value = course.department;
}

function clearCourseForm() {
    document.getElementById('courseForm').reset();
    clearCourseErrors();
}

function clearCourseErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.classList.remove('show'));
    
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('error'));
}

function validateCourseForm() {
    clearCourseErrors();
    let isValid = true;
    
    const courseCode = document.getElementById('courseCode').value.trim();
    const courseTitle = document.getElementById('courseTitle').value.trim();
    const credits = document.getElementById('credits').value.trim();
    const department = document.getElementById('department').value.trim();
    
    if (!courseCode) {
        showError('courseCode', 'Course code is required');
        isValid = false;
    }
    
    if (!courseTitle) {
        showError('courseTitle', 'Course title is required');
        isValid = false;
    }
    
    if (!credits || credits < 1 || credits > 6) {
        showError('credits', 'Credits must be between 1 and 6');
        isValid = false;
    }
    
    if (!department) {
        showError('department', 'Department is required');
        isValid = false;
    }
    
    return isValid;
}

// Handle course form submission
document.getElementById('courseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateCourseForm()) {
        return;
    }
    
    const formData = {
        code: document.getElementById('courseCode').value.trim(),
        title: document.getElementById('courseTitle').value.trim(),
        credits: parseInt(document.getElementById('credits').value.trim()),
        department: document.getElementById('department').value.trim()
    };
    
    if (editingCourse) {
        // Update existing course
        const index = courses.findIndex(c => c.id === editingCourse.id);
        courses[index] = {
            ...editingCourse,
            ...formData
        };
        addLog('system', 'System', 'Course Updated', `Course ${formData.code} was modified`);
        showSuccess('Course updated successfully!');
    } else {
        // Add new course
        const newCourse = {
            id: Date.now().toString(),
            ...formData
        };
        courses.push(newCourse);
        addLog('system', 'System', 'Course Added', `Course ${formData.code} was added`);
        showSuccess('Course added successfully!');
    }
    
    saveCourses();
    renderCourses();
    updateAnalytics();
    closeCourseForm();
});

function renderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    const emptyState = document.getElementById('coursesEmptyState');
    
    if (courses.length === 0) {
        coursesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    coursesGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-header">
                <span class="course-code">${course.code}</span>
                <span class="course-credits">${course.credits} credits</span>
            </div>
            <div class="course-title">${course.title}</div>
            <div class="course-department">${course.department}</div>
            <div class="course-actions">
                <button class="btn btn-primary" onclick="registerCourse('${course.id}')">
                    <i class="fas fa-plus"></i>
                    Register
                </button>
                <button class="btn btn-secondary" onclick="editCourse('${course.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteCourse('${course.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function editCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        openCourseForm(course);
    }
}

function deleteCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course && confirm(`Are you sure you want to delete ${course.code}? This action cannot be undone.`)) {
        courses = courses.filter(c => c.id !== courseId);
        // Remove course registrations
        studentCourses = studentCourses.filter(sc => sc.courseId !== courseId);
        
        addLog('system', 'System', 'Course Deleted', `Course ${course.code} was removed`);
        saveCourses();
        saveStudentCourses();
        renderCourses();
        loadStudentCourses();
        updateAnalytics();
        showSuccess('Course deleted successfully!');
    }
}

function registerCourse(courseId) {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) {
        alert('Please select a student first');
        return;
    }
    
    const course = courses.find(c => c.id === courseId);
    const student = students.find(s => s.id === studentId);
    
    if (course && student) {
        // Check if already registered
        const existingRegistration = studentCourses.find(sc => 
            sc.studentId === studentId && sc.courseId === courseId
        );
        
        if (existingRegistration) {
            alert('Student is already registered for this course');
            return;
        }
        
        const newRegistration = {
            id: Date.now().toString(),
            studentId: studentId,
            courseId: courseId,
            registeredAt: new Date().toISOString()
        };
        
        studentCourses.push(newRegistration);
        addLog(studentId, student.fullName, 'Course Registered', `Registered for ${course.code} - ${course.title}`);
        saveStudentCourses();
        loadStudentCourses();
        updateAnalytics();
        showSuccess(`${student.fullName} registered for ${course.code} successfully!`);
    }
}

function loadStudentSelect() {
    const studentSelect = document.getElementById('studentSelect');
    studentSelect.innerHTML = '<option value="">Select a student...</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.fullName} (${student.matricNo})`;
        studentSelect.appendChild(option);
    });
}

function loadStudentCourses() {
    const studentId = document.getElementById('studentSelect').value;
    const registeredCoursesDiv = document.getElementById('registeredCourses');
    
    if (!studentId) {
        registeredCoursesDiv.innerHTML = '<p style="color: #718096;">Select a student to view registered courses</p>';
        return;
    }
    
    const studentRegistrations = studentCourses.filter(sc => sc.studentId === studentId);
    
    if (studentRegistrations.length === 0) {
        registeredCoursesDiv.innerHTML = '<p style="color: #718096;">No courses registered for this student</p>';
        return;
    }
    
    registeredCoursesDiv.innerHTML = studentRegistrations.map(registration => {
        const course = courses.find(c => c.id === registration.courseId);
        if (!course) return '';
        
        return `
            <div class="registered-course">
                <div class="registered-course-info">
                    <div class="registered-course-code">${course.code}</div>
                    <div class="registered-course-title">${course.title}</div>
                </div>
                <button class="btn btn-danger" onclick="dropCourse('${registration.id}')">
                    <i class="fas fa-times"></i>
                    Drop
                </button>
            </div>
        `;
    }).join('');
}

function dropCourse(registrationId) {
    const registration = studentCourses.find(sc => sc.id === registrationId);
    if (registration) {
        const course = courses.find(c => c.id === registration.courseId);
        const student = students.find(s => s.id === registration.studentId);
        
        if (course && student && confirm(`Are you sure you want to drop ${course.code} for ${student.fullName}?`)) {
            studentCourses = studentCourses.filter(sc => sc.id !== registrationId);
            addLog(registration.studentId, student.fullName, 'Course Dropped', `Dropped ${course.code} - ${course.title}`);
            saveStudentCourses();
            loadStudentCourses();
            updateAnalytics();
            showSuccess(`${course.code} dropped successfully!`);
        }
    }
}

function getStudentCourses(studentId) {
    const studentRegistrations = studentCourses.filter(sc => sc.studentId === studentId);
    return studentRegistrations.map(registration => {
        return courses.find(c => c.id === registration.courseId);
    }).filter(course => course !== undefined);
}

// Log management
function addLog(studentId, studentName, action, details = '') {
    const newLog = {
        id: Date.now().toString(),
        studentId,
        studentName,
        action,
        timestamp: new Date().toISOString(),
        details
    };
    logs.unshift(newLog);
    saveLogs();
    renderLogs();
    updateLogStats();
}

function renderLogs() {
    const activityLog = document.getElementById('activityLog');
    const logEmptyState = document.getElementById('logEmptyState');
    
    if (logs.length === 0) {
        activityLog.style.display = 'none';
        logEmptyState.style.display = 'block';
        return;
    }
    
    activityLog.style.display = 'block';
    logEmptyState.style.display = 'none';
    
    activityLog.innerHTML = logs.map(log => {
        const iconClass = getLogIconClass(log.action);
        return `
            <div class="log-item">
                <div class="log-icon ${iconClass}">
                    ${getLogIcon(log.action)}
                </div>
                <div class="log-content">
                    <div class="log-header">
                        <span class="log-action">${log.action}</span>
                        <span class="log-time">${new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="log-student">${log.studentName}</div>
                    ${log.details ? `<div class="log-details">${log.details}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getLogIcon(action) {
    switch (action) {
        case 'Student Registered':
            return '<i class="fas fa-user-plus"></i>';
        case 'Profile Updated':
            return '<i class="fas fa-edit"></i>';
        case 'Profile Viewed':
            return '<i class="fas fa-eye"></i>';
        case 'Student Deleted':
            return '<i class="fas fa-trash"></i>';
        case 'Course Registered':
            return '<i class="fas fa-book"></i>';
        case 'Course Dropped':
            return '<i class="fas fa-times"></i>';
        case 'Course Added':
            return '<i class="fas fa-plus"></i>';
        case 'Course Updated':
            return '<i class="fas fa-edit"></i>';
        case 'Course Deleted':
            return '<i class="fas fa-trash"></i>';
        default:
            return '<i class="fas fa-clock"></i>';
    }
}

function getLogIconClass(action) {
    switch (action) {
        case 'Student Registered':
        case 'Course Registered':
        case 'Course Added':
            return 'registered';
        case 'Profile Updated':
        case 'Course Updated':
            return 'updated';
        case 'Profile Viewed':
            return 'viewed';
        case 'Student Deleted':
        case 'Course Deleted':
        case 'Course Dropped':
            return 'deleted';
        default:
            return 'default';
    }
}

function filterLogs() {
    const searchTerm = document.getElementById('logSearch').value.toLowerCase();
    const actionFilter = document.getElementById('actionFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filteredLogs = logs.filter(log => {
        const matchesSearch = log.studentName.toLowerCase().includes(searchTerm) ||
                             log.action.toLowerCase().includes(searchTerm);
        
        const matchesAction = actionFilter === 'all' || log.action === actionFilter;
        
        const matchesDate = dateFilter === 'all' || (() => {
            const logDate = new Date(log.timestamp);
            const now = new Date();
            
            switch (dateFilter) {
                case 'today':
                    return logDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return logDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return logDate >= monthAgo;
                default:
                    return true;
            }
        })();
        
        return matchesSearch && matchesAction && matchesDate;
    });
    
    const activityLog = document.getElementById('activityLog');
    const logEmptyState = document.getElementById('logEmptyState');
    
    if (filteredLogs.length === 0) {
        activityLog.style.display = 'none';
        logEmptyState.style.display = 'block';
        logEmptyState.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No activities found</h3>
            <p>Try adjusting your filters to see more activities</p>
        `;
        return;
    }
    
    activityLog.style.display = 'block';
    logEmptyState.style.display = 'none';
    
    activityLog.innerHTML = filteredLogs.map(log => {
        const iconClass = getLogIconClass(log.action);
        return `
            <div class="log-item">
                <div class="log-icon ${iconClass}">
                    ${getLogIcon(log.action)}
                </div>
                <div class="log-content">
                    <div class="log-header">
                        <span class="log-action">${log.action}</span>
                        <span class="log-time">${new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="log-student">${log.studentName}</div>
                    ${log.details ? `<div class="log-details">${log.details}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Update stats for filtered logs
    updateLogStats(filteredLogs);
}

function updateLogStats(filteredLogs = logs) {
    document.getElementById('totalActivities').textContent = filteredLogs.length;
    document.getElementById('totalRegistrations').textContent = 
        filteredLogs.filter(log => log.action === 'Student Registered').length;
    document.getElementById('totalUpdates').textContent = 
        filteredLogs.filter(log => log.action === 'Profile Updated').length;
    document.getElementById('totalViews').textContent = 
        filteredLogs.filter(log => log.action === 'Profile Viewed').length;
}

function exportLogs() {
    const csvContent = [
        ['Timestamp', 'Student Name', 'Action', 'Details'],
        ...logs.map(log => [
            new Date(log.timestamp).toLocaleString(),
            log.studentName,
            log.action,
            log.details || ''
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccess('Activity log exported successfully!');
}

// Analytics functions
function updateAnalytics() {
    // Update stats
    document.getElementById('totalStudentsAnalytics').textContent = students.length;
    document.getElementById('totalCoursesAnalytics').textContent = courses.length;
    document.getElementById('activeRegistrations').textContent = studentCourses.length;
    
    const avgCourses = students.length > 0 ? 
        (studentCourses.length / students.length).toFixed(1) : 0;
    document.getElementById('avgCoursesPerStudent').textContent = avgCourses;
    
    // Update charts
    updatePieChart();
    updateBarChart();
}

function updatePieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (pieChart) {
        pieChart.destroy();
    }
    
    // Count activities by type
    const activityCounts = {};
    logs.forEach(log => {
        activityCounts[log.action] = (activityCounts[log.action] || 0) + 1;
    });
    
    const labels = Object.keys(activityCounts);
    const data = Object.values(activityCounts);
    const colors = [
        '#667eea', '#764ba2', '#48bb78', '#ed8936', '#4299e1', '#9f7aea'
    ];
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (barChart) {
        barChart.destroy();
    }
    
    // Group logs by month
    const monthlyData = {};
    logs.forEach(log => {
        const month = new Date(log.timestamp).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    const labels = Object.keys(monthlyData).slice(-6); // Last 6 months
    const data = labels.map(month => monthlyData[month] || 0);
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Activities',
                data: data,
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Data management
function exportData() {
    const exportData = {
        students: students,
        logs: logs,
        courses: courses,
        studentCourses: studentCourses,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eaccess-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccess('Data exported successfully!');
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.students) {
                    students = importedData.students;
                    saveStudents();
                    renderStudents();
                    updateStudentCount();
                    loadStudentSelect();
                }
                if (importedData.logs) {
                    logs = importedData.logs;
                    saveLogs();
                    renderLogs();
                    updateLogStats();
                }
                if (importedData.courses) {
                    courses = importedData.courses;
                    saveCourses();
                    renderCourses();
                }
                if (importedData.studentCourses) {
                    studentCourses = importedData.studentCourses;
                    saveStudentCourses();
                    loadStudentCourses();
                }
                
                updateAnalytics();
                showSuccess('Data imported successfully!');
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        students = [];
        logs = [];
        courses = [];
        studentCourses = [];
        currentStudent = null;
        
        localStorage.removeItem('eaccess_students');
        localStorage.removeItem('eaccess_logs');
        localStorage.removeItem('eaccess_courses');
        localStorage.removeItem('eaccess_student_courses');
        
        renderStudents();
        renderLogs();
        renderCourses();
        updateStudentCount();
        updateLogStats();
        loadStudentSelect();
        loadStudentCourses();
        updateAnalytics();
        
        document.getElementById('profileContent').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user"></i>
                <h3>No Student Selected</h3>
                <p>Select a student from the Students tab to view their profile</p>
            </div>
        `;
        
        showSuccess('All data has been cleared successfully!');
    }
}

// Utility functions
function updateStudentCount() {
    document.getElementById('studentCount').textContent = students.length;
}

function saveStudents() {
    localStorage.setItem('eaccess_students', JSON.stringify(students));
}

function saveLogs() {
    localStorage.setItem('eaccess_logs', JSON.stringify(logs));
}

function saveCourses() {
    localStorage.setItem('eaccess_courses', JSON.stringify(courses));
}

function saveStudentCourses() {
    localStorage.setItem('eaccess_student_courses', JSON.stringify(studentCourses));
}

function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    successText.textContent = message;
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all session data
        sessionStorage.removeItem('eaccess_logged_in');
        sessionStorage.removeItem('eaccess_user');
        
        // Show logout message
        showSuccess('Logged out successfully!');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}