import express from "express";
import { getCoupon,validateCoupon } from "../controllers/coupon.controller.js";
import { productRoute } from "../middleware/auth.middleware.js";


const router=express.Router();

router.get("/",productRoute,getCoupon);
router.post("/validate",productRoute,validateCoupon);

export default router;