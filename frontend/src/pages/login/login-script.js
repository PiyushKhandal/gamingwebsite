document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-box.login');
    const registerForm = document.querySelector('.form-box.register');
    const loginUsernameInput = loginForm.querySelector('.input-box:nth-child(1) input');
    const loginPasswordInput = loginForm.querySelector('.input-box:nth-child(2) input');
    const registerUsernameInput = registerForm.querySelector('.input-box:nth-child(1) input');
    const registerEmailInput = registerForm.querySelector('.input-box:nth-child(2) input');
    const registerPasswordInput = registerForm.querySelector('.input-box:nth-child(3) input');
    const loginButton = loginForm.querySelector('button');
    const registerButton = registerForm.querySelector('button');

    // Toggle between login and register forms
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');
    const formBoxes = document.querySelectorAll('.form-box');
    const infoTexts = document.querySelectorAll('.info-text');

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        formBoxes.forEach(box => box.classList.toggle('active'));
        infoTexts.forEach(text => text.classList.toggle('active'));
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        formBoxes.forEach(box => box.classList.toggle('active'));
        infoTexts.forEach(text => text.classList.toggle('active'));
    });

    // Login handler
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = loginUsernameInput.value; // Assuming email is used for login
        const password = loginPasswordInput.value;

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Redirect to profile or dashboard
                window.location.href = '../profile/index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    });

    // Registration handler
    registerButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = registerUsernameInput.value;
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;

        // Create a FormData object for file upload
        const formData = new FormData();
        formData.append('Username', username);
        formData.append('email', email);
        formData.append('password', password);

        // Get the file input for profile photo
        const photoInput = document.createElement('input');
        photoInput.type = 'file';
        photoInput.accept = 'image/jpeg,image/png,image/webp';
        
        photoInput.addEventListener('change', async (fileEvent) => {
            const photo = fileEvent.target.files[0];
            formData.append('photo', photo);

            try {
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    // Redirect to profile or login
                    window.location.href = '../profile/index.html';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration');
            }
        });

        // Trigger file selection for profile photo
        photoInput.click();
    });
});
