import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Stellar MicroWork",
  description: "Decentralized Micro-Task Payment Protocol on Stellar Soroban",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "var(--color-void)" }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}



function WalletButtonInline() {
  // Client component embedded — actual logic in WalletButton.jsx
  return (
    <a
      href="/dashboard"
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: "var(--color-plasma)",
        color: "#fff",
        fontFamily: "var(--font-display)",
        boxShadow: "0 0 20px -4px color-mix(in oklch, var(--color-plasma) 50%, transparent)",
      }}
    >
      <span>Connect Wallet</span>
    </a>
  );
}