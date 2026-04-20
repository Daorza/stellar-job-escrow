"use client";

import { useState } from "react";

export default function Navbar() {
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Jobs", href: "/jobs" },
  ];

  return (
    <nav
      className="w-full px-6 py-4 flex items-center justify-between border-b"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Logo */}
      <a
        href="/"
        className="font-semibold text-lg transition-all duration-300"
        style={{
          color: "var(--color-text-bright)",
          fontFamily: "var(--font-display)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-plasma-glow)";
          e.currentTarget.style.textShadow =
            "0 0 12px color-mix(in oklch, var(--color-plasma) 50%, transparent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-text-bright)";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        MicroWork
      </a>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="text-sm transition-all duration-200 relative"
            style={{
              color:
                hovered === index
                  ? "var(--color-stellar-bright)"
                  : "var(--color-text-dim)",
              fontFamily: "var(--font-display)",
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            {item.name}

            {/* underline glow */}
            <span
              className="absolute left-0 -bottom-1 h-[2px] w-full transition-all duration-300"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-plasma), var(--color-stellar))",
                opacity: hovered === index ? 1 : 0,
                boxShadow:
                  hovered === index
                    ? "0 0 10px var(--color-plasma)"
                    : "none",
              }}
            />
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href="/jobs/create"
        className="px-4 py-2 text-sm rounded transition-all duration-300"
        style={{
          background: "var(--color-plasma)",
          color: "white",
          borderRadius: "var(--radius-btn)",
          fontFamily: "var(--font-display)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-plasma-bright)";
          e.currentTarget.style.boxShadow =
            "0 0 20px color-mix(in oklch, var(--color-plasma) 50%, transparent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--color-plasma)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Post Job
      </a>
    </nav>
  );
}