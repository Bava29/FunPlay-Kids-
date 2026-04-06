const items = document.querySelectorAll(".timeline-item");

window.addEventListener("scroll", () => {
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            item.classList.add("show");
        }
    });
});