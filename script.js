/* ---------------- LOGO REVEAL ---------------- */
const logos = document.querySelectorAll(".logos img");

function revealLogos() {
  logos.forEach((logo) => {
    const pos = logo.getBoundingClientRect().top;
    const screen = window.innerHeight;
    if (pos < screen - 60) logo.classList.add("show");
  });
}
window.addEventListener("scroll", revealLogos);
revealLogos();

/* ---------------- NAV TOGGLE ---------------- */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const closeNav = document.querySelector(".close-nav");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
closeNav.addEventListener("click", () => {
  navLinks.classList.remove("active");
});

/* ---------------- FADE-UP SECTIONS ---------------- */
function revealHistory() {
  document.querySelectorAll(".fade-up").forEach((el) => {
    const pos = el.getBoundingClientRect().top;
    if (pos < window.innerHeight - 60) el.classList.add("visible");
  });
}
window.addEventListener("scroll", revealHistory);
revealHistory();

/* ---------------- COUNTERS ---------------- */
const counters = document.querySelectorAll(".count");
let started = false;

function runCounter() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let current = 0;
    const step = target / 100;

    function update() {
      if (current < target) {
        current += step;
        counter.innerText = Math.floor(current).toLocaleString() + "+";
        requestAnimationFrame(update);
      } else {
        counter.innerText = target.toLocaleString() + "+";
      }
    }
    update();
  });
}

const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !started) {
    runCounter();
    started = true;
  }
});
counterObserver.observe(document.querySelector(".stats-strip"));

/* ---------------- SEVENR HEADING + CARDS ---------------- */
(function () {
  const heading = document.querySelector(".sevenr-heading");
  const cards = document.querySelectorAll(".sevenr-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("sevenr-heading")) {
          entry.target.classList.add("visible");
        } else {
          const i = [...cards].indexOf(entry.target);
          entry.target.style.transitionDelay = `${0.1 * i}s`;
          entry.target.classList.add("visible");
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  heading && observer.observe(heading);
  cards.forEach(card => observer.observe(card));
})();

/* ---------------- CHAT WAVE ---------------- */
function openChatWithWave() {
  const overlay = document.getElementById("chat-wave-overlay");
  const icon = document.getElementById("chat-launcher");
  const rect = icon.getBoundingClientRect();

  const wave = document.createElement("div");
  wave.className = "wave-circle";
  wave.style.left = `${rect.left + rect.width / 2}px`;
  wave.style.top = `${rect.top + rect.height / 2}px`;
  overlay.appendChild(wave);

  const size = Math.max(innerWidth, innerHeight) * 2;
  setTimeout(() => {
    wave.style.width = wave.style.height = `${size}px`;
  }, 10);

  setTimeout(() => {
    location.href = "frontend/index.html";
  }, 600);
}

/* =====================================================
   SCROLL IMAGE SEQUENCE (REPLACED VIDEO LOGIC)
   ===================================================== */

const textPanel = document.querySelector(".text-panel");
const canvas = document.getElementById("scrollCanvas");
const ctx = canvas.getContext("2d");

const totalFrames = 90;
const frames = [];
let currentFrame = 0;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);



const framePath = "images/frames/";

for (let i = 1; i <= totalFrames; i++) {
  const img = new Image();
img.src = framePath + `frame_${String(i).padStart(3, "0")}.webp`;
  frames.push(img);
}

function drawFrame(index) {
  const img = frames[index];
  if (!img || !img.complete) return;

  const cw = canvas.width;
  const ch = canvas.height;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const canvasRatio = cw / ch;
  const imgRatio = iw / ih;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    // image is wider → crop sides
    drawHeight = ch;
    drawWidth = ch * imgRatio;
    offsetX = (cw - drawWidth) / 2;
    offsetY = 0;
  } else {
    // image is taller → crop top/bottom
    drawWidth = cw;
    drawHeight = cw / imgRatio;
    offsetX = 0;
    offsetY = (ch - drawHeight) / 2;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}


let ticking = false;
textPanel.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const maxScroll = textPanel.scrollHeight - textPanel.clientHeight;
      const progress = textPanel.scrollTop / maxScroll;
      const index = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );
      if (index !== currentFrame) {
        currentFrame = index;
        drawFrame(currentFrame);
      }
      ticking = false;
    });
    ticking = true;
  }
});

/* ---------------- AUTO SCROLL TO NEXT SECTION (DESKTOP ONLY) ---------------- */
(function () {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|android|ipad|ipod/.test(ua)) return;

  const panel = document.querySelector(".panel1");
  const next = document.querySelector(".sevenr-intro");
  let atBottom = false;

  panel.addEventListener("wheel", e => {
    const max = panel.scrollHeight - panel.clientHeight;
    if (e.deltaY > 0 && panel.scrollTop >= max - 2) {
      if (atBottom) next.scrollIntoView({ behavior: "smooth" });
      atBottom = true;
    } else {
      atBottom = false;
    }
  }, { passive: true });
})();
