import express from "express";
import { getAllProducts,getFeaturedProducts,createProduct,deleteProduct,getRecommendedProducts,getProductCategory,toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, productRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/",productRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductCategory);
router.get("/recommendation",getRecommendedProducts);
router.post("/",productRoute,adminRoute,createProduct);
router.patch("/:id",productRoute,adminRoute,toggleFeaturedProduct);
router.delete("/:id",productRoute,adminRoute,deleteProduct);

export default router;