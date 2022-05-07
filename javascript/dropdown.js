const [selectAlgorithmToggle, changeSpeedToggle] = Array.from(document.querySelectorAll(".dropdown-toggle"));
const [selectAlgorithmMenu, changeSpeedMenu] = Array.from(document.querySelectorAll(".dropdown-menu"));

selectAlgorithmToggle.addEventListener("click", event => {
    selectAlgorithmMenu.classList.toggle("not-visible");
    event.stopPropagation();
});

changeSpeedToggle.addEventListener("click", event => {
    changeSpeedMenu.classList.toggle("not-visible");
    event.stopPropagation();
});

// if toggles are visible and dom clicked then hide it
window.addEventListener("click", () => {
    if (!selectAlgorithmMenu.classList.contains("not-visible")) {
        selectAlgorithmMenu.classList.add("not-visible");
    }

    if (!changeSpeedMenu.classList.contains("not-visible")) {
        changeSpeedMenu.classList.add("not-visible");
    }
});