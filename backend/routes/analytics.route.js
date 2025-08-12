import express from "express";
import { adminRoute,productRoute } from "../middleware/auth.middleware.js";
import { getAnalytics} from "../controllers/analytics.controller.js";


const router=express.Router();


router.get("/",productRoute,adminRoute,getAnalytics)


export default router;