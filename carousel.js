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
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const counter = carousel.querySelector("[data-testimonial-counter]");
    const previous = carousel.querySelector('[data-testimonial-direction="-1"]');
    const next = carousel.querySelector('[data-testimonial-direction="1"]');

    if (counter) counter.textContent = visible > 1 ? `${start}–${end} / ${cards.length}` : `${start} / ${cards.length}`;
    if (previous) previous.disabled = atStart;
    if (next) next.disabled = atEnd;
  };

  const moveCarousel = (track, direction) => {
    const metrics = getMetrics(track);
    if (!metrics) return;

    track.scrollBy({
      left: direction * metrics.step,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const handleControlClick = (event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement) || button.disabled) return;

    event.preventDefault();
    event.stopPropagation();
    const track = button.closest(".testimonial-carousel")?.querySelector(trackSelector);
    if (!track) return;
    moveCarousel(track, Number(button.dataset.testimonialDirection));
  };

  const bindControls = (track) => {
    const carousel = track.closest(".testimonial-carousel");
    if (!carousel) return;

    carousel.querySelectorAll("[data-testimonial-direction]").forEach((button) => {
      if (button.dataset.carouselControlReady === "true") return;
      button.dataset.carouselControlReady = "true";
      button.addEventListener("click", handleControlClick);
    });
  };

  const initializeTrack = (track) => {
    bindControls(track);
    if (track.dataset.carouselReady === "true") return;
    track.dataset.carouselReady = "true";

    const cards = track.querySelectorAll(".testimonial-card");
    cards.forEach((card, index) => {
      card.setAttribute("role", "group");
      card.setAttribute("aria-label", `${index + 1} / ${cards.length}`);
    });

    window.requestAnimationFrame(() => updateCarousel(track));
  };

  const scanForTracks = () => {
    document.querySelectorAll(trackSelector).forEach(initializeTrack);
  };

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-testimonial-direction]");
    if (!button || button.disabled || button.dataset.carouselControlReady === "true") return;

    const track = button.closest(".testimonial-carousel")?.querySelector(trackSelector);
    if (!track) return;
    moveCarousel(track, Number(button.dataset.testimonialDirection));
  });

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
