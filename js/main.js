if (document.body) {
    document.body.classList.add("page-is-entering");
}

function injectShellUi() {
    if (!document.querySelector(".page-transition-overlay")) {
        const overlay = document.createElement("div");
        overlay.className = "page-transition-overlay";
        document.body.appendChild(overlay);
    }

    if (!document.querySelector(".site-preloader")) {
        const preloader = document.createElement("div");
        preloader.className = "site-preloader";
        preloader.innerHTML = `
            <div class="preloader-bounce" aria-hidden="true"></div>
            <p>Loading playful moments...</p>
        `;
        document.body.appendChild(preloader);
    }

}

function reverseWords(text) {
    const trimmed = text.trim();
    if (!trimmed || !/\s/.test(trimmed)) return text;

    const leading = text.match(/^\s*/)?.[0] || "";
    const trailing = text.match(/\s*$/)?.[0] || "";
    const reversed = trimmed.split(/\s+/).reverse().join(" ");
    return `${leading}${reversed}${trailing}`;
}

function applyRtlTextTransformation(isRtl) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                if (parent.closest("script, style, noscript, iframe, svg")) return NodeFilter.FILTER_REJECT;
                if (parent.closest(".toggle-thumb, .preloader-bounce, .calendar-dates, .socials, .team-socials, .gallery")) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.closest("i")) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
        if (node.__originalText === undefined) {
            node.__originalText = node.textContent;
        }
        node.textContent = isRtl ? reverseWords(node.__originalText) : node.__originalText;
    });

    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((field) => {
        if (!field.dataset.originalPlaceholder) {
            field.dataset.originalPlaceholder = field.getAttribute("placeholder") || "";
        }
        field.setAttribute(
            "placeholder",
            isRtl ? reverseWords(field.dataset.originalPlaceholder) : field.dataset.originalPlaceholder
        );
    });

    document.querySelectorAll("option").forEach((option) => {
        if (!option.dataset.originalText) {
            option.dataset.originalText = option.textContent;
        }
        option.textContent = isRtl ? reverseWords(option.dataset.originalText) : option.dataset.originalText;
    });
}

function initThemeToggle() {
    const savedTheme = localStorage.getItem("themeMode");
    const savedDirection = localStorage.getItem("pageDirection");
    const themeToggle = document.getElementById("theme-toggle");
    const rtlToggle = document.getElementById("rtl-toggle");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    const isInitialRtl = savedDirection === "rtl";
    document.documentElement.setAttribute("dir", isInitialRtl ? "rtl" : "ltr");
    applyRtlTextTransformation(isInitialRtl);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem(
                "themeMode",
                document.body.classList.contains("dark-mode") ? "dark" : "light"
            );
        });
    }

    if (rtlToggle) {
        rtlToggle.addEventListener("click", () => {
            const isRtl = document.documentElement.getAttribute("dir") === "rtl";
            const nextDirection = isRtl ? "ltr" : "rtl";
            document.documentElement.setAttribute("dir", nextDirection);
            localStorage.setItem("pageDirection", nextDirection);
            applyRtlTextTransformation(nextDirection === "rtl");
        });
    }
}

function initMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    const dropdowns = document.querySelectorAll(".dropdown");

    if (!toggle || !menu) return;

    if (localStorage.getItem("menuOpen") === "true") {
        menu.classList.add("active");
    }

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("active");
        localStorage.setItem("menuOpen", isOpen);
        dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    });

    dropdowns.forEach((item) => {
        item.addEventListener("click", (event) => {
            if (window.innerWidth > 768) return;

            event.stopPropagation();
            dropdowns.forEach((dropdown) => {
                if (dropdown !== item) dropdown.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });
}

function initHeroSlider() {
    const slides = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    let currentIndex = 0;

    if (!slides.length || !nextBtn || !prevBtn) return;

    const showSlide = (index) => {
        slides.forEach((slide) => slide.classList.remove("active"));
        slides[index].classList.add("active");
    };

    showSlide(currentIndex);

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 5000);
}

function initPackCards() {
    const cards = document.querySelectorAll(".pack-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
}

function initHorizontalScrollButtons() {
    const scrollers = document.querySelectorAll(".magic-scroll, .fp-scroll, .character-scroll");
    if (!scrollers.length) return;

    scrollers.forEach((scroller) => {
        if (scroller.dataset.navReady === "true") return;

        let title = scroller.previousElementSibling;
        while (title && !title.matches("h2.section-title")) {
            title = title.previousElementSibling;
        }

        if (!title) return;

        const navBar = document.createElement("div");
        navBar.className = "scroll-title-bar";

        const leftBtn = document.createElement("button");
        leftBtn.type = "button";
        leftBtn.className = "scroll-nav-btn scroll-nav-btn-left";
        leftBtn.setAttribute("aria-label", "Scroll left");
        leftBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';

        const rightBtn = document.createElement("button");
        rightBtn.type = "button";
        rightBtn.className = "scroll-nav-btn scroll-nav-btn-right";
        rightBtn.setAttribute("aria-label", "Scroll right");
        rightBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';

        title.parentNode.insertBefore(navBar, title);
        navBar.append(leftBtn, title, rightBtn);

        const updateButtons = () => {
            const maxScroll = scroller.scrollWidth - scroller.clientWidth;
            leftBtn.disabled = scroller.scrollLeft <= 4;
            rightBtn.disabled = scroller.scrollLeft >= maxScroll - 4;
        };

        const scrollAmount = () => Math.max(260, Math.round(scroller.clientWidth * 0.75));

        leftBtn.addEventListener("click", () => {
            scroller.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
        });

        rightBtn.addEventListener("click", () => {
            scroller.scrollBy({ left: scrollAmount(), behavior: "smooth" });
        });

        scroller.addEventListener("scroll", updateButtons, { passive: true });
        window.addEventListener("resize", updateButtons);

        scroller.dataset.navReady = "true";
        updateButtons();
    });
}

function initPasswordToggle() {
    const toggleEye = document.querySelector(".toggle-eye");
    if (!toggleEye) return;

    toggleEye.addEventListener("click", function () {
        const pass = document.getElementById("password");
        if (!pass) return;

        if (pass.type === "password") {
            pass.type = "text";
            this.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            pass.type = "password";
            this.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
}

function initRegisterSuccess() {
    const registerForm = document.getElementById("register-form");
    const registerSuccess = document.getElementById("register-success");

    if (!registerForm || !registerSuccess) return;

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        registerSuccess.classList.add("show");
        registerForm.reset();

        setTimeout(() => {
            registerSuccess.classList.remove("show");
        }, 2500);
    });
}

function initCtaFormSuccessPopups() {
    const forms = document.querySelectorAll(".birthday-form, .magic-form, .fp-form, .character-form");
    if (!forms.length) return;

    forms.forEach((form) => {
        let popup = form.nextElementSibling;
        if (!popup || !popup.classList.contains("success-popup")) {
            popup = document.createElement("div");
            popup.className = "success-popup";
            popup.textContent = "Booked successfully";
            form.insertAdjacentElement("afterend", popup);
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            popup.classList.add("show");
            form.reset();

            clearTimeout(form.__successPopupTimeout);
            form.__successPopupTimeout = setTimeout(() => {
                popup.classList.remove("show");
            }, 2500);
        });
    });
}

function initEmptyFieldStates() {
    const fields = document.querySelectorAll(
        ".birthday-form select, .birthday-form input[type='date'], .magic-form select, .magic-form input[type='date'], .fp-form select, .fp-form input[type='date'], .pricing-quote-form select, .pricing-quote-form input[type='date'], .character-form select, .character-form input[type='date']"
    );
    if (!fields.length) return;

    const syncEmptyState = (field) => {
        field.classList.toggle("is-empty", !field.value);
    };

    fields.forEach((field) => {
        syncEmptyState(field);
        field.addEventListener("change", () => syncEmptyState(field));
        field.addEventListener("input", () => syncEmptyState(field));
    });
}

function initCalendar() {
    const calendarMonth = document.getElementById("calendar-month");
    const calendarDates = document.getElementById("calendar-dates");
    const calendarPrev = document.getElementById("calendar-prev");
    const calendarNext = document.getElementById("calendar-next");

    if (!calendarMonth || !calendarDates || !calendarPrev || !calendarNext) return;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const today = new Date();
    let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const renderCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const startOffset = (firstDay.getDay() + 6) % 7;
        const totalDays = lastDay.getDate();
        const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

        calendarMonth.textContent = `${monthNames[month]} ${year}`;
        calendarDates.innerHTML = "";

        for (let index = 0; index < totalCells; index += 1) {
            const dayCell = document.createElement("span");
            const dayNumber = index - startOffset + 1;

            if (index < startOffset) {
                dayCell.textContent = prevMonthLastDay - startOffset + index + 1;
                dayCell.classList.add("fade");
            } else if (dayNumber > totalDays) {
                dayCell.textContent = dayNumber - totalDays;
                dayCell.classList.add("fade");
            } else {
                dayCell.textContent = dayNumber;

                if (
                    year === today.getFullYear() &&
                    month === today.getMonth() &&
                    dayNumber === today.getDate()
                ) {
                    dayCell.classList.add("active");
                }
            }

            calendarDates.appendChild(dayCell);
        }
    };

    calendarPrev.addEventListener("click", () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        renderCalendar(currentMonth);
    });

    calendarNext.addEventListener("click", () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        renderCalendar(currentMonth);
    });

    renderCalendar(currentMonth);
}

function getRevealTargets() {
    return document.querySelectorAll(`
        section,
        .service-card,
        .birthday-theme-card,
        .theme-card,
        .custom-option,
        .experience-point,
        .book-slot-card,
        .what-we-do-item,
        .story-point,
        .purpose-card,
        .team-card,
        .mini-card,
        .happy-feature,
        .info-card,
        .zone,
        .step,
        .fact,
        .calendar-box
    `);
}

function initRevealAnimations() {
    const targets = getRevealTargets();
    if (!targets.length) return;

    targets.forEach((target, index) => {
        if (target.classList.contains("header") || target.classList.contains("footer")) return;
        if (!target.classList.contains("reveal")) {
            target.classList.add("reveal");
        }

        if (index % 3 === 0) {
            target.classList.add("reveal-slide-left");
        } else if (index % 3 === 1) {
            target.classList.add("reveal-slide-right");
        } else {
            target.classList.add("reveal-zoom");
        }

        target.classList.add(`reveal-delay-${(index % 3) + 1}`);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: window.innerWidth <= 768 ? 0.08 : 0.16,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    targets.forEach((target) => observer.observe(target));
}

function initRippleEffect() {
    const clickable = document.querySelectorAll("button, .cta-btn, .hero-btn, .char-btn, .pack-btn, .login-btn, a");

    clickable.forEach((element) => {
        element.addEventListener("click", (event) => {
            if (element.classList.contains("menu-toggle")) return;

            const ripple = document.createElement("span");
            ripple.className = "ripple";

            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

            element.appendChild(ripple);

            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });
}

function initMediaHoverEnhancements() {
    const wrappers = document.querySelectorAll(
        ".birthday-theme-card, .experience-card, .team-photo, .why-choose-visual, .story-visual, .video2-img, .about-img, .service-img"
    );

    wrappers.forEach((wrapper) => wrapper.classList.add("image-hover-overlay"));
}

function initCurrentPageMenuState() {
    const menu = document.querySelector(".menu");
    if (!menu) return;

    const currentPath = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
    const topItems = Array.from(menu.querySelectorAll(":scope > li"));
    const submenuItems = Array.from(menu.querySelectorAll(".submenu li"));

    topItems.forEach((item) => item.classList.remove("current"));
    submenuItems.forEach((item) => item.classList.remove("current"));

    const findTopItem = (label) =>
        topItems.find((item) => {
            const link = item.querySelector(":scope > a");
            const text = (link ? link.textContent : item.childNodes[0]?.textContent || "").trim().toLowerCase();
            return text === label;
        });

    const findSubmenuItem = (href) =>
        submenuItems.find((item) => item.querySelector("a")?.getAttribute("href")?.toLowerCase() === href);

    const pageMenuMap = {
        "index.html": { top: "home", sub: "index.html" },
        "home2.html": { top: "home", sub: "home2.html" },
        "about.html": { top: "about us" },
        "contact.html": { top: "contact" },
        "birthday.html": { top: "services", sub: "birthday.html" },
        "magic.html": { top: "services", sub: "magic.html" },
        "face-painting.html": { top: "services", sub: "face-painting.html" },
        "pricing.html": { top: "services", sub: "pricing.html" },
        "superheroes.html": { top: "characters", sub: "superheroes.html" },
        "princesses.html": { top: "characters", sub: "princesses.html" },
        "cartoons.html": { top: "characters", sub: "cartoons.html" }
    };

    const currentMenu = pageMenuMap[currentPath];
    if (!currentMenu) return;

    findTopItem(currentMenu.top)?.classList.add("current");

    if (currentMenu.sub) {
        findSubmenuItem(currentMenu.sub)?.classList.add("current");
    }
}

function initPageTransitions() {
    const links = document.querySelectorAll("a[href]");

    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        const isInternalPage =
            !href.startsWith("#") &&
            !href.startsWith("mailto:") &&
            !href.startsWith("tel:") &&
            !href.startsWith("javascript:") &&
            !link.hasAttribute("download") &&
            !link.getAttribute("target");

        if (!isInternalPage) return;

        link.addEventListener("click", (event) => {
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

            event.preventDefault();
            document.body.classList.add("page-is-leaving");

            setTimeout(() => {
                window.location.href = link.href;
            }, 260);
        });
    });
}

function finishPageLoading() {
    const preloader = document.querySelector(".site-preloader");

    window.addEventListener("load", () => {
        if (preloader) {
            preloader.classList.add("hidden");
        }

        document.body.classList.remove("page-is-entering");
        document.body.classList.add("page-ready");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    injectShellUi();
    initThemeToggle();
    initMenu();
    initHeroSlider();
    initPackCards();
    initHorizontalScrollButtons();
    initPasswordToggle();
    initRegisterSuccess();
    initCtaFormSuccessPopups();
    initEmptyFieldStates();
    initCalendar();
    initMediaHoverEnhancements();
    initRevealAnimations();
    initRippleEffect();
    initCurrentPageMenuState();
    initPageTransitions();
    finishPageLoading();
});


const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
