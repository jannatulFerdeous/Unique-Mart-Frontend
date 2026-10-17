import { cn } from "@/shared/utils/cn";

// Illustrations for the error pages, drawn in the theme colours. The floating
// parts hold still for people who ask for less motion.

const floatPart = "motion-safe:animate-float [transform-box:fill-box]";
const floatSlow = "motion-safe:animate-float-slow [transform-box:fill-box]";

// 404: an opened delivery box with nothing in it, the code floating out.
export function LostBoxArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" role="img" aria-label="An empty, opened delivery box" className={cn("h-auto w-full", className)}>
      <circle cx="240" cy="205" r="165" className="fill-tertiary-soft" />
      <circle cx="78" cy="96" r="10" className="fill-tertiary/20" />
      <circle cx="420" cy="132" r="7" className="fill-tertiary/30" />
      <circle cx="402" cy="300" r="12" className="fill-tertiary/15" />
      <path d="M62 250l6 12 12 6-12 6-6 12-6-12-12-6 12-6z" className="fill-warning" />
      <path d="M412 62l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" className="fill-tertiary/60" />

      {/* the code and two question marks, floating */}
      <g className={floatPart}>
        <text
          x="240"
          y="150"
          textAnchor="middle"
          className="fill-tertiary font-sans"
          style={{ fontSize: 104, fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          404
        </text>
      </g>
      <g className={floatSlow}>
        <text x="118" y="196" className="fill-ink-subtle font-sans" style={{ fontSize: 34, fontWeight: 700 }}>
          ?
        </text>
        <text x="352" y="182" className="fill-ink-subtle/70 font-sans" style={{ fontSize: 26, fontWeight: 700 }}>
          ?
        </text>
      </g>

      {/* shadow */}
      <ellipse cx="240" cy="352" rx="150" ry="13" className="fill-ink/10" />

      {/* the open box */}
      <path d="M150 232h180l-28-26H178z" fill="#a8692f" />
      <path d="M150 232l28-26-46-34-30 26z" fill="#e2ab6b" stroke="#c48a4c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M330 232l-28-26 46-34 30 26z" fill="#e2ab6b" stroke="#c48a4c" strokeWidth="2" strokeLinejoin="round" />
      <rect x="150" y="232" width="180" height="114" rx="4" fill="#eab676" stroke="#c48a4c" strokeWidth="2" />
      <path d="M150 232h180v18H150z" fill="#d79c5c" />
      <rect x="226" y="232" width="28" height="114" className="fill-tertiary/25" />
      <rect x="172" y="276" width="50" height="40" rx="4" className="fill-surface" />
      <path d="M180 288h34M180 297h26M180 306h30" className="stroke-ink-subtle" strokeWidth="3" strokeLinecap="round" />
      <path d="M270 300l10 10 18-22" className="stroke-surface" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// 500: a plug pulled out of its socket.
export function UnpluggedArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" role="img" aria-label="A plug pulled out of its socket" className={cn("h-auto w-full", className)}>
      <circle cx="240" cy="205" r="165" className="fill-tertiary-soft" />
      <circle cx="84" cy="110" r="9" className="fill-tertiary/20" />
      <circle cx="414" cy="118" r="7" className="fill-tertiary/30" />
      <path d="M70 168l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" className="fill-tertiary/60" />

      <g className={floatSlow}>
        <text
          x="240"
          y="136"
          textAnchor="middle"
          className="fill-tertiary font-sans"
          style={{ fontSize: 104, fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          500
        </text>
      </g>

      {/* socket side */}
      <path d="M470 330c-50 0-70-30-70-80" className="stroke-ink" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="300" y="200" width="100" height="92" rx="16" className="fill-surface stroke-line-strong" strokeWidth="3" />
      <rect x="318" y="226" width="24" height="10" rx="3" className="fill-ink" />
      <rect x="318" y="256" width="24" height="10" rx="3" className="fill-ink" />

      {/* sparks in the gap */}
      <path d="M262 214l14-10M266 246h18M262 278l14 10" className="stroke-warning" strokeWidth="5" strokeLinecap="round" />

      {/* plug side, drifting */}
      <g className={floatPart}>
        <path d="M10 330c50 0 74-24 100-70" className="stroke-ink" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect x="100" y="206" width="104" height="80" rx="16" className="fill-tertiary" />
        <rect x="100" y="206" width="30" height="80" rx="12" className="fill-tertiary-hover" />
        <rect x="204" y="224" width="36" height="12" rx="4" className="fill-ink-subtle" />
        <rect x="204" y="256" width="36" height="12" rx="4" className="fill-ink-subtle" />
      </g>

      <ellipse cx="240" cy="352" rx="150" ry="13" className="fill-ink/10" />
    </svg>
  );
}
