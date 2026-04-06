document.addEventListener("DOMContentLoaded", () => {
    const fills = document.querySelectorAll(".progress-fill");
    const whyChooseSection = document.querySelector(".why-choose-us");

    if (!fills.length || !whyChooseSection) return;

    const animateProgress = () => {
        fills.forEach((fill) => {
            const target = fill.getAttribute("data-progress");
            fill.style.width = `${target}%`;
        });
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateProgress();
                    obs.disconnect();
                }
            });
        },
        {
            threshold: 0.35
        }
    );

    observer.observe(whyChooseSection);
});


const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const btn = document.getElementById("nextBtn");
const heading = document.getElementById("activityHeading");

let current = 1;

btn.addEventListener("click", () => {

    if (current === 1) {
        page1.classList.remove("active");
        page2.classList.add("active");

        heading.innerHTML = `More Fun <span class="highlight">Activities</span>`;

        btn.innerText = "Back ←";
        current = 2;

    } else {
        page2.classList.remove("active");
        page1.classList.add("active");

        heading.innerHTML = `<span class="light">Our</span> Play <span class="highlight">Zones</span>`;

        btn.innerText = "Next →";
        current = 1;
    }

});