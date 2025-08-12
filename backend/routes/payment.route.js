import express from "express";
import { productRoute } from "../middleware/auth.middleware.js";
import { createCheckoutSession,checkoutSuccess } from "../controllers/payment.controller.js";


const router=express.Router();



router.post("/create-checkout-session",productRoute,createCheckoutSession);
router.post("/checkout-success",productRoute,checkoutSuccess);


export default router;