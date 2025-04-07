// Utility functions
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

const formatPercentage = (percentage) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(percentage / 100);
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const showModal = (modalId) => {
    document.getElementById(modalId).classList.add('active');
};

const hideModal = (modalId) => {
    document.getElementById(modalId).classList.remove('active');
};

const showLoading = () => {
    document.getElementById('loadingOverlay').style.display = 'flex';
};

const hideLoading = () => {
    document.getElementById('loadingOverlay').style.display = 'none';
};

// Error handling
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
};