import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../Components/Navbar"
const backendUrl = import.meta.env.VITE_BACKEND_URI
const fmt = {
  date: (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  time: (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  amount: (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n),
}

export function Profile() {
  const [user, setUser]               = useState(null)
  const [ticket, setTicket]           = useState(null)
  const [bookedSeats, setBookedSeats] = useState([])
  const [cinemaName, setCinemaName]   = useState(null)
  const [showModal, setShowModal]     = useState(false)
  const [loadingUser, setLoadingUser]     = useState(true)
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [ticketError, setTicketError]     = useState(null)

  useEffect(() => {
    axios
      .get(`${backendUrl}/user/api/me`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(console.error)
      .finally(() => setLoadingUser(false))
  }, [])

  const openTicket = async (ticketId) => {
    setTicket(null)
    setBookedSeats([])
    setCinemaName(null)
    setTicketError(null)
    setShowModal(true)
    setLoadingTicket(true)
    try {
      const res = await axios.get(
        `${backendUrl}/ticket/api/${ticketId}`,
        { withCredentials: true }
      )
      setTicket(res.data.yticket)
      setBookedSeats(res.data.bookedSeats ?? [])
      setCinemaName(res.data.cinemaName ?? null)
    } catch (err) {
      setTicketError("Ticket load nahi hua.")
      console.error(err)
    } finally {
      setLoadingTicket(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setTicket(null)
    setBookedSeats([])
    setCinemaName(null)
  }

  const history    = user?.orderHistory ? [...user.orderHistory].reverse() : []
  const totalSpent = history.reduce((s, o) => s + (o.totalAmount ?? 0), 0)
  const initials   = user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U"

  if (loadingUser) return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-10 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse h-16 rounded-2xl bg-white/[0.04]" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <Navbar />

      {/* ── Ticket Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="w-full sm:max-w-sm bg-[#0d0c18] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            style={{ animation: "slideUp 0.25s cubic-bezier(.32,1.2,.64,1) forwards" }}
          >
            <div className="h-[3px] bg-gradient-to-r from-violet-600 via-indigo-400 to-violet-600" />

            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <button
              onClick={closeModal}
              className="absolute top-5 right-5 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 flex items-center justify-center text-xs transition-all"
            >✕</button>

            <div className="px-6 pb-8 pt-4">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">🎟️</span>
                <h3 className="text-sm font-bold text-white/90">Movie Ticket</h3>
                {cinemaName && (
                  <span className="ml-auto text-[11px] text-violet-400 font-semibold truncate max-w-[120px]">
                    🏛 {cinemaName}
                  </span>
                )}
              </div>

              {/* Loading skeleton */}
              {loadingTicket && (
                <div className="animate-pulse space-y-4">
                  <div className="mx-auto w-48 h-48 rounded-2xl bg-white/[0.08]" />
                  <div className="h-px bg-white/5" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-3 w-16 rounded bg-white/[0.08]" />
                      <div className="h-3 w-24 rounded bg-white/[0.08]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {!loadingTicket && ticketError && (
                <div className="text-center py-10">
                  <p className="text-3xl mb-3">😕</p>
                  <p className="text-sm text-white/40">{ticketError}</p>
                </div>
              )}

              {/* Ticket content */}
              {!loadingTicket && ticket && (
                <>
                  {/* QR Code */}
                  <div className="flex flex-col items-center mb-6">
                    {ticket.qrCode ? (
                      <>
                        <div className="p-3.5 bg-white rounded-2xl shadow-xl shadow-black/50">
                          <img src={ticket.qrCode} alt="QR" className="w-48 h-48 object-contain" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <p className="text-[11px] text-emerald-400 font-semibold">Valid · Show at Entry</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-48 h-48 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-white/20 text-sm">
                        QR generating…
                      </div>
                    )}
                  </div>

                  {/* Perforation line */}
                  <div className="flex items-center my-5 -mx-6">
                    <div className="w-5 h-5 rounded-full bg-[#07070f] flex-shrink-0" />
                    <div className="flex-1 border-t-2 border-dashed border-white/[0.07]" />
                    <div className="w-5 h-5 rounded-full bg-[#07070f] flex-shrink-0" />
                  </div>

                  {/* Details */}
                  <div className="space-y-0 divide-y divide-white/[0.05]">
                    <div className="flex justify-between py-3">
                      <span className="text-[11px] uppercase tracking-wider text-white/25">Ticket ID</span>
                      <span className="font-mono text-[11px] text-white/50">
                        #{String(ticket._id).slice(-8).toUpperCase()}
                      </span>
                    </div>
 <div className="flex justify-between py-3">
                      <span className="text-[11px] uppercase tracking-wider text-white/25">Screen Number</span>
                      <span className="font-mono text-[11px] text-white/50">
                        {String(ticket.ScreenNumber).slice(-8).toUpperCase()}
                      </span>
                    </div>
                    {/* ── SEAT NUMBERS ── */}
                    <div className="py-3">
                      <span className="text-[11px] uppercase tracking-wider text-white/25 block mb-2">
                        Seats ({bookedSeats.length})
                      </span>
                      {bookedSeats.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {bookedSeats.map((seat, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold font-mono"
                            >
                              {seat.seatno}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-white/30">—</span>
                      )}
                    </div>

                    {/* Seat rates summary */}
                    {bookedSeats.length > 0 && (
                      <div className="flex justify-between py-3">
                        <span className="text-[11px] uppercase tracking-wider text-white/25">Per Seat</span>
                        <span className="text-xs text-white/40 font-mono">
                          {[...new Set(bookedSeats.map(s => s.rate))]
                            .map(r => fmt.amount(r))
                            .join(" / ")}
                        </span>
                      </div>
                    )}
                    

                    <div className="flex justify-between py-3">
                      <span className="text-[11px] uppercase tracking-wider text-white/25">Amount</span>
                      <span className="text-sm font-bold text-violet-300">{fmt.amount(ticket.Amount)}</span>
                    </div>

                    <div className="flex justify-between py-3">
                      <span className="text-[11px] uppercase tracking-wider text-white/25">Booked On</span>
                      <span className="text-sm text-white/60">
                        {ticket.bookedAt ? `${fmt.date(ticket.bookedAt)}, ${fmt.time(ticket.bookedAt)}` : "—"}
                      </span>
                    </div>

                    <div className="flex justify-between py-3">
                      <span className="text-[11px] uppercase tracking-wider text-white/25">QR Status</span>
                      {ticket.isQRgenerated
                        ? <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Generated
                          </span>
                        : <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />Pending
                          </span>
                      }
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="relative border-b border-white/[0.05] overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 w-72 h-72 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="max-w-2xl mx-auto px-4 pt-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[17px] font-bold ring-2 ring-violet-400/20 shadow-xl shadow-violet-900/30">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#07070f]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white/95 tracking-tight">{user?.name}</h1>
              <p className="text-sm text-white/30 mt-0.5">{user?.email} · {user?.phoneNumber}</p>
            </div>
          </div>

          <div className="flex border-t border-white/[0.05] -mx-4">
            {[
              { label: "Total Orders", value: history.length },
              { label: "Total Spent",  value: fmt.amount(totalSpent) },
              { label: "Member Since", value: user?.createdAt ? fmt.date(user.createdAt) : "—" },
            ].map((s) => (
              <div key={s.label} className="flex-1 px-5 py-5 border-r border-white/[0.06] last:border-r-0">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-1.5">{s.label}</p>
                <p className="text-xl font-bold text-white/90">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Order History ── */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center gap-2.5 mb-5">
          <h2 className="text-sm font-semibold text-white/60">Order History</h2>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
            {history.length}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-24 text-white/15">
            <div className="text-5xl mb-3 opacity-40">🛍️</div>
            <p className="text-sm">Koi order nahi</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((item, idx) => {
              const hasTicket = Boolean(item.ticketId)
              const isPaid    = item.status === "paid"
              return (
                <div
                  key={item._id}
                  onClick={() => hasTicket && openTicket(item.ticketId)}
                  className={`group flex items-center gap-3.5 rounded-2xl px-5 py-3.5 border transition-all duration-200 bg-white/[0.025] border-white/[0.055] ${
                    hasTicket ? "hover:bg-white/[0.05] hover:border-violet-500/25 cursor-pointer active:scale-[0.985]" : "cursor-default"
                  }`}
                  style={{ opacity: 0, animation: `fadeUp 0.3s ease ${idx * 30}ms forwards` }}
                >
                  <span className="text-[11px] font-mono text-white/15 w-5 text-center flex-shrink-0">
                    {history.length - idx}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-violet-500/8 border border-violet-500/12 flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-violet-500/15 transition-colors">
                    🧾
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-mono text-white/20 truncate">
                      #{String(item.orderId).slice(-10)}
                    </p>
                    <p className="text-[13px] text-white/50 mt-0.5">
                      {fmt.date(item.orderedAt)}
                      <span className="text-white/22 ml-1.5 text-[11px]">{fmt.time(item.orderedAt)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[15px] font-bold text-white/90 tabular-nums">
                      {fmt.amount(item.totalAmount)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-semibold leading-none ${
                        isPaid
                          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {item.status}
                      </span>
                      {hasTicket && (
                        <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold leading-none bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                          🎟️ View
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}