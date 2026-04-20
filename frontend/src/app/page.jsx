"use client";

import { useState } from "react";
import WalletButton from "../components/WalletButton";

const STATS = [
  { value: "< 5s", label: "Settlement Time" },
  { value: "~0.001", label: "XLM per tx" },
  { value: "100%", label: "On-chain Escrow" },
  { value: "0", label: "Intermediaries" },
];

const STEPS = [
  {
    n: "01",
    title: "Post a Job",
    desc: "Requesters create a task with IPFS metadata, set a budget and deadline. Funds are locked in smart contract escrow instantly.",
    color: "var(--color-plasma)",
  },
  {
    n: "02",
    title: "Take & Work",
    desc: "Workers browse open jobs and accept tasks. No middleman approval needed — it's permissionless and borderless.",
    color: "var(--color-stellar)",
  },
  {
    n: "03",
    title: "Submit & Get Paid",
    desc: "Worker submits proof via IPFS hash. Requester approves and payment is released atomically on-chain.",
    color: "var(--color-nova)",
  },
];

export default function HomePage() {
  const [wallet, setWallet] = useState(null);

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        {/* Grid bg */}
        <div className="absolute inset-0 grid-noise opacity-30" />

        {/* Glow orbs */}
        <div
          className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            width: 600, height: 600,
            background: "var(--color-plasma)",
            top: -200, left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{
            width: 400, height: 400,
            background: "var(--color-stellar)",
            bottom: 0, right: -100,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: "var(--color-plasma-dim)",
              color: "var(--color-plasma-glow)",
              border: "1px solid color-mix(in oklch, var(--color-plasma) 30%, transparent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--color-plasma-glow)" }} />
            Live on Stellar Testnet
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            Work Without{" "}
            <span className="text-gradient-plasma">Borders</span>
            <br />or Middlemen
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--color-text-dim)" }}
          >
            A trustless micro-task protocol powered by Stellar Soroban smart contracts.
            Post jobs, get paid — automatically and transparently on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/jobs"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: "var(--color-plasma)",
                color: "#fff",
                fontFamily: "var(--font-display)",
                boxShadow: "0 0 30px -6px color-mix(in oklch, var(--color-plasma) 60%, transparent)",
              }}
            >
              Browse Jobs →
            </a>
            <a
              href="/jobs/create"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "var(--color-panel)",
                color: "var(--color-text-bright)",
                border: "1px solid var(--color-border-bright)",
                fontFamily: "var(--font-display)",
              }}
            >
              Post a Job
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="relative mx-6 md:mx-auto max-w-3xl rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
              >
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-dim)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
            Protocol Flow
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="panel p-6 group transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = step.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <div
                className="text-4xl font-bold mb-4 transition-colors duration-300"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-border-bright)" }}
              >
                {step.n}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-32 text-center">
        <div
          className="panel p-12"
          style={{ borderColor: "color-mix(in oklch, var(--color-plasma) 30%, transparent)" }}
        >
          <h2
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            Ready to start?
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-dim)" }}>
            Connect your Freighter wallet to create or accept jobs.
          </p>
          <WalletButton onConnect={setWallet} />
        </div>
      </section>
    </div>
  );
}