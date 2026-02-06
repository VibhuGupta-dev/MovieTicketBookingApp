import Cinema from "../../models/CinemaHallSchema.js";

export async function updateStore(req, res) {
  try {
    const {
      cinemaHallName,
      description,
      locationLink,
      address,
      logo
    } = req.body;

    const userID = req.userId;
    if (!userID) {
      return res.status(400).json({ message: "userID not found" });
    }

    const cinemaHallID = req.params.chinemahallID; // make sure route param name same ho
    if (!cinemaHallID) {
      return res.status(400).json({ message: "cinemaHallID not found" });
    }

    const updatedCinema = await Cinema.findByIdAndUpdate(
      cinemaHallID,
      {
        cinemaHallName,
        description,
        locationLink,
        address,
        logo
      },
      { new: true } // updated data return karega
    );

    if (!updatedCinema) {
      return res.status(404).json({ message: "Cinema hall not found" });
    }

    return res.status(200).json(updatedCinema);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error in update function" });
  }
}
