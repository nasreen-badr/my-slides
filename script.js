const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const counter = document.getElementById("counter");
const progressFill = document.getElementById("progress-fill");
const currentTitle = document.getElementById("current-title");
const slidesContainer = document.getElementById("slides");
const dotsContainer = document.getElementById("dots");

let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));

function prepareReveal(slide) {
  slide.querySelectorAll(".reveal").forEach((item, index) => {
    item.style.animationDelay = `${index * 350}ms`;
  });
}

function updateInterface() {
  counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  progressFill.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
  currentTitle.textContent = slides[currentIndex].querySelector("h1, h2").textContent.trim();

  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === slides.length - 1;

  dots.forEach((dot, index) => {
    const isCurrent = index === currentIndex;
    dot.classList.toggle("active", isCurrent);
    if (isCurrent) {
      dot.setAttribute("aria-current", "step");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
}

function showSlide(index) {
  if (index < 0 || index >= slides.length || index === currentIndex) return;

  slides[currentIndex].classList.remove("active");
  currentIndex = index;

  const activeSlide = slides[currentIndex];
  prepareReveal(activeSlide);
  void activeSlide.offsetWidth;
  activeSlide.classList.add("active");

  updateInterface();
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function previousSlide() {
  showSlide(currentIndex - 1);
}

const dots = slides.map((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("aria-label", slide.querySelector("h1, h2").textContent.trim());
  dot.addEventListener("click", () => showSlide(index));
  dotsContainer.appendChild(dot);
  return dot;
});

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", previousSlide);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    nextSlide();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    previousSlide();
  }
});

let touchStartX = 0;
let touchStartY = 0;

slidesContainer.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

slidesContainer.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;

  if (deltaX < 0) {
    nextSlide();
  } else {
    previousSlide();
  }
}, { passive: true });

slides.forEach(prepareReveal);
updateInterface();
