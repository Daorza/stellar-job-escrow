"use client";

import { useState, useEffect } from "react";
import WalletButton from "../../components/WalletButton";
import JobCard from "../../components/JobCard";
import StatusBadge from "../../components/StatusBadge";

const MOCK_MY_JOBS = [
  { id: 1, title: "Translate English docs to Bahasa Indonesia", metadata_hash: "QmXoYpxk3K9", total_amount: 50000000, status: "Funded", deadline: 1780000000, requester: "ME" },
  { id: 3, title: "Write unit tests for Soroban contract", metadata_hash: "QmKlMnOpQrSt", total_amount: 80000000, status: "Submitted", deadline: 1778000000, requester: "ME" },
];

const MOCK_WORKER_JOBS = [
  { id: 2, title: "Design landing page UI mockup (Figma)", metadata_hash: "QmAbCdEfGhIj", total_amount: 120000000, status: "InProgress", deadline: 1779000000, requester: "OTHER" },
];

const STAT_CARDS = [
  { label: "Jobs Posted", value: "2", sub: "as requester", color: "var(--color-plasma)" },
  { label: "Jobs Taken", value: "1", sub: "as worker", color: "var(--color-stellar)" },
  { label: "XLM Earned", value: "0.00", sub: "total paid out", color: "var(--color-nova)" },
  { label: "Success Rate", value: "—", sub: "approved / total", color: "var(--color-success)" },
];

export default function DashboardPage() {
  const [wallet, setWallet] = useState(null);
  const [tab, setTab] = useState("requester");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("wallet_address");
      if (saved) setWallet(saved);
    }
  }, []);

  if (!wallet) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)" }}
        >
          🔒
        </div>
        <div className="text-center">
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            Connect your wallet
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
            Connect Freighter to view your dashboard.
          </p>
        </div>
        <WalletButton onConnect={setWallet} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12" style={{ fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
            Dashboard
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            My Activity
          </h1>
          <p
            className="text-xs mt-1 font-mono"
            style={{ color: "var(--color-text-dim)" }}
          >
            {wallet.slice(0, 8)}…{wallet.slice(-6)}
          </p>
        </div>
        <WalletButton onConnect={setWallet} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="panel p-5 transition-all duration-300 hover:-translate-y-0.5"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-display)", color: s.color }}
            >
              {s.value}
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: "var(--color-text-base)", fontFamily: "var(--font-display)" }}
            >
              {s.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--color-text-dim)" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-8 w-fit"
        style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)" }}
      >
        {[
          { id: "requester", label: "My Posted Jobs" },
          { id: "worker", label: "Jobs I'm Working" },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: active ? "var(--color-plasma)" : "transparent",
                color: active ? "#fff" : "var(--color-text-dim)",
                fontFamily: "var(--font-display)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Job lists */}
      {tab === "requester" && (
        <>
          {MOCK_MY_JOBS.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK_MY_JOBS.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📋"
              title="No jobs posted yet"
              action={{ href: "/jobs/create", label: "Post your first job" }}
            />
          )}
        </>
      )}

      {tab === "worker" && (
        <>
          {MOCK_WORKER_JOBS.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK_WORKER_JOBS.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="You haven't taken any jobs yet"
              action={{ href: "/jobs", label: "Browse open jobs" }}
            />
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ icon, title, action }) {
  return (
    <div className="panel p-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-dim)" }}>{title}</p>
      <a
        href={action.href}
        className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold"
        style={{
          background: "var(--color-plasma)",
          color: "#fff",
          fontFamily: "var(--font-display)",
        }}
      >
        {action.label} →
      </a>
    </div>
  );
}