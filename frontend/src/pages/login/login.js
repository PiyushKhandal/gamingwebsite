const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// Toggle between login and register forms
registerLink.onclick = () => {
    wrapper.classList.add('active');
};

loginLink.onclick = () => {
    wrapper.classList.remove('active');
};

// Login Form Submission (AJAX)
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Client-side validation
    if (!username || !password) {
        alert('Please fill in both fields.');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_name: username, user_password: password })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Show success message
            window.location.href = '/dashboard'; // Redirect to dashboard or another page
        } else {
            alert(result.error || 'An error occurred. Please try again.'); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Register Form Submission (AJAX)
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Client-side validation
    if (!username || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_name: username, user_email: email, user_password: password })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Show success message
            window.location.href = '/login';  // Redirect to login page after registration
        } else {
            alert(result.error || 'An error occurred. Please try again.'); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
