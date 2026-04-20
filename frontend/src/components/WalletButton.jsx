"use client";

import { useState, useEffect } from "react";
import { connectWallet } from "../lib/freighter";

export default function WalletButton({ onConnect }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("wallet_address");
      if (saved) {
        setAddress(saved);
        onConnect?.(saved);
      }
    }
  }, []);

  async function handleConnect() {
    setLoading(true);
    try {
      const addr = await connectWallet();
      if (addr) {
        setAddress(addr);
        sessionStorage.setItem("wallet_address", addr);
        onConnect?.(addr);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    setAddress(null);
    sessionStorage.removeItem("wallet_address");
    onConnect?.(null);
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        {/* Connected pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-border-bright)",
            fontFamily: "var(--font-mono)",
            color: "var(--color-stellar-bright)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--color-success)" }}
          />
          {address.slice(0, 4)}…{address.slice(-4)}
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
          style={{
            background: "var(--color-border)",
            color: "var(--color-text-dim)",
            fontFamily: "var(--font-display)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#450a0a";
            e.currentTarget.style.color = "var(--color-danger)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-dim)";
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "var(--color-plasma)",
        color: "#fff",
        fontFamily: "var(--font-display)",
        boxShadow: "0 0 20px -4px color-mix(in oklch, var(--color-plasma) 50%, transparent)",
      }}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Connecting…
        </>
      ) : (
        <>⚡ Connect Wallet</>
      )}
    </button>
  );
}