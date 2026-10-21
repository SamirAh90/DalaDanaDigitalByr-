import type { PointerEvent } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingAddon({
  addon,
  selected,
  onToggle,
}: {
  addon: { title: string; text: string; price: string };
  selected: boolean;
  onToggle: () => void;
}) {
  const followEdge = (event: PointerEvent<HTMLButtonElement>) => {
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const distance = Math.min(x, y, bounds.width - x, bounds.height - y);
    element.style.setProperty("--edge-x", `${x}px`);
    element.style.setProperty("--edge-y", `${y}px`);
    element.style.setProperty("--edge-opacity", String(Math.max(0, 1 - distance / 40)));
  };

  return (
    <Button
      variant="pricingAddon"
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      onPointerMove={followEdge}
      onPointerLeave={(event) => event.currentTarget.style.setProperty("--edge-opacity", "0")}
      className="w-full min-w-0"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-semibold leading-snug">{addon.title}</span>
        <span className="text-xs leading-relaxed text-muted-foreground">{addon.text}</span>
        <span className="mt-1 text-sm font-medium text-brand">{addon.price}</span>
      </span>
      <span
        className="addon-check flex size-6 shrink-0 items-center justify-center rounded-full border border-border"
        aria-hidden="true"
      >
        {selected ? <Check /> : <Plus />}
      </span>
    </Button>
  );
}
