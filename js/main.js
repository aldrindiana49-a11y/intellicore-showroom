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

const industryTrack = document.getElementById("industryTrack");

if (industryTrack) {
    const cards = Array.from(industryTrack.children);

    cards.forEach(card => {
        industryTrack.appendChild(card.cloneNode(true));
    });
}

document.querySelectorAll(".industry-card details").forEach(details => {

    details.addEventListener("toggle", () => {

        const card = details.closest(".industry-card");

        if (details.open) {
            card.classList.add("expanded");
        } else {
            card.classList.remove("expanded");
        }

    });

});

const industryModal = document.getElementById("industryModal");
const industryModalOverlay = document.getElementById("industryModalOverlay");
const industryModalClose = document.getElementById("industryModalClose");

const industryModalImage = document.getElementById("industryModalImage");
const industryModalTitle = document.getElementById("industryModalTitle");
const industryModalDescription = document.getElementById("industryModalDescription");
const industryModalFeatures = document.getElementById("industryModalFeatures");


document.querySelectorAll(".industry-card").forEach(card => {

    card.style.cursor = "pointer";

    card.addEventListener("click", event => {

        event.preventDefault();

        const image = card.querySelector(".industry-image img");
        const title = card.querySelector("h3");
        const description = card.querySelector(".industry-content > p");
        const features = card.querySelectorAll("li");

        industryModalImage.src = image.src;
        industryModalImage.alt = image.alt;

        industryModalTitle.textContent = title.textContent.trim();
        industryModalDescription.textContent =
            description.textContent.trim();

        industryModalFeatures.innerHTML = "";

        features.forEach(feature => {

            const li = document.createElement("li");

            li.textContent = feature.textContent.trim();

            industryModalFeatures.appendChild(li);

        });

        industryModal.classList.add("active");

        document.body.classList.add("modal-open");

    });

});


function closeIndustryModal() {

    industryModal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


industryModalClose.addEventListener(
    "click",
    closeIndustryModal
);


industryModalOverlay.addEventListener(
    "click",
    closeIndustryModal
);


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeIndustryModal();
    }

});

const serviceCarousel = document.getElementById("serviceCarousel");
const servicePrev = document.getElementById("servicePrev");
const serviceNext = document.getElementById("serviceNext");

if (serviceCarousel && servicePrev && serviceNext) {

    serviceNext.onclick = function () {
        serviceCarousel.scrollLeft += 350;
    };

    servicePrev.onclick = function () {
        serviceCarousel.scrollLeft -= 350;
    };

}


