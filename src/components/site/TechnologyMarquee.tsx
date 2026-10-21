import { technologies } from "@/lib/assets";
import { technologyHeading } from "@/content/site";

// Keep this a small, secondary section; the case studies carry the main story.
export function TechnologyMarquee() {
  const visible = technologies.slice(0, 10);
  return (
    <section
      aria-label={technologyHeading}
      className="technology-marquee overflow-hidden border-y border-border bg-card py-6"
    >
      <p className="text-center text-xs font-medium text-muted-foreground">{technologyHeading}</p>
      <div className="technology-window mt-5">
        <div className="technology-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center"
            >
              {visible.map(({ name, src }) => (
                <li
                  key={name}
                  className="flex w-28 shrink-0 flex-col items-center gap-2 text-muted-foreground"
                >
                  <img
                    src={src}
                    alt=""
                    width={60}
                    height={28}
                    className="h-7 w-15 object-contain grayscale opacity-70"
                  />
                  <span className="text-xs">{name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
