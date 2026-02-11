import express from "express";
import { isuserloggedin } from "../middleware/isUserLoggedIn.js";
import { verifyPayment  } from "../controller/PaymentController/VerifyPayment.js";
import { createOrder } from "../controller/PaymentController/PaymentGateway.js";
const router = express.Router();
router.post("/paymentorder/:showId", isuserloggedin, createOrder);
router.post("/verify-payment/:showId", isuserloggedin , verifyPayment);
export default router;
