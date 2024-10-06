document.getElementById("play").addEventListener("click", function() {
    window.location.href = "game.html"; // Naviger til spill-siden
});

document.getElementById("how-to-play").addEventListener("click", function() {
    const popup = document.getElementById("how-to-play-popup");
    popup.classList.remove("hidden");

    const closePopupButton = document.getElementById("close-how-to-play-popup");
    closePopupButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
});
