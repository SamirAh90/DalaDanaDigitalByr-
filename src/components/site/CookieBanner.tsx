import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { QUOTE_STORAGE_KEY } from "@/lib/quote";

const OPEN_SETTINGS = "daladana:storage-settings";
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS));
}

/** No consent banner: this build contains no analytics or marketing trackers. */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [cleared, setCleared] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const show = () => {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setCleared(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS, show);
    return () => window.removeEventListener(OPEN_SETTINGS, show);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          opener.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Lagring i din webbläsare</DialogTitle>
          <DialogDescription>
            Webbplatsen använder inga analys- eller marknadsföringscookies. Dina offertval kan
            sparas i den här fliken så att du kan fortsätta senare. Namn, e-post och meddelanden
            sparas inte där.
          </DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            try {
              window.sessionStorage.removeItem(QUOTE_STORAGE_KEY);
              setCleared(true);
            } catch {
              setCleared(false);
            }
          }}
        >
          Rensa sparade offertval
        </Button>
        {cleared && (
          <p role="status" className="text-sm text-muted-foreground">
            De sparade offertvalen är rensade. Val som ligger i sidans adress kan fortfarande visas.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
