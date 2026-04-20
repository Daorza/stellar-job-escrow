"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StatusBadge from "../../../components/StatusBadge";
import { fundJob, takeJob, submitWork, approveWork, getJob } from "../../../lib/contract";

function ActionButton({ label, color = "var(--color-plasma)", onClick, loading, disabled, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: color,
        color: "#fff",
        fontFamily: "var(--font-display)",
        boxShadow: `0 0 20px -6px color-mix(in oklch, ${color} 50%, transparent)`,
      }}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        : icon}
      {label}
    </button>
  );
}

// Mock job data — replace with actual getJob() call
const MOCK = {
  id: 1,
  title: "Translate English docs to Bahasa Indonesia",
  description: "Translate 2,000 words of technical documentation about Stellar blockchain from English to Bahasa Indonesia. Maintain technical accuracy, preserve formatting.",
  metadata_hash: "QmXoYpxk3K9AbCdEfGhIjKlMnOpQrStUvWxYz",
  total_amount: 50000000,
  status: "Funded",
  deadline: 1780000000,
  requester: "GBXYZ1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234UVWX5678YZ",
  worker: null,
  submission_hash: null,
  created_at: 1775000000,
};

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(MOCK);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [submissionHash, setSubmissionHash] = useState("");
  const [showSubmitInput, setShowSubmitInput] = useState(false);

  const [wallet, setWallet] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("wallet_address");
    if (saved) setWallet(saved);
    setMounted(true);
  }, []);

  const isRequester = wallet && job.requester.startsWith(wallet?.slice(0, 6) || "NONE");
  const isWorker = wallet && job.worker && job.worker.startsWith(wallet?.slice(0, 6) || "NONE");
  const xlm = (job.total_amount / 1e7).toFixed(2);
  const deadlineDate = new Date(job.deadline * 1000).toLocaleDateString("en-US", { dateStyle: "medium" });

  async function act(label, fn) {
    if (!wallet) return setActionMsg("Connect wallet first.");
    setLoading(true);
    setActionMsg(`${label}…`);
    try {
      await fn();
      setActionMsg(`${label} successful!`);
      // In production: refetch job state from chain
    } catch (e) {
      setActionMsg(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

   if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12" style={{ fontFamily: "var(--font-body)" }}>
        <a href="/jobs" className="inline-flex items-center gap-1.5 text-xs mb-8"
          style={{ color: "var(--color-text-dim)" }}>
          ← Back to Jobs
        </a>
        {/* Skeleton loading */}
        <div className="panel p-6 animate-pulse space-y-3">
          <div className="h-4 w-24 rounded" style={{ background: "var(--color-border)" }} />
          <div className="h-7 w-3/4 rounded" style={{ background: "var(--color-border)" }} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-12" style={{ fontFamily: "var(--font-body)" }}>

      {/* Back */}
      <a
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors duration-200"
        style={{ color: "var(--color-text-dim)" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-base)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-dim)"}
      >
        ← Back to Jobs
      </a>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: "var(--color-border)", color: "var(--color-text-dim)" }}
            >
              #{job.id}
            </span>
            <StatusBadge status={job.status} />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            {job.title}
          </h1>
        </div>
        <div
          className="text-right shrink-0 panel px-4 py-3"
        >
          <div
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-stellar-bright)" }}
          >
            {xlm}
          </div>
          <div className="text-xs" style={{ color: "var(--color-text-dim)" }}>XLM</div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Deadline", value: deadlineDate },
          { label: "Requester", value: `${job.requester.slice(0, 6)}…${job.requester.slice(-4)}`, mono: true },
          { label: "Worker", value: job.worker ? `${job.worker.slice(0, 6)}…${job.worker.slice(-4)}` : "Open", mono: true },
        ].map(({ label, value, mono }) => (
          <div key={label} className="panel p-4">
            <div className="text-xs mb-1" style={{ color: "var(--color-text-dim)" }}>{label}</div>
            <div
              className="text-sm font-medium truncate"
              style={{
                color: "var(--color-text-base)",
                fontFamily: mono ? "var(--font-mono)" : "var(--font-display)",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="panel p-6 mb-6">
        <h2
          className="text-sm font-semibold mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-dim)" }}
        >
          Description
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-base)" }}>
          {job.description}
        </p>
      </div>

      {/* IPFS Hash */}
      <div className="panel p-5 mb-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--color-text-dim)" }}>Metadata (IPFS)</div>
            <div
              className="text-sm truncate"
              style={{ color: "var(--color-stellar-bright)", fontFamily: "var(--font-mono)" }}
            >
              ipfs://{job.metadata_hash}
            </div>
          </div>
          <a
            href={`https://ipfs.io/ipfs/${job.metadata_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
            style={{
              background: "var(--color-border)",
              color: "var(--color-text-dim)",
              fontFamily: "var(--font-display)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-border-bright)"; e.currentTarget.style.color = "var(--color-text-base)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-dim)"; }}
          >
            View ↗
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="panel p-6 space-y-4">
        <h2
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-dim)" }}
        >
          Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          {/* Worker: Take Job */}
          {job.status === "Funded" && (
            <ActionButton
              label="Take Job"
              color="var(--color-stellar)"
              icon="🙋"
              loading={loading}
              onClick={() => act("take_job", () => takeJob(wallet, job.id))}
            />
          )}

          {/* Worker: Submit Work */}
          {job.status === "InProgress" && (
            <>
              <ActionButton
                label={showSubmitInput ? "Cancel" : "Submit Work"}
                color="var(--color-nova)"
                icon="📤"
                loading={false}
                onClick={() => setShowSubmitInput((v) => !v)}
              />
              {showSubmitInput && (
                <div className="w-full space-y-3">
                  <input
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-base)",
                      borderRadius: "10px",
                      fontFamily: "var(--font-mono)",
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "13px",
                      outline: "none",
                    }}
                    placeholder="IPFS submission hash…"
                    value={submissionHash}
                    onChange={(e) => setSubmissionHash(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-nova)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
                  />
                  <ActionButton
                    label="Confirm Submission"
                    color="var(--color-nova)"
                    loading={loading}
                    onClick={() => act("submit_work", () => submitWork(wallet, job.id, submissionHash))}
                  />
                </div>
              )}
            </>
          )}

          {/* Requester: Approve / Reject */}
          {job.status === "Submitted" && (
            <>
              <ActionButton
                label="Approve & Pay"
                color="var(--color-success)"
                icon="✅"
                loading={loading}
                onClick={() => act("approve_work", () => approveWork(wallet, job.id))}
              />
              <ActionButton
                label="Reject"
                color="var(--color-danger)"
                icon="❌"
                loading={loading}
                onClick={() => act("reject_work", () => {})}
              />
            </>
          )}

          {(job.status === "Approved" || job.status === "Cancelled") && (
            <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
              This job is {job.status.toLowerCase()}. No further actions available.
            </p>
          )}
        </div>

        {/* Status message */}
        {actionMsg && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-dim)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {actionMsg}
          </div>
        )}

        {!wallet && (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            Connect wallet to interact with this job.
          </p>
        )}
      </div>
    </div>
  );
}