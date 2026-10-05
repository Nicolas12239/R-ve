/** Plume d'écriture en grisaille, pour le panneau « Mon histoire ». */
export default function Quill({ className }: { className?: string }) {
  const barbs = Array.from({ length: 34 }, (_, i) => {
    const t = (i + 1) / 36;
    const x = 40 + t * 330;
    const y = 420 - t * 380 - Math.sin(t * Math.PI) * 30;
    const len = 18 + 70 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.7);
    return (
      <g key={i}>
        <path d={`M ${x} ${y} q ${-len * 0.2} ${-len * 0.5} ${-len * 0.75} ${-len * 0.62}`} />
        <path d={`M ${x} ${y} q ${len * 0.5} ${len * 0.1} ${len * 0.66} ${len * 0.55}`} />
      </g>
    );
  });
  return (
    <svg className={className} viewBox="0 0 420 460" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="quill-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1b1b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1b1b1b" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <g stroke="url(#quill-g)" strokeWidth="1.1" strokeLinecap="round">
        {barbs}
      </g>
      <path d="M 20 448 Q 30 420 40 420 Q 210 260 380 30" stroke="#1b1b1b" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 10 456 l 14 -12" stroke="#1b1b1b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
