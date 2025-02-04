document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const responseMessage = document.getElementById('responseMessage');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        responseMessage.textContent = '';
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            responseMessage.textContent = 'All fields are required!';
            responseMessage.style.color = 'red';
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            responseMessage.textContent = 'Please enter a valid email address.';
            responseMessage.style.color = 'red';
            return;
        }

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        fetch('submit.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                responseMessage.textContent = data;
                responseMessage.style.color = 'green';
                contactForm.reset();
            })
            .catch(error => {
                responseMessage.textContent = 'Something went wrong. Please try again later.';
                responseMessage.style.color = 'red';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send';
            });
    });
});
