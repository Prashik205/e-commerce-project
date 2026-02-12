import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ArrowRight, Download, ChevronRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eaeded] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#eaeded] flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-12 border border-gray-200 rounded-lg shadow-sm max-w-lg w-full">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h2>
                    <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md shadow-md transition-colors">
                        <Home size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <div className="bg-[#eaeded] min-h-screen pb-12">
            {/* Header / Success Banner */}
            <div className="bg-white border-b border-gray-200 py-6 mb-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={36} className="text-green-600" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Order successfully placed!</h1>
                            <p className="text-gray-600">
                                Thanks for shopping with us. We'll send a confirmation email shortly.
                            </p>
                        </div>
                        <div className="md:ml-auto flex items-center gap-4">
                            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                                <Download size={16} /> Invoice
                            </button>
                            <Link to="/orders" className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md text-sm shadow-sm transition-colors">
                                Your Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-900">Order Summary</h3>
                                <span className="text-sm font-medium text-gray-600">Order # {order.id}</span>
                            </div>
                            <div className="p-6 space-y-4">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex gap-4 py-2 border-b border-gray-50 last:border-0">
                                        <div className="w-16 h-16 flex-shrink-0 border border-gray-100 rounded-sm">
                                            <img
                                                src={item.product?.imageUrl || 'https://placehold.co/80x80?text=No+Image'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-medium text-blue-700 hover:text-orange-700 line-clamp-1">{item.product?.name}</h4>
                                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-gray-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Items (total):</span>
                                        <span>${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping & handling:</span>
                                        <span className="text-green-700">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-red-700 pt-2 border-t border-gray-100">
                                        <span>Order Total:</span>
                                        <span>${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What's Next Card */}
                        <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">What's next?</h3>
                            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
                                <Truck className="text-blue-600 mt-1" size={24} />
                                <div>
                                    <p className="font-bold text-blue-900 text-sm">Estimated delivery date:</p>
                                    <p className="text-lg font-bold text-blue-700">{estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-xs text-blue-600 mt-1">We'll send you an update as soon as your items are shipped.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping To Card */}
                        <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Shipping to:</h3>
                            <div className="text-sm text-gray-800 space-y-1">
                                <p className="font-bold">{order.shippingFullName}</p>
                                <p>{order.shippingAddressLine1}</p>
                                {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                                <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                                <p>{order.shippingCountry}</p>
                                <div className="pt-2 text-gray-600 text-[11px] uppercase tracking-wider font-bold">Contact:</div>
                                <p className="text-gray-700">{order.shippingPhone}</p>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Payment Method:</h3>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 border border-gray-100 rounded-sm">
                                    <ShoppingBag size={20} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                    </p>
                                    <p className="text-xs text-green-700 font-bold">Unpaid</p>
                                </div>
                            </div>
                        </div>

                        {/* Continue Shopping Button */}
                        <Link
                            to="/shop"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md shadow-md transition-all group"
                        >
                            Continue Shopping
                            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
