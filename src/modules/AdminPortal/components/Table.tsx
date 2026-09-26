import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export function TableScroll({ children }: { children: ReactNode }) {
  return <div className="-mx-4 overflow-x-auto md:-mx-5">{children}</div>;
}

export function Table({ className, children, ...rest }: ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full min-w-3xl border-collapse text-left text-sm", className)}
      {...rest}
    >
      {children}
    </table>
  );
}

export function Th({ className, children, ...rest }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({ className, children, ...rest }: ComponentProps<"td">) {
  return (
    <td className={cn("border-b border-line px-4 py-3 align-middle", className)} {...rest}>
      {children}
    </td>
  );
}

export function TdNum({ className, children, ...rest }: ComponentProps<"td">) {
  return (
    <Td className={cn("text-right tabular-nums", className)} {...rest}>
      {children}
    </Td>
  );
}

export function ThNum({ className, children, ...rest }: ComponentProps<"th">) {
  return (
    <Th className={cn("text-right", className)} {...rest}>
      {children}
    </Th>
  );
}

export function Tr({ className, children, ...rest }: ComponentProps<"tr">) {
  return (
    <tr className={cn("transition-colors hover:bg-surface-muted/60", className)} {...rest}>
      {children}
    </tr>
  );
}
