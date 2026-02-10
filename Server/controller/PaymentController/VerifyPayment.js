
import crypto from "crypto";

export async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", String(process.env.RAZORPAY_KEY_SECRET))
            .update(body.toString())
            .digest("hex");
        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({ success: true });
        }
        else {
            return res.status(400).json({ success: false });
        }
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
}

