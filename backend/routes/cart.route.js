import express from "express";
import { productRoute } from "../middleware/auth.middleware.js";
import { addToCart, updateQuantity, getCartProducts, removeAllFromCart } from "../controllers/cart.controller.js";


const router=express.Router();

router.get("/",productRoute,getCartProducts);
router.post("/",productRoute,addToCart);
router.delete("/",productRoute,removeAllFromCart);
router.put("/:id",productRoute,updateQuantity);


export default router;