import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (product) {
            await addToCart(product.id, 1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Breadcrumb / Back Navigation */}
            <div className="bg-[#eaeded] py-2 px-4 shadow-inner">
                <div className="container mx-auto max-w-[1500px]">
                    <Link to="/shop" className="text-xs text-gray-600 hover:underline flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to results
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-[1500px] mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Image Gallery (Left, 40-50%) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className="flex gap-4">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-3">
                                    {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-12 h-12 border rounded hover:border-[#e77600] cursor-pointer overflow-hidden ${selectedImage === idx ? 'border-[#e77600] shadow-sm' : 'border-gray-300'}`}
                                            onMouseEnter={() => setSelectedImage(idx)}
                                        >
                                            <img src={img || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                {/* Main Image */}
                                <div className="flex-1">
                                    <div className="aspect-[4/5] md:aspect-square bg-gray-50 flex items-center justify-center rounded-sm overflow-hidden border border-gray-100">
                                        <img
                                            src={product.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain" // Contain to avoid cropping critical details
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details (Middle, 30-40%) */}
                    <div className="lg:col-span-4">
                        <h1 className="text-2xl lg:text-3xl font-medium text-gray-900 mb-2 leading-tight">
                            {product.name}
                        </h1>
                        <Link to="#" className="text-sm text-blue-700 hover:underline hover:text-orange-700 mb-2 block">
                            Visit the E-Shop Store
                        </Link>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-[#fea502]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-sm text-blue-700 hover:underline cursor-pointer">1,234 ratings</span>
                        </div>

                        <div className="h-px bg-gray-200 my-4"></div>

                        <div className="mb-4">
                            <span className="text-sm text-gray-600">Price:</span>
                            <span className="text-2xl text-[#b12704] font-medium ml-2">${product.price?.toFixed(2)}</span>
                        </div>

                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-900 mb-6">
                            <li>High quality material ensuring durability</li>
                            <li>Modern design suitable for all environments</li>
                            <li>1 Year Manufacturer Warranty included</li>
                            <li>Fast delivery via E-Shop Prime</li>
                        </ul>
                    </div>

                    {/* Buy Box (Right, 20-30%) */}
                    <div className="lg:col-span-3">
                        <div className="border border-gray-300 rounded-lg p-5 shadow-sm bg-white">
                            <div className="mb-4">
                                <span className="text-2xl text-[#b12704] font-medium block">${product.price?.toFixed(2)}</span>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span className="text-blue-700">FREE Returns</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span className="text-blue-700">FREE delivery</span> <span className="font-bold text-gray-900">Saturday, Dec 35</span>
                                </div>
                                <div className="text-lg text-[#007600] font-medium mt-2">In Stock</div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full text-black text-sm font-normal shadow-sm transition-colors"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="w-full py-2 bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ff8f00] rounded-full text-black text-sm font-normal shadow-sm transition-colors"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <div className="mt-4 text-xs text-gray-600 space-y-2">
                                <div className="grid grid-cols-2 gap-x-2">
                                    <span className="text-gray-500">Ships from</span> <span>E-Shop</span>
                                    <span className="text-gray-500">Sold by</span> <span>E-Shop</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button className="w-full py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 hover:bg-gray-50 mb-2">
                                    Add to List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info / Tabs */}
                <div className="mt-12 border-t border-gray-300 pt-8">
                    <h2 className="text-xl font-bold text-[#c45500] mb-4">Product Description</h2>
                    <p className="text-gray-800 leading-relaxed max-w-4xl">
                        {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
