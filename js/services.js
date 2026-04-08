function initServicePageAnimations() {
    initServiceReveal();
    initSpotlightHover();
    initSparkleTrail();
}

function initServiceReveal() {
    const targets = document.querySelectorAll([
        ".birthday-theme-card",
        ".experience-point",
        ".custom-option",
        ".book-slot-point",
        ".book-slot-card",
        ".birthday-cta-box",
        ".mh-card",
        ".exp-step",
        ".magic-box",
        ".show-left",
        ".show-right",
        ".magic-cta-box",
        ".fp-highlight-item",
        ".fp-style-box",
        ".fp-safe-row",
        ".fp-cta-box",
        ".price-intro-card",
        ".pricing-sheet",
        ".magic-rate-card",
        ".booking-line",
        ".pricing-quote-form",
        ".pricing-cta-copy"
    ].join(","));

    if (!targets.length) return;

    targets.forEach((item, index) => {
        item.classList.add("service-reveal");

        const mod = index % 3;
        if (mod === 0) item.classList.add("service-reveal-left");
        if (mod === 1) item.classList.add("service-reveal-right");
        if (mod === 2) item.classList.add("service-reveal-zoom");

        item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((item) => observer.observe(item));
}

function initSpotlightHover() {
    const cards = document.querySelectorAll([
        ".birthday-theme-card",
        ".experience-point",
        ".custom-option",
        ".book-slot-card",
        ".magic-box",
        ".fp-style-box",
        ".fp-safe-row",
        ".price-intro-card",
        ".pricing-sheet",
        ".magic-rate-card",
        ".booking-line"
    ].join(","));

    if (!cards.length) return;

    cards.forEach((card) => {
        card.classList.add("spotlight-card");
        card.style.setProperty("--spot-x", "50%");
        card.style.setProperty("--spot-y", "50%");

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty("--spot-x", `${x}px`);
            card.style.setProperty("--spot-y", `${y}px`);
        });
    });
}

function initSparkleTrail() {
    const sparkleTargets = document.querySelectorAll([
        ".birthday-cta .cta-btn",
        ".magic-cta .cta-btn",
        ".fp-cta .cta-btn",
        ".pricing-cta .cta-btn",
        ".price-intro-card .cta-btn",
        ".book-slot-card .cta-btn"
    ].join(","));

    if (!sparkleTargets.length) return;

    sparkleTargets.forEach((target) => {
        target.classList.add("sparkle-host");

        const spawnBurst = (event) => {
            const rect = target.getBoundingClientRect();
            const originX = event ? event.clientX - rect.left : rect.width / 2;
            const originY = event ? event.clientY - rect.top : rect.height / 2;

            for (let i = 0; i < 6; i += 1) {
                const sparkle = document.createElement("span");
                sparkle.className = "sparkle-dot";
                const angle = (Math.PI * 2 * i) / 6;
                const distance = 18 + Math.random() * 14;
                sparkle.style.left = `${originX}px`;
                sparkle.style.top = `${originY}px`;
                sparkle.style.setProperty("--sparkle-x", `${Math.cos(angle) * distance}px`);
                sparkle.style.setProperty("--sparkle-y", `${Math.sin(angle) * distance}px`);
                sparkle.style.animationDelay = `${i * 30}ms`;
                target.appendChild(sparkle);
                window.setTimeout(() => sparkle.remove(), 700);
            }
        };

        target.addEventListener("mouseenter", () => spawnBurst());
        target.addEventListener("click", (event) => spawnBurst(event));
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initServicePageAnimations);
} else {
    initServicePageAnimations();
}
