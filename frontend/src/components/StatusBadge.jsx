"use client";
const STATUS_CONFIG = {
  Created:    { label: "Created",     bg: "var(--color-border)",      color: "var(--color-text-dim)" },
  Funded:     { label: "Funded",      bg: "var(--color-stellar-dim)", color: "var(--color-stellar-bright)" },
  InProgress: { label: "In Progress", bg: "var(--color-nova-dim)",    color: "var(--color-nova)" },
  Submitted:  { label: "Submitted",   bg: "var(--color-plasma-dim)",  color: "var(--color-plasma-glow)" },
  Approved:   { label: "Approved",    bg: "#064e3b",                  color: "var(--color-success)" },
  Rejected:   { label: "Rejected",    bg: "#450a0a",                  color: "var(--color-danger)" },
  Cancelled:  { label: "Cancelled",   bg: "var(--color-border)",      color: "var(--color-muted)" },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Created;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "var(--font-mono)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.color }}
      />
      {cfg.label}
    </span>
  );
}