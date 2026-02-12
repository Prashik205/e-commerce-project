import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, Truck, MapPin, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { cart, getTotalPrice, clearCart, getTotalItems } = useCart();
    const cartItems = cart?.items || [];
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        addressLine1: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const orderData = {
            items: cartItems.map(item => ({
                product: { id: item.id },
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: getTotalPrice(),
            shippingAddress,
            paymentMethod
        };

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // In a real app: await api.post('/orders', orderData);

            // Mock success
            const mockOrderId = "ORD-" + Math.floor(Math.random() * 100000);
            clearCart();
            toast.success("Order placed successfully!");
            navigate(`/order-confirmation/${mockOrderId}`);
        } catch (error) {
            console.error("Order failed", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-12">
            {/* Minimal Header */}
            <div className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f2f2f2] py-4">
                <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Checkout <span className="text-gray-500 font-normal text-lg">({getTotalItems()} items)</span></h1>
                    <Lock size={20} className="text-gray-500" />
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl mt-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Form Area */}
                    <div className="flex-1">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">

                            {/* 1. Shipping Address */}
                            <div className="flex gap-4">
                                <span className="font-bold text-gray-900 w-6">1</span>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-[#c45500] mb-3">Shipping Address</h2>
                                    <div className="space-y-3 max-w-lg">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={shippingAddress.fullName}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-400 rounded-[3px] py-1 px-2 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Address Line 1</label>
                                            <input
                                                type="text"
                                                name="addressLine1"
                                                value={shippingAddress.addressLine1}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-400 rounded-[3px] py-1 px-2 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
                                                required
                                                placeholder="Street address, P.O. box, company name, c/o"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={shippingAddress.city}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-400 rounded-[3px] py-1 px-2 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">State / Province</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={shippingAddress.state}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-400 rounded-[3px] py-1 px-2 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Zip Code</label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={shippingAddress.zipCode}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-400 rounded-[3px] py-1 px-2 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                                                <select
                                                    name="country"
                                                    value={shippingAddress.country}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-400 rounded-[3px] py-1 px-2 focus:ring-[#e77600] focus:border-[#e77600] shadow-sm text-sm bg-gray-50"
                                                >
                                                    <option>USA</option>
                                                    <option>Canada</option>
                                                    <option>UK</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-200 w-full my-6"></div>
                                </div>
                            </div>

                            {/* 2. Payment Method */}
                            <div className="flex gap-4">
                                <span className="font-bold text-gray-900 w-6">2</span>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-[#c45500] mb-3">Payment Method</h2>
                                    <div className="space-y-3 bg-white border border-gray-300 rounded p-4 max-w-lg">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="payment"
                                                value="COD"
                                                checked={paymentMethod === 'COD'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="text-[#e77600] focus:ring-[#e77600]"
                                            />
                                            <label htmlFor="cod" className="font-medium text-gray-900 flex items-center gap-2">
                                                <Truck size={18} className="text-gray-600" /> Cash on Delivery / Pay on Arrival
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3 opacity-60">
                                            <input
                                                type="radio"
                                                id="card"
                                                name="payment"
                                                value="CARD"
                                                disabled
                                                className="text-[#e77600]"
                                            />
                                            <label htmlFor="card" className="font-medium text-gray-900 flex items-center gap-2">
                                                <CreditCard size={18} className="text-gray-600" /> Credit/Debit Card (Coming Soon)
                                            </label>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-200 w-full my-6"></div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white p-5 border border-gray-300 rounded-lg sticky top-6">
                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-[3px] text-black text-sm font-normal shadow-sm transition-colors mb-4 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? 'Placing Order...' : 'Place your order'}
                            </button>

                            <p className="text-xs text-center text-gray-600 mb-4 px-2">
                                By placing your order, you agree to E-Shop's <Link to="#" className="text-blue-600">privacy notice</Link> and <Link to="#" className="text-blue-600">conditions of use</Link>.
                            </p>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Order Summary</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Items:</span>
                                    <span className="text-gray-900 font-medium">${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping & handling:</span>
                                    <span className="text-gray-900 font-medium">$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total before tax:</span>
                                    <span className="text-gray-900 font-medium">${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Estimated tax to be collected:</span>
                                    <span className="text-gray-900 font-medium">$0.00</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between text-lg font-bold text-[#b12704]">
                                    <span>Order Total:</span>
                                    <span>${getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
