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
    className={`h-5 w-5 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-4">
          <span className="text-sm font-semibold text-gray-400 w-8 flex-shrink-0 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-medium text-gray-900">
            {q}
          </span>
        </div>
        <ChevronIcon open={open} />
      </button>

      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed pl-20">
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
    <section className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-purple-500 text-sm font-semibold mb-2">Support</p>
          <h2 className="text-gray-900 text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-base">Everything you need to know about booking and managing shows.</p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-3 mb-10 border-b border-gray-200">
          {faqs.map((f) => (
            <button
              key={f.category}
              onClick={() => setActiveCategory(f.category)}
              className={`py-3 px-5 text-sm font-semibold transition-all duration-200 border-b-2 ${
                activeCategory === f.category
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {f.category}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {current.items.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center border border-gray-200 rounded-lg p-8 bg-gray-50">
          <p className="text-gray-700 text-base mb-4 font-medium">Still have questions?</p>
          <a
            href="mailto:support@cinebook.in"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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