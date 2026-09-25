const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});


const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });

});


document.getElementById("year").textContent =
    new Date().getFullYear();

const portfolioCarousel =
    document.getElementById("portfolioCarousel");

const portfolioPrev =
    document.getElementById("portfolioPrev");

const portfolioNext =
    document.getElementById("portfolioNext");


portfolioNext.addEventListener("click", () => {

    portfolioCarousel.scrollBy({
        left: portfolioCarousel.clientWidth * 0.75,
        behavior: "smooth"
    });

});


portfolioPrev.addEventListener("click", () => {

    portfolioCarousel.scrollBy({
        left: -portfolioCarousel.clientWidth * 0.75,
        behavior: "smooth"
    });

});