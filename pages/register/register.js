// Registration page functionality
import { registerUser } from '../../firebase/firebase.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
// Firebase config (same as in firebase/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyCc38FFnM7Xc7xFOoffrnEsQ3DJexchl8s",
  authDomain: "daily-task-manager-24d82.firebaseapp.com",
  projectId: "daily-task-manager-24d82",
  storageBucket: "daily-task-manager-24d82.appspot.com",
  messagingSenderId: "399990159546",
  appId: "1:399990159546:web:918bc96a0c138279906a83"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/dashboard";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const strengthMsg = document.getElementById('strength-msg');
  const registerBtn = document.getElementById('registerBtn');

  // Check if user is already logged in
  const token = localStorage.getItem('authToken');
  if (token) {
    window.location.href = '/dashboard';
    return;
  }

  // Password strength checker
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    updatePasswordStrength(strength);
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!name || !email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength === 'weak') {
      showMessage('Password is too weak. Please choose a stronger password.', 'error');
      return;
    }

    try {
      registerBtn.disabled = true;
      registerBtn.textContent = 'Creating Account...';

      const user = await registerUser(email, password, name);
      
      // Get the ID token
      const token = await user.getIdToken();
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      showMessage('Account created successfully! Redirecting...', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Registration is currently disabled.';
          break;
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = 'Create Account';
    }
  });

  function checkPasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  function updatePasswordStrength(strength) {
    const strengthBar = document.querySelector('.password-strength');
    
    // Remove existing classes
    strengthBar.className = 'password-strength';
    
    switch (strength) {
      case 'weak':
        strengthBar.classList.add('strength-weak-bg');
        strengthMsg.textContent = 'Weak password';
        strengthMsg.className = 'strength-weak';
        break;
      case 'medium':
        strengthBar.classList.add('strength-medium-bg');
        strengthMsg.textContent = 'Medium strength password';
        strengthMsg.className = 'strength-medium';
        break;
      case 'strong':
        strengthBar.classList.add('strength-strong-bg');
        strengthMsg.textContent = 'Strong password';
        strengthMsg.className = 'strength-strong';
        break;
    }
  }

  function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert after form
    registerForm.insertAdjacentElement('afterend', messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add some basic validation
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && !isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
    }
  });
});
