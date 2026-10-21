import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnquiryForm } from "./EnquiryForm";
import type { QuoteSelection } from "@/lib/quote";

export function BookingDialog({
  open,
  packageName,
  quoteSelection,
  onClose,
}: {
  open: boolean;
  packageName?: string | undefined;
  quoteSelection?: QuoteSelection | undefined;
  onClose: () => void;
}) {
  const opener = useRef<HTMLElement | null>(null);
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        className="dialog-panel max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-lg border-border bg-card p-7"
        onOpenAutoFocus={() => {
          opener.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          opener.current?.focus();
        }}
      >
        <DialogHeader className="pr-6">
          <DialogTitle className="font-serif text-2xl">Skicka en mötesförfrågan</DialogTitle>
          <DialogDescription>
            {packageName ? `Du är intresserad av ${packageName}. ` : ""}Berätta om ditt projekt så
            återkommer Samir för att komma överens om en tid för ett kostnadsfritt samtal.
          </DialogDescription>
        </DialogHeader>
        <EnquiryForm source="meeting" quoteSelection={quoteSelection} />
      </DialogContent>
    </Dialog>
  );
}
