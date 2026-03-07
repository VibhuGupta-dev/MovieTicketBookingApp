import { Footer } from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useState } from "react";

// ── Dummy data ──
const OFFERS = [
  {
    id: 1,
    tag: "🔥 Hot Deal",
    title: "Buy 2 Get 1 Free",
    desc: "Grab 3 tickets for the price of 2 every Tuesday. Valid on all screens.",
    code: "TRIO2FREE",
    discount: "33% OFF",
    color: "#f59e0b",
    bg: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    expires: "31 Dec 2025",
  },
  {
    id: 2,
    tag: "💳 Bank Offer",
    title: "HDFC Cardholders",
    desc: "Get flat ₹150 off on every booking made with HDFC Debit or Credit Card.",
    code: "HDFC150",
    discount: "₹150 OFF",
    color: "#6366f1",
    bg: "from-indigo-500/10 to-violet-500/5",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
    expires: "28 Feb 2026",
  },
  {
    id: 3,
    tag: "🎬 Weekend Special",
    title: "Weekend Blockbuster",
    desc: "20% off on all IMAX & 3D tickets every Saturday and Sunday.",
    code: "WKND20",
    discount: "20% OFF",
    color: "#ec4899",
    bg: "from-pink-500/10 to-rose-500/5",
    border: "border-pink-500/20",
    badge: "bg-pink-500/15 text-pink-400 border-pink-500/25",
    expires: "15 Jan 2026",
  },
  {
    id: 4,
    tag: "🎓 Student",
    title: "Student Discount",
    desc: "Valid college ID? Enjoy 25% off on any movie, any day, any screen.",
    code: "STUDENT25",
    discount: "25% OFF",
    color: "#10b981",
    bg: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    expires: "Ongoing",
  },
  {
    id: 5,
    tag: "🌙 Late Night",
    title: "Midnight Madness",
    desc: "Book a show after 10 PM and pay only ₹99 per ticket — all genres.",
    code: "MIDNIGHT99",
    discount: "₹99 FLAT",
    color: "#8b5cf6",
    bg: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    expires: "30 Nov 2025",
  },
  {
    id: 6,
    tag: "👨‍👩‍👧 Family",
    title: "Family Pack",
    desc: "Book 4 or more tickets together and save ₹200 instantly on your order.",
    code: "FAM200",
    discount: "₹200 OFF",
    color: "#f97316",
    bg: "from-orange-500/10 to-red-500/5",
    border: "border-orange-500/20",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    expires: "31 Mar 2026",
  },
];

const FEATURED = {
  title: "PREMIERE PASS",
  subtitle: "Unlimited Movies This Month",
  desc: "Watch as many movies as you want across all screens — IMAX, 3D, 4DX. One flat price, zero limits.",
  price: "₹499",
  period: "/ month",
  code: "PREMIEREPASS",
  perks: ["All screens included", "No booking fee", "Priority seating", "Free popcorn combo (first visit)"],
};

// ── Copy-to-clipboard mini component ──
function CopyCode({ code, color }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed transition-all duration-200 hover:scale-105 active:scale-95 group"
      style={{ borderColor: `${color}40`, background: `${color}08` }}>
      <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>
        {code}
      </span>
      <span className="text-[10px] font-semibold" style={{ color: copied ? "#4ade80" : `${color}80` }}>
        {copied ? "✓ Copied!" : "COPY"}
      </span>
    </button>
  );
}

export function Offer() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#070b14] relative overflow-x-hidden">

        {/* ── bg atmosphere ── */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px]" />
        </div>
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">

          {/* ── Page Header ── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="text-amber-400 text-sm">🎟️</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-400">Exclusive Deals</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              Offers &{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Savings
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-pink-400 rounded-full" />
              </span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              Unlock the best deals on movies, snacks, and more. Copy a code and save instantly at checkout.
            </p>
          </div>

          {/* ── Featured Banner ── */}
          <div className="relative mb-12 rounded-3xl overflow-hidden border border-white/[0.07]"
            style={{ background: "linear-gradient(135deg, #0f1629 0%, #0a0e1a 50%, #12062a 100%)" }}>

            {/* decorative film strip top */}
            <div className="absolute top-0 left-0 right-0 h-3 flex overflow-hidden opacity-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-8 h-3 border-r-2 border-white/30 bg-white/5" />
              ))}
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* left */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/25 rounded-full px-3 py-1 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Featured Offer</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  {FEATURED.title}
                </h2>
                <p className="text-lg text-violet-300 font-semibold mb-3">{FEATURED.subtitle}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">{FEATURED.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {FEATURED.perks.map((perk) => (
                    <span key={perk} className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1">
                      <span className="text-violet-400">✓</span> {perk}
                    </span>
                  ))}
                </div>
                <CopyCode code={FEATURED.code} color="#8b5cf6" />
              </div>

              {/* right — price pill */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-40 h-40 rounded-3xl border border-violet-500/25 bg-violet-500/10 backdrop-blur-sm">
                <span className="text-3xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {FEATURED.price}
                </span>
                <span className="text-xs text-violet-400 font-semibold mt-1">{FEATURED.period}</span>
                <div className="mt-3 w-16 h-px bg-violet-500/30" />
                <span className="text-[10px] text-gray-600 mt-2 uppercase tracking-wider">per month</span>
              </div>
            </div>

            {/* decorative film strip bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-3 flex overflow-hidden opacity-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-8 h-3 border-r-2 border-white/30 bg-white/5" />
              ))}
            </div>
          </div>

          {/* ── Section label ── */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-600">All Offers</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-[11px] text-gray-700">{OFFERS.length} deals available</span>
          </div>

          {/* ── Offer Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFERS.map((offer, i) => (
              <div key={offer.id}
                className={`group relative bg-gradient-to-br ${offer.bg} border ${offer.border} rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl overflow-hidden`}
                style={{ animationDelay: `${i * 80}ms` }}>

                {/* glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `inset 0 0 40px ${offer.color}10` }} />

                {/* discount badge — top right */}
                <div className="absolute top-4 right-4">
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border ${offer.badge} tracking-wide`}>
                    {offer.discount}
                  </span>
                </div>

                <div className="relative">
                  {/* tag */}
                  <span className="text-xs text-gray-600 font-medium mb-3 block">{offer.tag}</span>

                  {/* title */}
                  <h3 className="text-lg font-bold text-white mb-2 pr-16" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {offer.title}
                  </h3>

                  {/* desc */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-5">{offer.desc}</p>

                  {/* divider */}
                  <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${offer.color}30, transparent)` }} />

                  {/* bottom row */}
                  <div className="flex items-center justify-between gap-3">
                    <CopyCode code={offer.code} color={offer.color} />
                    <span className="text-[10px] text-gray-700 flex-shrink-0">
                      Expires: {offer.expires}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Terms strip ── */}
          <div className="mt-12 text-center">
            <p className="text-[11px] text-gray-700 leading-relaxed max-w-xl mx-auto">
              * All offers are subject to availability and may be withdrawn without prior notice.
              Codes cannot be combined. Valid on selected shows only. T&amp;C apply.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}