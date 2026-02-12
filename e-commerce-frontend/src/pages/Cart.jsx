import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
    const cartItems = cart?.items || [];

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your E-Shop Cart is empty.</h2>
                        <p className="text-gray-600 mb-8">
                            Your Shopping Cart lives to serve. Give it purpose — fill it with electronics, computers, and more.
                        </p>
                        <Link
                            to="/"
                            className="inline-block px-8 py-2 bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] text-black rounded-md font-medium shadow-sm transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eaeded] py-8">
            <div className="container mx-auto px-4 max-w-[1500px]">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items List - Left */}
                    <div className="flex-1 bg-white p-6 shadow-sm border border-gray-200">
                        <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-end">
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            <span className="text-sm text-gray-500">Price</span>
                        </div>

                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 py-6 last:border-0"
                                >
                                    <div className="w-full sm:w-48 h-48 bg-gray-50 flex items-center justify-center rounded-sm overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/150'}
                                            alt={item.name}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 leading-tight mb-1">
                                                    <Link to={`/products/${item.id}`} className="hover:text-[#c45500] hover:underline">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <div className="text-xs text-[#007600] mb-2">In Stock</div>
                                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                                    <CheckCircle size={14} className="text-[#e77600] mr-1" />
                                                    <span>Eligible for FREE Shipping</span>
                                                </div>
                                            </div>
                                            <div className="text-right sm:hidden">
                                                <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex items-center border border-gray-300 rounded-md bg-[#f0f2f2] shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-200 transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-medium text-gray-900 bg-white border-x border-gray-300 py-1">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-200 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="h-4 w-px bg-gray-300"></div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-sm text-blue-700 hover:text-[#c45500] hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block text-right w-32">
                                        <span className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="flex justify-end pt-4">
                            <span className="text-xl">Subtotal ({getTotalItems()} items): <span className="font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span></span>
                        </div>
                    </div>

                    {/* Order Summary - Right */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white p-5 shadow-sm border border-gray-200 sticky top-24">
                            <div className="text-lg mb-4">
                                Subtotal ({getTotalItems()} items): <span className="font-bold text-[#b12704]">${getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex items-start gap-2 mb-4">
                                <input type="checkbox" id="gift" className="mt-1" />
                                <label htmlFor="gift" className="text-sm text-gray-900">This order contains a gift</label>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg text-black text-center text-sm font-normal shadow-sm transition-colors mb-4"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* Mock Payment Options */}
                            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-xs text-gray-600">
                                <p className="font-bold mb-1">Buy now, pay later</p>
                                <p>Available on eligible orders.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
