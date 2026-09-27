const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const ArrowRight = () => (
  <svg width="16" height="16" strokeWidth="1.75" {...base}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ChevronLeft = () => (
  <svg width="18" height="18" strokeWidth="1.75" {...base}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = () => (
  <svg width="18" height="18" strokeWidth="1.75" {...base}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronDown = () => (
  <svg width="12" height="12" strokeWidth="2" {...base}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Play = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 4v16l13-8z" />
  </svg>
);

export const Menu = () => (
  <svg width="20" height="20" strokeWidth="2" {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Close = () => (
  <svg width="20" height="20" strokeWidth="2" {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
