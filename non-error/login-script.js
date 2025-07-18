// DOM Elements
const loginForm = document.getElementById('loginForm');
const createSuperuserBtn = document.getElementById('createSuperuserBtn');
const createSuperuserModal = document.getElementById('createSuperuserModal');
const closeModal = document.getElementById('closeModal');
const superuserForm = document.getElementById('superuserForm');
const successMessage = document.getElementById('successMessage');

// Demo credentials
const validCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Login Form Handler
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation for demo
    if (username === validCredentials.username && password === validCredentials.password) {
        // Set login session
        sessionStorage.setItem('eaccess_logged_in', 'true');
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
    
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showErrorMessage('Password must be at least 6 characters long');
        return;
    }
    
    // Simulate superuser creation
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

// Demo hint
setTimeout(() => {
    if (!document.querySelector('.demo-hint')) {
        const hint = document.createElement('div');
        hint.className = 'demo-hint';
        hint.innerHTML = `
            <div class="hint-content">
                <i class="fas fa-info-circle"></i>
                <span>Demo Login: admin / admin123</span>
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
                box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
                z-index: 1001;
                animation: slideUp 0.3s ease;
            }
            
            .hint-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
            }
            
            .hint-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background-color 0.3s ease;
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