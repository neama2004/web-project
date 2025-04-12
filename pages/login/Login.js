// DOM Elements
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const switchToSignUp = document.getElementById("switch-to-signup");
const signUpForm = document.querySelector(".sign-up form");
const signInForm = document.getElementById("signin-form");

// Toggle between Sign Up and Sign In forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

switchToSignUp.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
});

// Sign Up Functionality
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form values
    const name = signUpForm.querySelector("input[type='text']").value.trim();
    const email = signUpForm.querySelector("input[type='email']").value.trim();
    const password = signUpForm.querySelector("input[type='password']").value.trim();

    // Validate inputs
    if (!name || !email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
        alert("This email is already registered. Please sign in.");
        return;
    }

    // Create new user
    const newUser = {
        name,
        email,
        password,
        joinDate: new Date().toISOString()
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message and switch to sign in
    alert("Account created successfully! Please sign in.");
    signUpForm.reset();
    container.classList.remove("active");
});

// Sign In Functionality (with Homepage redirect)
signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form values
    const email = signInForm.querySelector("input[type='email']").value.trim();
    const password = signInForm.querySelector("input[type='password']").value.trim();

    // Validate inputs
    if (!email || !password) {
        alert("Please enter both email and password!");
        return;
    }

    // Check credentials
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );

    if (user) {
        // Store current user in session
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        
        // Redirect to homepage
        window.location.href = "../home/Homepage.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
});

// Dark Mode Toggle (if exists on page)
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        // Save preference to localStorage
        localStorage.setItem('darkMode', this.checked);
    });

    // Check for saved dark mode preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}