//homepage 2 video popup

function openVideo() {
    const popup = document.getElementById("videoPopup");
    const iframe = document.getElementById("videoFrame");

    popup.style.display = "flex";

    iframe.src = "https://player.vimeo.com/video/13993501?autoplay=1";
}

function closeVideo() {
    const popup = document.getElementById("videoPopup");
    const iframe = document.getElementById("videoFrame");

    popup.style.display = "none";

    iframe.src = iframe.src.replace("?autoplay=1", "");
}

document.addEventListener("DOMContentLoaded", () => {

    const counters = document.querySelectorAll('.counter');
    const section = document.querySelector('.funfacts');

    let started = false;

    function startCounter() {

        counters.forEach(counter => {

            let target = +counter.getAttribute('data-target');
            let count = 0;

            let interval = setInterval(() => {

                count += Math.ceil(target / 50);

                if (count >= target) {
                    counter.innerText = target + "+";
                    clearInterval(interval);
                } else {
                    counter.innerText = count + "+";
                }

            }, 30);

        });

    }

    function checkScroll() {

        const rect = section.getBoundingClientRect();

        if (!started && rect.top < window.innerHeight) {
            started = true;
            startCounter();
        }
    }

    window.addEventListener("scroll", checkScroll);

    /* trigger if already visible */
    checkScroll();

});

//testimonial slider

const testimonials = [
    {
        text: "Amazing service! My kids enjoyed a lot and the party was perfectly organized.",
        name: "Sunny's Mom",
        img: "images/testi1.jpg"
    },
    {
        text: "Wonderful experience! The characters and decorations were so beautiful.",
        name: "Arjun's Dad",
        img: "images/testi2.jpg"
    },
    {
        text: "Highly recommended! Everything was fun and memorable for our kids.",
        name: "Meera's Mom",
        img: "images/testi3.jpg"
    }
];

let currentIndex = 0;

function showTest(i) {

    document.getElementById("testText").innerText = testimonials[i].text;
    document.getElementById("testName").innerText = testimonials[i].name;
    document.getElementById("testImg").src = testimonials[i].img;

    document.querySelectorAll(".dots span").forEach(dot => dot.classList.remove("active"));
    document.querySelectorAll(".dots span")[i].classList.add("active");
}

function nextTest() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTest(currentIndex);
}

function prevTest() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTest(currentIndex);
}

function setTest(i) {
    currentIndex = i;
    showTest(currentIndex);
}
