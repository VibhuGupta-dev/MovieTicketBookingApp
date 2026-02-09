import Show from "../../models/ShowSchema.js";

export async function getShow(req, res) {
  try {
    const showId = req.params.showId;

    if (!showId) {
      return res.status(400).json({ message: "show id not found" });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: "show not found" });
    }

    return res.status(200).send(show);

  } catch (err) {
    return res.status(500).json({ message: "error in get show" });
  }
}
