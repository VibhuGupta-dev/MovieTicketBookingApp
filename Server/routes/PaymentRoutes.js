import express from "express";
import { isuserloggedin } from "../middleware/isUserLoggedIn.js";
import { verifyPayment  } from "../controller/PaymentController/VerifyPayment.js";
import { createOrder } from "../controller/PaymentController/PaymentGateway.js";
const router = express.Router();
router.post("/paymentorder/:orderId", isuserloggedin, createOrder);
router.post("/verify-payment/:orderId", isuserloggedin , verifyPayment);
export default router;
