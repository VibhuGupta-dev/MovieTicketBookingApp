import Show from "../../models/ShowSchema.js";

export async function deleteShow(req, res) {
  try {
    const showId = req.params.showId;

    if (!showId) {
      return res.status(400).json({ message: "show id not found" });
    }

    const deletedShow = await Show.findByIdAndDelete(showId);

    if (!deletedShow) {
      return res.status(404).json({ message: "show not found" });
    }

    return res.status(200).json({ message: "show deleted" });

  } catch (err) {
    return res.status(500).json({ message: "error in delete show" });
  }
}
