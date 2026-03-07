import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const REVIEW_API = `${import.meta.env.VITE_BACKEND_URI}/rate`;

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function RatingCircle({ value, max = 10 }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = (value / max) * circ;
  const hue = Math.round((value / max) * 120);
  const color = `hsl(${hue}, 90%, 55%)`;

  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>/{max}</span>
      </div>
    </div>
  );
}

function ReviewCard({ review, index }) {
  const date = new Date(review.createdAt);
  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const hue = Math.round((review.rating / 10) * 120);
  const ratingColor = `hsl(${hue}, 90%, 55%)`;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 24px",
        animation: `slideUp 0.4s ease both`,
        animationDelay: `${index * 0.07}s`,
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.055)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: review.review ? 14 : 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, hsl(${(index * 47 + 200) % 360},70%,50%), hsl(${(index * 47 + 240) % 360},70%,40%))`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace"
        }}>
          {(review.userId?.name || "U").charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                {review.userId?.name || "Anonymous"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 12, fontWeight: 800, color: ratingColor,
                background: `${ratingColor}15`, border: `1px solid ${ratingColor}30`,
                borderRadius: 6, padding: "2px 8px", fontFamily: "'DM Mono', monospace"
              }}>
                {review.rating}/10
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                <CalendarIcon />{formatted}
              </span>
            </div>
          </div>
        </div>
      </div>
      {review.review && (
        <p style={{
          margin: 0, marginLeft: 52, color: "rgba(255,255,255,0.6)", fontSize: 14,
          lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif",
          borderLeft: `2px solid rgba(255,255,255,0.08)`, paddingLeft: 16
        }}>
          {review.review}
        </p>
      )}
    </div>
  );
}

export function Review() {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const textareaRef = useRef(null);

  const fetchReviewsAndRating = async () => {
    try {
      setFetchingReviews(true);
      const [ratingRes, reviewsRes] = await Promise.all([
        axios.get(`${REVIEW_API}/rating/${id}`),
        axios.get(`${REVIEW_API}/reviews/${id}`),
      ]);
      setAvgRating(parseFloat(ratingRes.data.avgRating?.toFixed(1)) || 0);
      setTotalUsers(ratingRes.data.totalUsers || 0);
      setReviews(reviewsRes.data.reviews || []);
    } catch (err) {
      console.error("fetch failed", err);
    } finally {
      setFetchingReviews(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviewsAndRating();
  }, [id]);

  const postReview = async () => {
    if (!rating) { setError("Please select a rating first."); return; }
    setError("");
    setLoading(true);
    try {
      await axios.post(`${REVIEW_API}/rate/${id}`, { rating, review }, { withCredentials: true });
      setSuccess(true);
      setReview("");
      setRating(null);
      await fetchReviewsAndRating();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        @keyframes successPop {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        .rating-btn {
          position: relative;
          width: 44px; height: 44px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Mono', monospace;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .rating-btn:hover {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          transform: translateY(-2px);
        }
        .rating-btn.active {
          border-color: transparent;
          color: #0a0a0a;
          transform: translateY(-2px) scale(1.08);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .submit-btn {
          height: 46px;
          border-radius: 12px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .review-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          padding: 16px 18px;
          resize: none;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .review-textarea:focus {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.065);
        }
        .review-textarea::placeholder { color: rgba(255,255,255,0.22); }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#0d0d10",
        minHeight: "100vh",
        color: "white",
        padding: "40px 20px",
        animation: "fadeIn 0.5s ease"
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 28,
            animation: "slideUp 0.5s ease both"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18,
              padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 18
            }}>
              <RatingCircle value={avgRating} />
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 4 }}>
                  Average Rating
                </p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                  {fetchingReviews ? <span className="skeleton" style={{ display: "inline-block", width: 60, height: 26 }} /> : avgRating || "—"}
                </p>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18,
              padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 18
            }}>
              <div style={{
                width: 56, height: 56, flexShrink: 0, borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.5)"
              }}>
                <UserIcon />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 4 }}>
                  Total Reviews
                </p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                  {fetchingReviews ? <span className="skeleton" style={{ display: "inline-block", width: 40, height: 26 }} /> : totalUsers}
                </p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "28px",
            marginBottom: 28,
            animation: "slideUp 0.5s ease 0.1s both"
          }}>
            <h2 style={{ margin: "0 0 22px", fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.2px" }}>
              Rate this Movie
            </h2>

            {/* Rating selector */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>
                {displayRating ? `Your rating: ${displayRating}/10` : "Select a score"}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                  const isActive = displayRating !== null && n <= displayRating;
                  const hue = Math.round((n / 10) * 120);
                  const bgColor = isActive ? `hsl(${hue}, 85%, 52%)` : undefined;
                  return (
                    <button
                      key={n}
                      className={`rating-btn${isActive ? " active" : ""}`}
                      style={isActive ? { background: bgColor, color: n <= 3 ? "white" : "#0a0a0a" } : {}}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoveredRating(n)}
                      onMouseLeave={() => setHoveredRating(null)}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review textarea */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>
                Your Review <span style={{ color: "rgba(255,255,255,0.18)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </p>
              <textarea
                ref={textareaRef}
                className="review-textarea"
                rows={4}
                placeholder="Share your thoughts about this movie..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                maxLength={500}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: review.length > 450 ? "rgba(255,130,80,0.7)" : "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
                  {review.length}/500
                </span>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{
                background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)",
                borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                color: "rgba(255,130,110,0.9)", fontSize: 13, animation: "slideUp 0.3s ease"
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: "rgba(80,220,120,0.1)", border: "1px solid rgba(80,220,120,0.2)",
                borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                color: "rgba(100,230,140,0.9)", fontSize: 13, animation: "successPop 0.4s ease"
              }}>
                ✓ Your review was submitted successfully!
              </div>
            )}

            <button
              className="submit-btn"
              style={{
                width: "100%",
                background: rating
                  ? `linear-gradient(135deg, hsl(${Math.round((rating/10)*120)},75%,45%), hsl(${Math.round((rating/10)*120)+20},80%,35%))`
                  : "rgba(255,255,255,0.07)",
                color: rating ? "white" : "rgba(255,255,255,0.3)",
              }}
              onClick={postReview}
              disabled={loading || !rating}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          {/* Reviews List */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                Community Reviews
              </h3>
              {!fetchingReviews && reviews.length > 0 && (
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              )}
            </div>

            {fetchingReviews ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 24px" }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                      <div className="skeleton" style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 11, width: "25%" }} />
                      </div>
                    </div>
                    <div className="skeleton" style={{ height: 13, width: "85%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 13, width: "60%" }} />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "40px 24px", textAlign: "center"
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reviews.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}