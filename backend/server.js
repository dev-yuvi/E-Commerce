import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { ConnectDB } from "./lib/db.js";
import path from "path";

dotenv.config();
const app=express();


const __dirname=path.resolve();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(cookieParser());


app.use(express.json({limit:"10mb"}));

app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/build");
    app.use(express.static(frontendPath));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}


const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`The Server Running on The port http://localhost:${PORT}`);
    ConnectDB();
})


// o1u1CzQ7gZayoNf6