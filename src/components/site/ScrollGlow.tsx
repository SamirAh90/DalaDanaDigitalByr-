import { useEffect } from "react";

const SELECTOR = ".animated-border, .benefit-card, .service-card";

// Touch screens have no hover, so light up card borders while they pass the middle of the screen.
export function ScrollGlow() {
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("in-view", e.isIntersecting)),
      { rootMargin: "-30% 0px -30% 0px" },
    );
    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
