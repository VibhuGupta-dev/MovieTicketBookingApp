export async function LogoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully" });

  } catch (err) {
    return res.status(500).json({ 
      message: "Error in logout", 
      error: err.message 
    });
  }
}
