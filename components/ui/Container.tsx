import type { ReactNode } from "react";
import clsx from "clsx";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1120px] px-6 md:px-12", className)}>
      {children}
    </div>
  );
}
