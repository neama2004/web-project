// ===================== Switch Between Login and Register =====================
function switchToRegister() {
    const leftSide = document.querySelector(".left-side");
    const rightSide = document.querySelector(".right-side");
    leftSide.style.transform = "translateX(-100%)";
    rightSide.style.transform = "translateX(-100%)";
}

function switchToLogin() {
    const leftSide = document.querySelector(".left-side");
    const rightSide = document.querySelector(".right-side");
    leftSide.style.transform = "translateX(0)";
    rightSide.style.transform = "translateX(0)";
}

// ===================== Password Visibility Toggle =====================
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.nextElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "👁️";
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "👁️";
    }
}

// ===================== Login Form Validation =====================
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const rememberMe = document.getElementById("remember-me").checked;
    const errorMessage = document.getElementById("login-error");
    const loginButton = document.getElementById("login-button");

    // Clear previous error message
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    // Simple validation
    if (!email || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        errorMessage.style.display = "block";
        return;
    }

    // Simulate a loading state
    loginButton.classList.add("loading");

    // Simulate a network request with a delay
    setTimeout(() => {
        // Simulate a successful login
        if (email === "user@example.com" && password === "password123") {
            // Save user data to localStorage if "Remember me" is checked
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            // Set login status
            localStorage.setItem("isLoggedIn", "true");

            // Redirect to homepage
            window.location.href = "index.html";
        } else {
            errorMessage.textContent = "Invalid email or password. Please try again.";
            errorMessage.style.display = "block";
        }

        // Reset the button state
        loginButton.classList.remove("loading");
    }, 2000); // Simulate a 2-second delay
});

// ===================== Register Form Validation =====================
document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("register-error");
    const registerButton = document.getElementById("register-button");

    // Clear previous error message
    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
        errorMessage.textContent = "Please fill in all fields.";
        errorMessage.style.display = "block";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        errorMessage.style.display = "block";
        return;
    }

    // Simulate a loading state
    registerButton.classList.add("loading");

    // Simulate a network request with a delay
    setTimeout(() => {
        // Simulate a successful registration
        alert("Registration successful! Redirecting to the homepage...");

        // Set login status
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to homepage
        window.location.href = "index.html";

        // Reset the button state
        registerButton.classList.remove("loading");
    }, 2000); // Simulate a 2-second delay
});

// ===================== Remember Me Functionality =====================
window.addEventListener("load", () => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        document.getElementById("login-email").value = rememberedEmail;
        document.getElementById("remember-me").checked = true;
    }
});