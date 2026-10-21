import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CalendarCheck, Palette, Rocket } from "lucide-react";
import { process } from "@/content/site";

const icons = [CalendarCheck, Palette, Rocket];

export function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState(0);
  const [segments, setSegments] = useState<CSSProperties[]>([]);
  const activate = (step: number) => {
    setActive(step);
    setCompleted((current) => Math.max(current, step));
  };

  // Measure both segments independently so completed connections keep their colour.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(".process-node"));
      const base = el.getBoundingClientRect();
      setSegments(
        nodes.slice(0, -1).flatMap((node, i) => {
          const next = nodes[i + 1];
          if (!next) return [];
          const a = node.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          return [
            {
              "--connection-x": `${a.left + a.width / 2 - base.left}px`,
              "--connection-y": `${a.top + a.height / 2 - base.top}px`,
              "--connection-width": `${b.left + b.width / 2 - a.left - a.width / 2}px`,
              "--connection-height": `${b.top + b.height / 2 - a.top - a.height / 2}px`,
              "--process-color": `var(--${process[i]?.color ?? "brand"})`,
            } as CSSProperties,
          ];
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Vertical layouts follow each node; horizontal layouts advance as the section moves up.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(".process-node"));
      let step = 0;
      nodes.forEach((node, i) => {
        const threshold = window.innerHeight * (window.innerWidth < 768 ? 0.6 : 0.75 - i * 0.15);
        if (node.getBoundingClientRect().top <= threshold) step = i;
      });
      activate(step);
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const stepColor = (i: number) => `var(--${process[i]?.color ?? "brand"})`;

  return (
    <div
      className="process-timeline"
      ref={wrap}
      style={{ "--process-color": stepColor(active) } as CSSProperties}
    >
      {segments.map((style, i) => (
        <span
          key={i}
          className="process-connection"
          data-filled={completed > i}
          style={style}
          aria-hidden="true"
        />
      ))}
      <ol className="process-list">
        {process.map((step, i) => {
          const Icon = icons[i] ?? CalendarCheck;
          return (
            <li
              key={step.number}
              className="process-step"
              data-lit={i <= completed}
              data-active={i === active}
              tabIndex={0}
              style={{ "--step-color": stepColor(i) } as CSSProperties}
              onMouseEnter={() => activate(i)}
              onFocus={() => activate(i)}
              onClick={() => activate(i)}
            >
              <span className="process-node">
                <Icon className="size-7" />
                <span className="process-badge">{i + 1}</span>
              </span>
              <div className="process-copy">
                <h3 className="text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
