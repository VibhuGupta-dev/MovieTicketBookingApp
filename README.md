# Ristrict | Movie Ticket Booking Platform
### Real-time Seats • Secure Payments

**Ristrict** is a full-stack **movie ticket booking web application** built with the **MERN stack + Socket.IO** — inspired by District by Zomato.

Users can browse movies and cinemas by location, select showtimes, lock seats in real time (10-minute hold), pay via Razorpay (test mode), and instantly receive digital tickets — all with clean admin and owner dashboards for cinema and showtime management.

Whether you're exploring movies solo or admins managing theaters, **Ristrict** delivers a smooth, responsive booking experience with a strong focus on real-time reliability and role-based access control.

---

# Live Demo

https://movieticketbookingapp-1.onrender.com

**Backend:** Render  
**Frontend:** Vite + React

Built as an **MVP / portfolio project** with fully functional core flows and dummy admin credentials for quick demo access.

---
⚠️ **Demo Tip**

To see available movies and showtimes in the live demo, select:

State → **Uttar Pradesh**  
City → **Lucknow**

---
# Core Features

## User Experience

- **Location-based discovery**
  - Choose **state → city** to see nearby cinemas

- **Rich movie details**
  - Posters
  - Genres
  - Year
  - Trailers

- Showtime and theater selection

- **Interactive seat map** with live availability

- **10-minute real-time seat locking** via Socket.IO  
  Prevents double-booking

- **Razorpay test-mode checkout** with webhook verification

- Instant **digital e-ticket generation**
  - Displayed on screen
  - Stored in user profile

- Booking history with previously booked tickets

---

# Admin / Owner Panels

### Super Admin
- Can create **admins and cinema owners**

### Cinema Owners / Admins
- **CRUD Cinemas**
  - Name
  - Location
  - Screens
  - Seating layout

- **CRUD Showtimes**
  - Movie
  - Time
  - Price categories
  - Seat configuration

- Add new movies
  - Title
  - Poster
  - Genre
  - Year
  - Description

- **Role-based authentication using JWT**

---

# Demo Notes

For demo convenience:

- Admin/Owner logins use **auto-filled dummy credentials**
- Click-to-fill → automatic redirect

OTP emails are sent via **Resend**, but since a custom domain is not configured yet, OTPs are **displayed on screen during demo**.

---

# Security & Reliability Highlights

- **JWT + bcrypt authentication**
- **OTP verification via Resend**
- **Real-time seat locking** using Socket.IO
- **Razorpay webhook verification** on server
- No sensitive payment data stored
- Razorpay handles **PCI compliance**
- Rate limiting and input validation on critical endpoints

---

# Tech Stack

| Area | Technologies | Notes |
|-----|-----|-----|
| Frontend | React 19, Vite, React Router v6, Axios | Fast builds and HMR |
| Styling | Tailwind CSS | Responsive UI |
| Backend | Node.js, Express, Mongoose | REST API |
| Database | MongoDB | NoSQL database |
| Real-time | Socket.IO | Live seat locking |
| Auth | JWT, bcrypt, Resend (OTP) | Secure authentication |
| Payments | Razorpay (test mode) | Payment processing |
| Utilities | cookie-parser, cors, dotenv | Standard backend utilities |

---

# Application Modes

### Public Mode
- Browse movies
- View showtimes
- Start ticket booking  
(Login required only before payment)

### Authenticated Mode
- Profile access
- Booking history
- Saved tickets

### Admin / Owner Mode
- Cinema management
- Showtime management
- Movie management

---

# Quick Start (Local Development)

## Prerequisites

- Node.js ≥ 18
- MongoDB (Local or Atlas)
- Razorpay test keys (`rzp_test_...`)
- Resend API key

---

# Environment Variables

## Backend (`server/.env`)

```env
MONGO_URI=
EMAIL=
EMAIL_PASS=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET = 
PORT=3000
CLIENT_URL=
RESEND_API_KEY=
```

## Frontend (`client/.env`)

```env
VITE_CITY_API = 
VITE_RAZORPAY_KEY_ID =  
VITE_BACKEND_URI = http://localhost:3000


```

---

# Run Locally

```bash
# Clone repository
git clone https://github.com/yourusername/ristrict.git

cd ristrict
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

# Project Structure

```
ristrict
│
├── client                # React + Vite frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── socket        # Socket.IO client logic
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server                # Node.js + Express backend
│   ├── models
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── utils
│   └── App.js
│
└── README.md
```

---

# Future Improvements

- Docker containerization
- docker-compose setup
- Full AWS deployment
- Email delivery of e-tickets (PDF attachment)
- Booking cancellation and refund flow
- Cinema owner analytics dashboard
- Advanced movie search and filters
- Recommendation system
- Progressive Web App (PWA)
- Better mobile UX

---

# Contributing

This project is mainly a **portfolio / resume showcase**, but contributions are welcome.

You can:

- Open issues for bugs
- Improve documentation
- Submit pull requests
- Suggest features

### Good First Issues

- Add loading skeletons for movie lists
- Improve accessibility (ARIA labels for seat map)
- Add unit tests for booking flow
- Make dummy admin credentials toggleable via `.env`

---

# License

MIT License

---

Built by **Vibhu Gupta (2026)**  


If this project helped or inspired you, consider **starring the repository ⭐**
