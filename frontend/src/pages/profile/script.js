document.addEventListener("DOMContentLoaded", function () {
    const tabLinks = document.querySelectorAll('.account-settings-links a');
    const tabContents = document.querySelectorAll('.tab-content .card2');

    // Show the first tab content by default
    tabContents.forEach((tab, index) => {
        tab.style.display = (index === 0) ? 'block' : 'none';
    });

    tabLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Update active link
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Update visible tab content
            tabContents.forEach(tab => tab.style.display = 'none');
            document.querySelector(this.getAttribute('href')).style.display = 'block';
        });
    });
});



   