import Coupon from "../model/coupon.model.js"

export const getCoupon = async (req,res) => {
    try {
        const coupon=await Coupon.findOne({userId:req.user._id,isAcive:true});
        res.json(coupon || null);
    } catch (error) {
        console.log("Error getting coupon",error);
        res.status(500).json({message:"Something went wrong"});
    
    }
}

export const validateCoupon = async (req,res) => {
    try {
        const{code}=req.body;
        const coupon=await Coupon.findOne({code:code,isAcive:true});
        if(!coupon){
            return res.status(400).json({message:"coupon not found"});
        }
        if(coupon.expirationDate < new Date()){
            coupon.isAcive=false;
            await coupon.save();
            return res.status(400).json({message:"Coupon has expired"});
        }
        res.json({
            message:"Coupon is valid",
            code:coupon.code,
            discountPercentage:coupon.discountPercentage,
        })
    } catch (error) {
        console.log("Error validating coupon",error);
         res.status(500).json({message:"Something went wrong"});
    }
}