/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Core Theme ──────────────────────────────────────────
        'kairos-bg':          '#090F16',   // Deep Navy Slate  – main background
        'kairos-panel':       '#0E1720',   // Dark Panel       – cards & sidebar
        'kairos-text':        '#EEF7FC',   // Ice White        – primary text
        'kairos-teal':        '#45A79A',   // Clinical Teal    – primary / brand
        'kairos-blue':        '#4588AB',   // Slate Blue       – secondary
        'kairos-accent':      '#4DC4B5',   // Bright Teal      – active highlight
        'kairos-muted':       '#8FA8B4',   // Muted Text       – secondary text
        'kairos-border':      '#253642',   // Border           – dividers
        'kairos-danger':      '#EF4444',   // Destructive Red  – danger / delete
        // ── Severity ────────────────────────────────────────────
        'sev-low':            '#22C55E',
        'sev-medium':         '#EAB308',
        'sev-high':           '#F97316',
        'sev-critical':       '#EF4444',
        // ── Status ──────────────────────────────────────────────
        'status-open':        '#38BDF8',
        'status-accepted':    '#2DD4BF',
        'status-rejected':    '#F87171',
        'status-investing':   '#60A5FA',
        'status-pending':     '#FBBF24',
        'status-progress':    '#C084FC',
        'status-review':      '#FDE047',
        'status-closed':      '#4ADE80',
      },
    },
  },
  plugins: [],
}