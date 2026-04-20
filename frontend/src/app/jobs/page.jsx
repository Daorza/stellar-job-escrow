"use client";

import { useState, useEffect } from "react";
import JobCard from "../../components/JobCard";

const STATUS_FILTERS = ["All", "Funded", "InProgress", "Submitted", "Approved"];

// Mock data — replace with actual contract.getJob() calls
const MOCK_JOBS = [
  { id: 1, title: "Translate English docs to Bahasa Indonesia", metadata_hash: "QmXoYpxk3K9", total_amount: 50000000, status: "Funded", deadline: 1780000000, requester: "GBXYZ...1234" },
  { id: 2, title: "Design landing page UI mockup (Figma)", metadata_hash: "QmAbCdEfGhIj", total_amount: 120000000, status: "InProgress", deadline: 1779000000, requester: "GABC...5678" },
  { id: 3, title: "Write unit tests for Soroban contract", metadata_hash: "QmKlMnOpQrSt", total_amount: 80000000, status: "Submitted", deadline: 1778000000, requester: "GDEF...9012" },
  { id: 4, title: "Data annotation — 500 image labels", metadata_hash: "QmUvWxYzAbCd", total_amount: 200000000, status: "Funded", deadline: 1781000000, requester: "GHIJ...3456" },
  { id: 5, title: "Record 10-minute English voiceover", metadata_hash: "QmEfGhIjKlMn", total_amount: 30000000, status: "Approved", deadline: 1775000000, requester: "GKLM...7890" },
  { id: 6, title: "Debug Next.js hydration error", metadata_hash: "QmOpQrStUvWx", total_amount: 60000000, status: "Funded", deadline: 1782000000, requester: "GNOP...1234" },
];

export default function JobsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_JOBS.filter((j) => {
    const matchStatus = filter === "All" || j.status === filter;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12" style={{ fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
          Open Protocol
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            Browse Jobs
          </h1>
          <a
            href="/jobs/create"
            className="self-start md:self-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--color-plasma)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              boxShadow: "0 0 20px -6px color-mix(in oklch, var(--color-plasma) 50%, transparent)",
            }}
          >
            + Post Job
          </a>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 group">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
            style={{ color: "var(--color-text-dim)" }}
            viewBox="0 0 16 16" fill="none"
          >
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: "var(--color-panel)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-base)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-plasma)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
          />
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  background: active ? "var(--color-plasma)" : "var(--color-panel)",
                  color: active ? "#fff" : "var(--color-text-dim)",
                  border: `1px solid ${active ? "transparent" : "var(--color-border)"}`,
                  fontFamily: "var(--font-display)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs mb-6" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="panel p-16 text-center">
          <div className="text-4xl mb-4">🔭</div>
          <p style={{ color: "var(--color-text-dim)" }}>No jobs found.</p>
        </div>
      )}
    </div>
  );
}