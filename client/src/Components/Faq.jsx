import { useState } from "react";

const faqs = [
  {
    category: "Booking",
    items: [
      {
        q: "How do I book a ticket?",
        a: "Browse movies on the homepage, select a showtime that works for you, pick your seats on the interactive seat map, and complete payment. Your ticket will be sent to your registered email instantly.",
      },
      {
        q: "Can I cancel or reschedule my booking?",
        a: "Yes, cancellations are allowed up to 2 hours before the show starts. Reschedules depend on seat availability for the new showtime. Go to 'My Bookings' in your profile to manage your tickets.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI, credit/debit cards, net banking, and popular wallets like Paytm and PhonePe. All transactions are secured with industry-standard encryption.",
      },
    ],
  },
  {
    category: "Cinemas & Shows",
    items: [
      {
        q: "How do I find cinemas near me?",
        a: "Use the city and state filters on the homepage to browse available cinemas in your area. Each cinema page shows its address, a Google Maps link, and all upcoming shows.",
      },
      {
        q: "What does 2D / 3D mean on the movie listing?",
        a: "2D refers to standard flat projection. 3D requires special glasses provided at the cinema counter for an immersive viewing experience. Pricing may differ between formats.",
      },
      {
        q: "Are shows listed in real-time?",
        a: "Yes. Cinema owners update show schedules directly and changes are reflected immediately. We recommend re-checking availability close to your visit.",
      },
    ],
  },
  {
    category: "For Cinema Owners",
    items: [
      {
        q: "How do I register my cinema on the platform?",
        a: "Sign up with an owner account, verify your email, then head to the Owner Dashboard. You can add your cinema hall, set up rows and seats, and start scheduling shows right away.",
      },
      {
        q: "Can I manage multiple cinema halls?",
        a: "Absolutely. Your Owner Dashboard lets you add and manage as many cinema halls as you own, each with independent show schedules and seating configurations.",
      },
      {
        q: "How do I add or edit shows?",
        a: "From the Owner Dashboard, click 'Manage Shows' on any of your cinema cards. You can schedule new shows by selecting a movie, date, and time slots — or edit and delete existing ones.",
      },
    ],
  },
];

const ChevronIcon = ({ open }) => (
  <svg
    className={`h-4 w-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180 text-purple-400" : ""}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        open
          ? "border-purple-500/40 bg-purple-500/5"
          : "border-gray-800 bg-black hover:border-gray-700"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold w-5 flex-shrink-0 tabular-nums transition-colors ${open ? "text-purple-400" : "text-gray-600"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`text-sm font-semibold transition-colors ${open ? "text-white" : "text-gray-300"}`}>
            {q}
          </span>
        </div>
        <ChevronIcon open={open} />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed pl-14">
          {a}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);

  const current = faqs.find((f) => f.category === activeCategory);

  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Support</p>
          <h2 className="text-white text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-sm">Everything you need to know about booking and managing shows.</p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-8 bg-black border border-gray-800 rounded-xl p-1">
          {faqs.map((f) => (
            <button
              key={f.category}
              onClick={() => setActiveCategory(f.category)}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeCategory === f.category
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {f.category}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-2">
          {current.items.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center border border-gray-800 rounded-2xl p-6 bg-black">
          <p className="text-gray-400 text-sm mb-3">Still have questions?</p>
          <a
            href="mailto:support@cinebook.in"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </div>

      </div>
    </section>
  );
}