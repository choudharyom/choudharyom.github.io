class AuthService {
    constructor() {
        this.currentUser = null;
        this.initializeAuth();
        this.initializeEventListeners();
    }

    initializeAuth() {
        // Check for existing session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIState();
        }
    }

    initializeEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login(
                document.getElementById('loginEmail').value,
                document.getElementById('loginPassword').value
            );
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register(
                document.getElementById('registerUsername').value,
                document.getElementById('registerEmail').value,
                document.getElementById('registerPassword').value,
                document.getElementById('confirmPassword').value
            );
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Modal navigation
        document.getElementById('showRegisterModal').addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('loginModal');
            showModal('registerModal');
        });

        document.getElementById('showLoginModal').addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('registerModal');
            showModal('loginModal');
        });

        // Login/Register buttons in header
        document.getElementById('loginBtn').addEventListener('click', () => {
            showModal('loginModal');
        });

        document.getElementById('registerBtn').addEventListener('click', () => {
            showModal('registerModal');
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                hideModal(modal.id);
            });
        });
    }

    async login(email, password) {
        try {
            // In a real app, this would be an API call
            // For demo, we'll simulate authentication
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === this.hashPassword(password));

            if (user) {
                this.currentUser = {
                    username: user.username,
                    email: user.email
                };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.updateUIState();
                hideModal('loginModal');
                this.clearForms();
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            showError(error.message);
        }
    }

    async register(username, email, password, confirmPassword) {
        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // In a real app, this would be an API call
            // For demo, we'll store in localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            const newUser = {
                username,
                email,
                password: this.hashPassword(password)
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto login after registration
            this.currentUser = {
                username: newUser.username,
                email: newUser.email
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            this.updateUIState();
            hideModal('registerModal');
            this.clearForms();
        } catch (error) {
            showError(error.message);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUIState();
    }

    updateUIState() {
        const authContainer = document.querySelector('.auth-container');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userMenu = document.getElementById('userMenu');
        const username = document.getElementById('username');

        if (this.currentUser) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            username.textContent = this.currentUser.username;
        } else {
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            userMenu.style.display = 'none';
        }
    }

    clearForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
    }

    // Simple hash function for demo purposes
    // In a real app, use a proper password hashing algorithm
    hashPassword(password) {
        return btoa(password); // Base64 encoding for demo only
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth service
document.addEventListener('DOMContentLoaded', () => {
    const authService = new AuthService();
    window.authService = authService; // Make it globally available
});