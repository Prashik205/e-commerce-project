import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                let content = Array.isArray(data) ? data : (data.content || []);

                // If we have real products, use their IDs for the "Trending" section
                // This ensures "Add to Cart" actually works with the backend
                const trending = [...content];

                // Supplement with mock data if we have fewer than 8 products
                if (trending.length < 8) {
                    const mockDeals = [
                        { id: 9001, name: 'Premium Wireless Headphones', price: 299.99, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', isNew: true },
                        { id: 9002, name: 'Ultra-Wide Gaming Monitor', price: 449.99, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
                        { id: 9003, name: 'Professional DSLR Camera', price: 899.99, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', isNew: true },
                        { id: 9004, name: 'Smart Home Hub', price: 129.99, imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600&q=80' },
                        { id: 9005, name: 'Mechanical Keyboard', price: 89.99, imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80' },
                        { id: 9006, name: 'Ergonomic Office Chair', price: 179.99, imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80', isNew: true },
                        { id: 9007, name: 'Minimalist Wood Desk', price: 249.99, imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80' },
                        { id: 9008, name: 'Bluetooth Speaker', price: 59.99, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80', isNew: true }
                    ];

                    for (const mock of mockDeals) {
                        if (trending.length >= 8) break;
                        if (!trending.find(p => p.id === mock.id)) {
                            trending.push(mock);
                        }
                    }
                }

                setFeaturedProducts(trending.slice(0, 8));
            } catch (err) {
                console.error("Failed to fetch products", err);
                // Fallback to all mocks if API fails
                setFeaturedProducts([
                    { id: 9001, name: 'Wireless Headphones', price: 299.99, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
                    { id: 9002, name: 'Gaming Monitor', price: 449.99, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
                    { id: 9003, name: 'DSLR Camera', price: 899.99, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80' },
                    { id: 9004, name: 'Smart Speaker', price: 129.99, imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600&q=80' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="overflow-hidden bg-[#eaeded] min-h-screen pb-10">
            {/* Hero Section - Amazon Style Carousel Placeholder */}
            <section className="relative bg-white">
                <div className="relative z-10 max-w-[1500px] mx-auto">
                    <div className="relative bg-gray-900 text-white overflow-hidden">
                        <div className="absolute inset-0 opacity-40">
                            <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80" alt="Background" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 flex flex-col items-start max-w-6xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-bold mb-4 leading-tight shadow-md"
                            >
                                Great Deals on <br /> <span className="text-[var(--color-accent)]">Latest Tech</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl mb-8 max-w-xl text-gray-200"
                            >
                                Upgrade your home office with our premium selection of electronics.
                            </motion.p>
                            <Link
                                to="/shop"
                                className="px-8 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md shadow-md transition-colors"
                            >
                                Shop Now
                            </Link>
                        </div>
                        {/* Gradient Fade to Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#eaeded] to-transparent"></div>
                    </div>
                </div>
            </section>

            {/* Categories & Features Grid - Amazon Style Cards */}
            <div className="max-w-[1500px] mx-auto px-4 -mt-20 relative z-20 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category Card 1 */}
                    <div className="bg-white p-6 shadow-sm flex flex-col h-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Electronics</h2>
                        <div className="flex-grow mb-4">
                            <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" alt="Electronics" className="w-full h-64 object-cover mb-2" />
                        </div>
                        <Link to="/shop" className="text-sm font-medium text-blue-700 hover:text-orange-700 hover:underline">See more</Link>
                    </div>

                    {/* Category Card 2 */}
                    <div className="bg-white p-6 shadow-sm flex flex-col h-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Computers & Accessories</h2>
                        <div className="flex-grow mb-4">
                            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80" alt="Computers" className="w-full h-64 object-cover mb-2" />
                        </div>
                        <Link to="/shop" className="text-sm font-medium text-blue-700 hover:text-orange-700 hover:underline">See more</Link>
                    </div>

                    {/* Category Card 3 (Grid of 4) */}
                    <div className="bg-white p-6 shadow-sm flex flex-col h-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Refresh your space</h2>
                        <div className="grid grid-cols-2 gap-4 flex-grow mb-4">
                            <div>
                                <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=200&q=80" className="w-full h-28 object-cover mb-1" />
                                <span className="text-xs text-gray-700">Home</span>
                            </div>
                            <div>
                                <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80" className="w-full h-28 object-cover mb-1" />
                                <span className="text-xs text-gray-700">Decor</span>
                            </div>
                            <div>
                                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&q=80" className="w-full h-28 object-cover mb-1" />
                                <span className="text-xs text-gray-700">Furniture</span>
                            </div>
                            <div>
                                <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=200&q=80" className="w-full h-28 object-cover mb-1" />
                                <span className="text-xs text-gray-700">Kitchen</span>
                            </div>
                        </div>
                        <Link to="/shop" className="text-sm font-medium text-blue-700 hover:text-orange-700 hover:underline">See more</Link>
                    </div>

                    {/* Category Card 4 */}
                    <div className="bg-white p-6 shadow-sm flex flex-col h-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">New Arrivals</h2>
                        <div className="flex-grow mb-4">
                            <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=400&q=80" alt="New Arrivals" className="w-full h-64 object-cover mb-2" />
                        </div>
                        <Link to="/shop" className="text-sm font-medium text-blue-700 hover:text-orange-700 hover:underline">See more</Link>
                    </div>
                </div>
            </div>

            {/* Trending Products */}
            <div className="max-w-[1500px] mx-auto px-4 mb-8">
                <div className="bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Deals</h2>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(0, 4).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Best Sellers Section */}
            {!loading && featuredProducts.length > 4 && (
                <div className="max-w-[1500px] mx-auto px-4 mb-8">
                    <div className="bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Sellers in Electronics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(4, 8).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Features Strip */}
            <div className="max-w-[1500px] mx-auto px-4 mb-8">
                <div className="bg-white p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <Truck size={32} className="text-gray-700" />
                        <div>
                            <h3 className="font-bold text-gray-900">Fast, free shipping</h3>
                            <p className="text-sm text-gray-600">On eligible orders over $25</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <ShieldCheck size={32} className="text-gray-700" />
                        <div>
                            <h3 className="font-bold text-gray-900">100% Secure payments</h3>
                            <p className="text-sm text-gray-600">We prioritize your security</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <TrendingUp size={32} className="text-gray-700" />
                        <div>
                            <h3 className="font-bold text-gray-900">Quality Guarantee</h3>
                            <p className="text-sm text-gray-600">30-day returns policy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
