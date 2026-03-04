import { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const links = {
    Explore: ["Menu", "Reservations", "Catering", "Gift Cards"],
    Company: ["About Us", "Careers", "Press", "Blog"],
    Support: ["FAQ", "Contact", "Privacy Policy", "Terms"],
  };

  const socials = [
    {
      name: "Instagram",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "Twitter/X",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
        borderTop: "1px solid #2d1b69",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#e5e5e5",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 0" }}>
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "56px",
          }}
        >
          {/* Brand column */}
          <div style={{ maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🍅
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", letterSpacing: "0.5px" }}>
                  Ristrict
                </div>
                <div style={{ fontSize: "10px", color: "#a855f7", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "500" }}>
                  by Tomato
                </div>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.7", margin: "0 0 20px" }}>
              Where bold flavors meet bold design. Curated dining experiences crafted for those who demand more.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: "12px" }}>
              {socials.map((s) => (
                <button
                  key={s.name}
                  title={s.name}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "8px",
                    background: "#1a1a1a",
                    border: "1px solid #2d1b69",
                    color: "#a855f7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2d1b69";
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1a1a1a";
                    e.currentTarget.style.borderColor = "#2d1b69";
                    e.currentTarget.style.color = "#a855f7";
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#a855f7",
                  marginBottom: "20px",
                }}
              >
                {heading}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontSize: "14px",
                        color: "#9ca3af",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#a855f7",
                marginBottom: "20px",
              }}
            >
              Stay in the loop
            </h4>
            <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "16px", lineHeight: "1.6" }}>
              New menus, events, and exclusive drops — straight to your inbox.
            </p>
            {subscribed ? (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(124, 58, 237, 0.15)",
                  border: "1px solid #7c3aed",
                  color: "#a855f7",
                  fontSize: "14px",
                }}
              >
                ✓ You're subscribed!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1px solid #2d1b69",
                    background: "#1a1a1a",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  style={{
                    padding: "11px 20px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    letterSpacing: "0.5px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#1f1f1f", marginBottom: "24px" }} />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "32px",
            gap: "12px",
          }}
        >
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            © {new Date().getFullYear()} <span style={{ color: "#a855f7" }}>Ristrict by Tomato</span>. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}