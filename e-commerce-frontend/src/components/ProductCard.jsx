import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [imgError, setImgError] = useState(false);

    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        try {
            await addToCart(product.id, 1);
        } finally {
            setIsAdding(false);
        }
    };

    const fallbackImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative product-card flex flex-col h-full bg-white transition-all duration-300 border border-transparent hover:border-gray-200 rounded-sm hover:shadow-lg"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm mb-3 p-4 flex items-center justify-center">
                <img
                    src={imgError || !product.imageUrl ? fallbackImage : product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
                    <Link
                        to={`/products/${product.id}`}
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-[var(--color-accent)] hover:text-black shadow-md transition-colors transform translate-y-2 group-hover:translate-y-0 duration-200 pointer-events-auto"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </Link>
                </div>

                {/* Badges */}
                {product.isNew && (
                    <span className="absolute top-2 left-2 bg-[var(--color-accent)] text-black text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">NEW</span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow px-2 pb-2">
                <Link to={`/products/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1 h-10" title={product.name}>
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "text-yellow-500" : "text-gray-300"} />
                        ))}
                    </div>
                    <span className="text-gray-500 ml-1">1,234</span>
                </div>

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">
                            ${product.price?.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-xs text-gray-500 line-through">
                                ${product.oldPrice?.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`px-3 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black text-xs font-medium rounded-full transition-colors shadow-sm ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isAdding ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
