"use client";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job }) {
  const {
    id = "—",
    title = "Untitled Job",
    metadata_hash = "",
    total_amount = 0,
    status = "Created",
    deadline = 0,
    requester = "",
  } = job || {};

  const deadlineDate = deadline
    ? new Date(deadline * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  const xlm = (total_amount / 1e7).toFixed(2);

  return (
    <a
      href={`/jobs/${id}`}
      className="group block panel p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ textDecoration: "none" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-plasma)";
        e.currentTarget.style.boxShadow = "0 0 30px -8px color-mix(in oklch, var(--color-plasma) 30%, transparent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ background: "var(--color-border)", color: "var(--color-text-dim)" }}
          >
            #{id}
          </span>
          <StatusBadge status={status} />
        </div>
        {/* Amount */}
        <div className="text-right">
          <div
            className="font-semibold text-sm"
            style={{ color: "var(--color-stellar-bright)", fontFamily: "var(--font-display)" }}
          >
            {xlm} XLM
          </div>
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-base mb-1 transition-colors duration-200 group-hover:text-white line-clamp-2"
        style={{ color: "var(--color-text-bright)", fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>

      {/* IPFS hash */}
      <p
        className="text-xs truncate mb-4"
        style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}
      >
        {metadata_hash ? `ipfs://${metadata_hash}` : "No metadata"}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3 border-t text-xs"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}
      >
        <span className="truncate max-w-[140px]">
          {requester ? `${requester.slice(0, 6)}…${requester.slice(-4)}` : "—"}
        </span>
        <span>Deadline: {deadlineDate}</span>
      </div>

      {/* Hover CTA */}
      <div
        className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
        style={{ color: "var(--color-plasma-glow)", fontFamily: "var(--font-display)" }}
      >
        View Details
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  );
}