const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const switchToSignUp = document.getElementById("switch-to-signup");

// Switch to Sign Up form
registerBtn.addEventListener('click', function () {
    container.classList.add("active");
});

// Switch to Sign In form
loginBtn.addEventListener('click', function () {
    container.classList.remove("active");
});

// Switch to Sign Up form when "Sign Up" link is clicked
switchToSignUp.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    container.classList.add("active"); // Switch to the Sign Up form
});

// Get the Sign Up form
const signUpForm = document.querySelector(".sign-up form");

// Add an event listener for Sign Up form submission
signUpForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the name, email, and password values
    const name = signUpForm.querySelector("input[type='text']").value;
    const email = signUpForm.querySelector("input[type='email']").value;
    const password = signUpForm.querySelector("input[type='password']").value;

    // Validate the fields
    if (!name || !email || !password) {
        alert("Please fill out all fields to sign up."); // Show an error message
        return;
    }

    // Check if the email is already registered
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const isUserRegistered = users.some(user => user.email === email);

    if (isUserRegistered) {
        alert("This email is already registered. Please sign in."); // Show an error message
        return;
    }

    // Store the user data in local storage
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Sign up successful! Please sign in."); // Show a success message
    container.classList.remove("active"); // Switch to the Sign In form
});

// Get the Sign In form
const signInForm = document.getElementById("signin-form");

// Add an event listener for Sign In form submission
signInForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the email and password values
    const email = signInForm.querySelector("input[type='email']").value;
    const password = signInForm.querySelector("input[type='password']").value;

    // Validate the fields
    if (!email || !password) {
        alert("Please enter your email and password to sign in."); // Show an error message
        return;
    }

    // Check if the user is registered
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Redirect to the homepage after successful sign-in
        window.location.href = "Homepage.html"; // Redirect to Homepage.html
    } else {
        alert("Invalid email or password. Please sign up if you don't have an account."); // Show an error message
    }
});