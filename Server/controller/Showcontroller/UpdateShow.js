import Show from "../../models/ShowSchema.js";

export async function updateShow(req, res) {
  try {
    const showId = req.params.showId;

    if (!showId) {
      return res.status(400).json({ message: "show id not found" });
    }

    const updatedShow = await Show.findByIdAndUpdate(
      showId,
      req.body,
      { new: true }
    );

    if (!updatedShow) {
      return res.status(404).json({ message: "show not found" });
    }

    return res.status(200).json({
      message: "show updated",
      show: updatedShow
    });

  } catch (err) {
    return res.status(500).json({ message: "error in update show" });
  }
}
