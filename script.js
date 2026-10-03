const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== 1. Galeri: placeholder kalau foto belum ada ===== */
document.querySelectorAll(".photo").forEach((photo) => {
  const img = photo.querySelector("img");
  photo.dataset.file = img.getAttribute("src").split("/").pop();

  const markMissing = () => photo.classList.add("missing");
  img.addEventListener("error", markMissing);
  if (img.complete && img.naturalWidth === 0) markMissing();
});

/* ===== 2. Lightbox ===== */
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCap = lightbox.querySelector(".lightbox-cap");

document.querySelectorAll(".photo").forEach((photo) => {
  photo.addEventListener("click", () => {
    if (photo.classList.contains("missing")) return;
    const img = photo.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = photo.querySelector("figcaption").textContent;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close(); // klik area gelap = tutup
});

/* ===== 3. Efek ngetik di surat maaf ===== */
const letter = document.querySelector(".letter");
const paragraphs = [...letter.querySelectorAll("p")];
const fullTexts = paragraphs.map((p) => p.textContent);

function typeLetter() {
  letter.style.minHeight = letter.offsetHeight + "px"; // cegah layout loncat
  paragraphs.forEach((p) => (p.textContent = ""));

  let index = 0;
  function nextParagraph() {
    if (index >= paragraphs.length) return;
    const p = paragraphs[index];
    const text = fullTexts[index];
    let count = 0;
    p.classList.add("typing");

    const timer = setInterval(() => {
      count++;
      p.textContent = text.slice(0, count);
      if (count >= text.length) {
        clearInterval(timer);
        p.classList.remove("typing");
        index++;
        setTimeout(nextParagraph, 350);
      }
    }, 22);
  }
  nextParagraph();
}

if (!reduceMotion) {
  const letterObserver = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        typeLetter();
      }
    },
    { threshold: 0.4 }
  );
  letterObserver.observe(letter);
}

/* ===== 4. Hati melayang di bagian "I Love You" ===== */
const loveSection = document.querySelector(".love");
const heartsBox = loveSection.querySelector(".hearts");
let heartTimer = null;

function spawnHeart() {
  const heart = document.createElement("span");
  heart.textContent = "\u2665";
  heart.style.left = Math.random() * 95 + "%";
  heart.style.fontSize = 14 + Math.random() * 22 + "px";
  heart.style.animationDuration = 5 + Math.random() * 4 + "s";
  heartsBox.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

if (!reduceMotion) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!heartTimer) heartTimer = setInterval(spawnHeart, 700);
    } else {
      clearInterval(heartTimer);
      heartTimer = null;
    }
  }).observe(loveSection);
}
