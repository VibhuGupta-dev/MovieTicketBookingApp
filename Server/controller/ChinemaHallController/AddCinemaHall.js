import Cinema from "../../models/CinemaHallSchema.js";

function generateRowLabels(count) {
  const labels = [];

  for (let i = 0; i < count; i++) {
    let label = "";
    let n = i;

    while (n >= 0) {
      label = String.fromCharCode((n % 26) + 65) + label;
      n = Math.floor(n / 26) - 1;
    }

    labels.push(label);
  }
  return labels;
}

export async function addChinemaHall(req, res) {
  try {
    const { cinemaHallName, description, locationLink, address, logo, row, seatsPerRow } = req.body;

    if (!cinemaHallName || !description || !locationLink || !address || !logo || !row || !seatsPerRow) {
      return res.status(400).json({ message: "all fields not filled" });
    }

    const rows = Number(row);
    if(rows > 50) {
        return res.status(400).json({messaage : "more than 50 rows are not allowed"})
    }
    const seatsPerRowNum = Number(seatsPerRow);

    const rowLabels = generateRowLabels(rows);

    let seats = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 1; j <= seatsPerRowNum; j++) {
        seats.push({
          seatno: rowLabels[i] + j,
          isBooked: false
        });
      }
    }

    const cinemaHall = await Cinema.create({
      userId: req.userId,
      row: rows,
      seatsPerRow: seatsPerRowNum,
      seats,
      cinemaHallName,
      description,
      locationLink,
      address,
      logo
    });

    return res.status(201).json({ message: "cinema hall created", cinemaHall });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error in add cinema hall" });
  }
}
