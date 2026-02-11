import QRCode from "qrcode";

export async function generateQR(data) {
  try {
    const qr = await QRCode.toDataURL(JSON.stringify(data));
    return qr; 
  } catch (err) {
    throw new Error("QR generation failed");
  }
}
