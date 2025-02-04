document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burger-menu');
    const nav = document.querySelector('nav');
    
    burgerMenu.addEventListener('click', function () {
        nav.classList.toggle('active');
        burgerMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
});
