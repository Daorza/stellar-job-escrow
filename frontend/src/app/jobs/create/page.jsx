"use client";

import { useState } from "react";
import { createJob, fundJob } from "../../../lib/contract";

function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--color-text-bright)", fontFamily: "var(--font-display)" }}
        >
          {label}
        </label>
        {hint && (
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</p>
      )}
    </div>
  );
}

const inputStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-base)",
  borderRadius: "10px",
  fontFamily: "var(--font-body)",
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function CreateJobPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    metadata_hash: "",
    amount: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // form | confirm | success
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const wallet =
    typeof window !== "undefined"
      ? sessionStorage.getItem("wallet_address")
      : null;

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.metadata_hash.trim()) e.metadata_hash = "IPFS hash is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.deadline) e.deadline = "Deadline is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (!wallet) return setStatusMsg("Connect your wallet first.");
    setStep("confirm");
  }

  async function handleConfirm() {
    setLoading(true);
    setStatusMsg("Creating job on-chain…");
    try {
      const deadlineTs = Math.floor(new Date(form.deadline).getTime() / 1000);
      const amountStroops = Math.floor(Number(form.amount) * 1e7);
      const result = await createJob(
        wallet,
        form.metadata_hash,
        amountStroops,
        deadlineTs
      );
      const id = result?.returnValue || result?.hash?.slice(0, 8) || "—";
      setJobId(id);
      setStatusMsg("Funding escrow…");
      await fundJob(wallet, id);
      setStep("success");
    } catch (e) {
      setStatusMsg(`Error: ${e.message}`);
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center" style={{ fontFamily: "var(--font-body)" }}>
        <div className="text-6xl mb-6">🎉</div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
        >
          Job Created & Funded!
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-dim)" }}>
          Your job is live on Stellar testnet and ready for workers.
        </p>
        <div
          className="panel p-4 mb-8 font-mono text-sm"
          style={{ color: "var(--color-stellar-bright)" }}
        >
          Job ID: #{jobId}
        </div>
        <div className="flex gap-3 justify-center">
          <a
            href="/jobs"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--color-plasma)", color: "#fff", fontFamily: "var(--font-display)" }}
          >
            View All Jobs
          </a>
          <button
            onClick={() => { setStep("form"); setForm({ title: "", description: "", metadata_hash: "", amount: "", deadline: "" }); }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--color-panel)", color: "var(--color-text-base)", border: "1px solid var(--color-border)", fontFamily: "var(--font-display)" }}
          >
            Post Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="mb-10">
        <a
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs mb-6 transition-colors duration-200"
          style={{ color: "var(--color-text-dim)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-base)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-dim)"}
        >
          ← Back to Jobs
        </a>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
        >
          Post a Job
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--color-text-dim)" }}>
          Funds are locked in escrow until you approve the work.
        </p>
      </div>

      {step === "confirm" ? (
        /* Confirm screen */
        <div className="panel p-8 space-y-6">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-bright)" }}
          >
            Confirm & Sign
          </h2>
          <div className="space-y-3">
            {[
              ["Title", form.title],
              ["IPFS Hash", form.metadata_hash],
              ["Budget", `${form.amount} XLM`],
              ["Deadline", new Date(form.deadline).toLocaleDateString()],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span style={{ color: "var(--color-text-dim)" }}>{k}</span>
                <span
                  className="font-medium max-w-xs text-right truncate"
                  style={{ color: "var(--color-text-base)", fontFamily: k === "IPFS Hash" ? "var(--font-mono)" : "inherit" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: "color-mix(in oklch, var(--color-nova) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--color-nova) 20%, transparent)", color: "var(--color-nova)" }}
          >
            ⚠️ This will sign 2 transactions: create job + fund escrow.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--color-border)", color: "var(--color-text-base)", fontFamily: "var(--font-display)" }}
            >
              Edit
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "var(--color-plasma)", color: "#fff", fontFamily: "var(--font-display)" }}
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? statusMsg : "Sign & Deploy"}
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="panel p-8 space-y-6">
          <Field label="Job Title" error={errors.title}>
            <input
              style={inputStyle}
              placeholder="e.g. Translate 500 words English → Indonesian"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              onFocus={(e) => e.target.style.borderColor = "var(--color-plasma)"}
              onBlur={(e) => e.target.style.borderColor = errors.title ? "var(--color-danger)" : "var(--color-border)"}
            />
          </Field>

          <Field label="Description" hint="Optional">
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
              placeholder="Describe the task, requirements, and deliverables…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              onFocus={(e) => e.target.style.borderColor = "var(--color-plasma)"}
              onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
            />
          </Field>

          <Field label="IPFS Metadata Hash" hint="From IPFS upload" error={errors.metadata_hash}>
            <input
              style={{ ...inputStyle, fontFamily: "var(--font-mono)", fontSize: 13 }}
              placeholder="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
              value={form.metadata_hash}
              onChange={(e) => set("metadata_hash", e.target.value)}
              onFocus={(e) => e.target.style.borderColor = "var(--color-plasma)"}
              onBlur={(e) => e.target.style.borderColor = errors.metadata_hash ? "var(--color-danger)" : "var(--color-border)"}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Budget (XLM)" error={errors.amount}>
              <input
                type="number"
                min="0"
                step="0.1"
                style={inputStyle}
                placeholder="10.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--color-plasma)"}
                onBlur={(e) => e.target.style.borderColor = errors.amount ? "var(--color-danger)" : "var(--color-border)"}
              />
            </Field>

            <Field label="Deadline" error={errors.deadline}>
              <input
                type="date"
                style={inputStyle}
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--color-plasma)"}
                onBlur={(e) => e.target.style.borderColor = errors.deadline ? "var(--color-danger)" : "var(--color-border)"}
              />
            </Field>
          </div>

          {!wallet && (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "color-mix(in oklch, var(--color-danger) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--color-danger) 20%, transparent)", color: "var(--color-danger)" }}
            >
              ⚠️ Connect your wallet before submitting.
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: "var(--color-plasma)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              boxShadow: "0 0 24px -6px color-mix(in oklch, var(--color-plasma) 50%, transparent)",
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}