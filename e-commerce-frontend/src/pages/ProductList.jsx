import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronDown } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(1000);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getAllProducts();
                const content = data.content || data;
                setProducts(content);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    // Filtering logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
        const matchesPrice = product.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const categories = ['All', ...new Set(products.map(p => p.category?.name).filter(Boolean))];

    return (
        <div className="min-h-screen bg-white pb-10">
            {/* Header / Sub-nav */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[60px] z-30">
                <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        {filteredProducts.length} results for <span className="font-bold text-[#b12704]">"All Products"</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            className="bg-gray-100 border border-gray-300 text-gray-700 text-xs rounded-md px-2 py-1 hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#e77600]"
                        >
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Avg. Customer Review</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0 space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 pl-10 text-sm focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Category Filter */}
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-bold text-gray-900 mb-2 text-sm">Department</h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <div key={cat} className="flex items-center">
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-sm hover:text-[#c45500] ${selectedCategory === cat ? 'font-bold text-black' : 'text-gray-600'}`}
                                        >
                                            {cat}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-bold text-gray-900 mb-2 text-sm">Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e77600]"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>$0</span>
                                <span>${priceRange}</span>
                            </div>
                        </div>

                        {/* Rating Filter (Mock) */}
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-bold text-gray-900 mb-2 text-sm">Avg. Customer Review</h3>
                            {[4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center gap-1 cursor-pointer hover:opacity-80 mb-1">
                                    <div className="flex text-[#ffa41c]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < star ? "currentColor" : "none"} className={i < star ? "" : "text-[#ffa41c]"} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-blue-700 hover:text-[#c45500]">& Up</span>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setPriceRange(1000); }}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
