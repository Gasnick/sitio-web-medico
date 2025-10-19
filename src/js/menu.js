const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = navMenu.querySelectorAll("a");

// Abrir/cerrar menú al hacer clic en el botón
menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("show");
    });
});

const navbar = document.querySelector(".navbar");
const btnTop = document.getElementById("btn-top");

// Efecto de sombra en navbar cuando se scrollea
window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
        btnTop.style.display = "block"; // mostrar botón
    } else {
        navbar.classList.remove("scrolled");
        btnTop.style.display = "none"; // ocultar botón
    }
});

// Botón para volver arriba
btnTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});