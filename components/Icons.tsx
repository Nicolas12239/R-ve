import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.8 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.4 0 5.6 3.3 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" />
  </svg>
);
export const CommentIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.5 11.6c0 4.2-3.8 7.4-8.5 7.4-1.2 0-2.3-.2-3.3-.6L3.5 20l1.4-4c-.9-1.2-1.4-2.7-1.4-4.4C3.5 7.4 7.3 4 12 4s8.5 3.4 8.5 7.6Z" />
  </svg>
);
export const ShareIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 5l7 6.5-7 6.5v-4c-5 0-8.5 1.5-11 5 1-5 4-9.5 11-10.5V5Z" />
  </svg>
);
export const BookIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 6.5C10 5 7.5 4.5 3.5 4.5v13c4 0 6.5.5 8.5 2 2-1.5 4.5-2 8.5-2v-13c-4 0-6.5.5-8.5 2Zm0 0v13" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const SendIcon = (p: P) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
  </svg>
);
export const ImageIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 17.5 5-4.5 4 3.5 2.5-2 4.5 3.5" />
  </svg>
);
export const StickerIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.5 12A8.5 8.5 0 1 1 12 3.5c.6 0 1 .4 1 1v3.5a3 3 0 0 0 3 3h3.5c.6 0 1 .4 1 1Z" />
    <path d="M8.5 14.5c1.6 1.8 5.4 1.8 7 0M9 10h.01M13.5 10h.01" />
  </svg>
);
export const QuillIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 3.5C12 4 6.5 9.5 5.5 18.5c5-1 10.5-5.5 14.5-15Z" />
    <path d="M4 20.5 13 11M8.5 14.5h4.5" />
  </svg>
);
export const TextSizeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 18 8 6l5 12M4.8 14h6.4M15 18l3-7.5 3 7.5M15.9 16h4.2" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const EyeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const ArrowDownIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
export const SparkleIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8Z" fill="currentColor" stroke="none" />
  </svg>
);
