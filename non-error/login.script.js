// DOM Elements
const loginForm = document.getElementById('loginForm');
const createSuperuserBtn = document.getElementById('createSuperuserBtn');
const createSuperuserModal = document.getElementById('createSuperuserModal');
const closeModal = document.getElementById('closeModal');
const superuserForm = document.getElementById('superuserForm');
const successMessage = document.getElementById('successMessage');

// Simulated user database (will be replaced by Django backend)
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        email: 'admin@esmart.edu',
        role: 'superuser',
        first_name: 'System',
        last_name: 'Administrator',
        is_active: true,
        date_joined: '2024-01-01'
    },
    {
        id: 2,
        username: 'teacher1',
        password: 'teacher123',
        email: 'teacher1@esmart.edu',
        role: 'teacher',
        first_name: 'John',
        last_name: 'Smith',
        is_active: true,
        date_joined: '2024-01-15'
    },
    {
        id: 3,
        username: 'staff1',
        password: 'staff123',
        email: 'staff1@esmart.edu',
        role: 'staff',
        first_name: 'Jane',
        last_name: 'Doe',
        is_active: true,
        date_joined: '2024-02-01'
    }
];

// Authentication functions (will be replaced by Django API calls)
function authenticateUser(username, password) {
    const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.is_active
    );
    return user || null;
}

function createUser(userData) {
    const newUser = {
        id: users.length + 1,
        username: userData.username,
        password: userData.password,
        email: userData.email || '',
        role: 'staff',
        first_name: '',
        last_name: '',
        is_active: true,
        date_joined: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    return newUser;
}

// Login Form Handler
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Authenticate user
    const user = authenticateUser(username, password);
    
    if (user) {
        // Set login session with user data
        sessionStorage.setItem('eaccess_logged_in', 'true');
        sessionStorage.setItem('eaccess_user', JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name
        }));
        showSuccessMessage();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showErrorMessage('Invalid username or password');
    }
});

// Create Superuser Modal
createSuperuserBtn.addEventListener('click', function() {
    createSuperuserModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', function() {
    createSuperuserModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
createSuperuserModal.addEventListener('click', function(e) {
    if (e.target === createSuperuserModal) {
        createSuperuserModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Superuser Form Handler
superuserForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('superUsername').value;
    const email = document.getElementById('superEmail').value;
    const password = document.getElementById('superPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!username || !password || !confirmPassword) {
        showErrorMessage('Please fill in all required fields');
        return;
    }
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showErrorMessage('Username already exists');
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showErrorMessage('Password must be at least 6 characters long');
        return;
    }
    
    // Create new user
    const newUser = createUser({
        username: username,
        email: email,
        password: password
    });
    
    showSuccessMessage('Superuser created successfully!');
    createSuperuserModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    superuserForm.reset();
});

// Success Message
function showSuccessMessage(message = 'Login successful! Redirecting to dashboard...') {
    const successContent = successMessage.querySelector('.success-content span');
    successContent.textContent = message;
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Error Message
function showErrorMessage(message) {
    // Create error message element if it doesn't exist
    let errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span></span>
            </div>
        `;
        document.body.appendChild(errorMessage);
        
        // Add error message styles
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, #f44336 0%, #e57373 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(244, 67, 54, 0.3);
                z-index: 1001;
                animation: slideIn 0.3s ease;
                display: none;
            }
            
            .error-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
    
    const errorContent = errorMessage.querySelector('.error-content span');
    errorContent.textContent = message;
    errorMessage.style.display = 'block';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Input animations
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape' && createSuperuserModal.style.display === 'block') {
        createSuperuserModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Auto-focus username field on page load
window.addEventListener('load', function() {
    document.getElementById('username').focus();
});

// Demo hint with multiple user credentials
setTimeout(() => {
    if (!document.querySelector('.demo-hint')) {
        const hint = document.createElement('div');
        hint.className = 'demo-hint';
        hint.innerHTML = `
            <div class="hint-content">
                <i class="fas fa-info-circle"></i>
                <div class="hint-text">
                    <div><strong>Demo Logins:</strong></div>
                    <div>Admin: admin / admin123</div>
                    <div>Teacher: teacher1 / teacher123</div>
                    <div>Staff: staff1 / staff123</div>
                </div>
                <button class="hint-close">&times;</button>
            </div>
        `;
        document.body.appendChild(hint);
        
        // Add hint styles
        const style = document.createElement('style');
        style.textContent = `
            .demo-hint {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(103, 33, 243, 0.3);
                z-index: 1001;
                animation: slideUp 0.3s ease;
                max-width: 250px;
            }
            
            .hint-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                font-size: 0.85rem;
            }
            
            .hint-text {
                flex: 1;
                line-height: 1.4;
            }
            
            .hint-text div:first-child {
                margin-bottom: 0.25rem;
            }
            
            .hint-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background-color 0.3s ease;
                flex-shrink: 0;
            }
            
            .hint-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .demo-hint {
                    left: 1rem;
                    right: 1rem;
                    bottom: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Close hint
        hint.querySelector('.hint-close').addEventListener('click', function() {
            hint.remove();
        });
        
        // Auto-hide hint after 10 seconds
        setTimeout(() => {
            if (hint.parentElement) {
                hint.remove();
            }
        }, 10000);
    }
}, 2000);