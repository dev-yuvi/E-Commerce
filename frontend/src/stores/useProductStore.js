import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";


export const useProductStore = create((set)=>({
    products:[],
    loading:false,
    setProducts:(products)=>set({products}),
    

    createProduct:async(productData)=>{
        set({loading:true});
        try {
            const res=await axios.post("/products",productData);
            set((prevState)=>({
                products:[...prevState.products,res.data.product],
                loading:false,
            }))
        } catch (error) {
            toast.error(error.response.data.message || "An Error occured");
            set({loading:false});
        }

    },

    fetchAllProducts:async()=>{
        set({loading:true});
        try {
            const res=await axios.get("/products");
            set({products:res.data.products,loading:false});
        } catch (error) {
            set({error:"failed to fetch products",loading:false});
            toast.error(error.response.data.message || "An Error occured");
        }
    },

    fetchProductsByCategory:async(category)=>{
        set({loading:true});
        try {
            const res=await axios.get(`/products/category/${category}`);
            set({products:res.data.products,loading:false});

        } catch (error) {
            set({error:"failed to fetch products",loading:false});
            toast.error(error.response.data.message || "An Error occured");
        }
    },    

    deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevState) => ({
             products: prevState.products.filter((product) => product._id !== productId),
             loading: false,
            }));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},

    toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
        const response = await axios.patch(`/products/${productId}`);
        const updatedProduct = response.data.product; // backend should return updated product
        set((prevState) => ({
            products: prevState.products.map((product) =>
                product._id === productId ? updatedProduct : product
            ),
            loading: false,
        }));
    } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.message || "Failed to update product");
    }
},

fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
    

}))