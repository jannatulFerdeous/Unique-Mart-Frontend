import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/shared/config/faq";
import { cn } from "@/shared/utils/cn";

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
  isOpen?: (id: string) => boolean;
  onToggle?: (id: string, isOpen: boolean) => void;
};

export function FaqAccordion({
  items,
  className,
  onToggle,
  isOpen,
}: FaqAccordionProps) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map(({ id, question, answer }) => (
        <details
          key={id}
          open={isOpen ? isOpen(id) : undefined}
          onToggle={
            onToggle
              ? (event) => onToggle(id, event.currentTarget.open)
              : undefined
          }
          className="group border-b border-line"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-sans text-base font-bold text-ink [&::-webkit-details-marker]:hidden md:text-lg">
            {question}
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>

          <p className="pb-5 leading-[1.85] text-ink-muted">
            {answer}
          </p>
        </details>
      ))}
    </div>
  );
}
