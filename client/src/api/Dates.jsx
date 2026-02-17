import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Dates() {
  const navigate = useNavigate();
  const { id, date } = useParams(); // date from params
  const today = new Date();

  // ✅ format local date (NO toISOString)
  const formatDateForURL = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // next 5 days
  const next5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  // ✅ selected date from params OR today
  const [selectedDate, setSelectedDate] = useState(() => {
    if (date) return new Date(date);
    return today;
  });

  const handleClick = (d) => {
    setSelectedDate(d);
    const formattedDate = formatDateForURL(d);
    navigate(`/${id}/cinemas/${formattedDate}`, { replace: true });
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {next5Days.map((d, index) => {
        const isSelected =
          formatDateForURL(d) === formatDateForURL(selectedDate);

        return (
          <div
            key={index}
            onClick={() => handleClick(d)}
            style={{
              width: "60px",
              padding: "10px",
              textAlign: "center",
              borderRadius: "8px",
              cursor: "pointer",
              background: isSelected ? "#4f46e5" : "#f2f2f2",
              color: isSelected ? "white" : "black"
            }}
          >
            <div style={{ fontSize: "14px" }}>
              {d.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              {d.getDate()}
            </div>
            <div style={{ fontSize: "12px" }}>
              {d.toLocaleDateString("en-US", { month: "short" })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
