(() => {
  const trackSelector = ".testimonial-track";

  const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const getMetrics = (track) => {
    const cards = Array.from(track.querySelectorAll(".testimonial-card"));
    const firstCard = cards[0];
    if (!firstCard) return null;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const step = cardWidth + gap;
    const visible = Math.max(1, Math.floor((track.clientWidth + gap + 1) / step));

    return { cards, step, visible };
  };

  const updateCarousel = (track) => {
    const metrics = getMetrics(track);
    if (!metrics) return;

    const carousel = track.closest(".testimonial-carousel");
    if (!carousel) return;

    const { cards, step, visible } = metrics;
    const start = Math.min(cards.length, Math.round(track.scrollLeft / step) + 1);
    const end = Math.min(cards.length, start + visible - 1);
    const counter = carousel.querySelector("[data-testimonial-counter]");
    const previous = carousel.querySelector('[data-testimonial-direction="-1"]');
    const next = carousel.querySelector('[data-testimonial-direction="1"]');

    if (counter) counter.textContent = visible > 1 ? `${start}–${end} / ${cards.length}` : `${start} / ${cards.length}`;
    if (previous) previous.disabled = false;
    if (next) next.disabled = false;
  };

  const moveCarousel = (track, direction) => {
    const metrics = getMetrics(track);
    if (!metrics) return;

    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= maximum - 2;
    let target = track.scrollLeft + direction * metrics.step;

    if (direction < 0 && atStart) target = maximum;
    if (direction > 0 && atEnd) target = 0;

    track.scrollTo({
      left: Math.max(0, Math.min(maximum, target)),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  window.YeonCarousel = {
    move(direction) {
      const track = document.querySelector(trackSelector);
      if (track) moveCarousel(track, Number(direction));
    },
  };

  const initializeTrack = (track) => {
    if (track.dataset.carouselReady !== "true") {
      track.dataset.carouselReady = "true";

      const cards = track.querySelectorAll(".testimonial-card");
      cards.forEach((card, index) => {
        card.setAttribute("role", "group");
        card.setAttribute("aria-label", `${index + 1} / ${cards.length}`);
      });
    }

    window.requestAnimationFrame(() => updateCarousel(track));
  };

  const scanForTracks = () => {
    document.querySelectorAll(trackSelector).forEach(initializeTrack);
  };

  document.addEventListener("keydown", (event) => {
    if (!(event.target instanceof Element) || !event.target.matches(trackSelector)) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    moveCarousel(event.target, event.key === "ArrowRight" ? 1 : -1);
  });

  document.addEventListener("scroll", (event) => {
    if (!(event.target instanceof Element) || !event.target.matches(trackSelector)) return;
    window.requestAnimationFrame(() => updateCarousel(event.target));
  }, true);

  window.addEventListener("resize", () => {
    document.querySelectorAll(trackSelector).forEach(updateCarousel);
  }, { passive: true });

  window.addEventListener("load", () => {
    document.querySelectorAll(trackSelector).forEach(updateCarousel);
  }, { once: true });

  const observer = new MutationObserver(scanForTracks);
  const start = () => {
    scanForTracks();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
