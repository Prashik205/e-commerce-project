import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, CheckCircle, Clock, XCircle, Home, Printer, HelpCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            setCancelling(true);
            await api.put(`/orders/${id}/cancel`);
            toast.success('Order cancelled successfully');
            fetchOrder(); // Refresh order data
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eaeded] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#eaeded] py-12 px-4 text-center">
                <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
                    <Link to="/orders" className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md shadow-sm transition-colors">
                        <ArrowLeft size={18} />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt);
    const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = statusSteps.indexOf(order.status);

    const getStatusIcon = (status, isActive) => {
        const size = 20;
        const color = isActive ? 'text-white' : 'text-gray-400';
        const bg = isActive ? 'bg-blue-600 shadow-blue-500/50' : 'bg-gray-100';

        switch (status) {
            case 'PENDING': return <Clock size={size} className={color} />;
            case 'PROCESSING': return <Package size={size} className={color} />;
            case 'SHIPPED': return <Truck size={size} className={color} />;
            case 'DELIVERED': return <CheckCircle size={size} className={color} />;
            default: return <Package size={size} className={color} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#eaeded] py-8 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-sm">
                    <Link to="/orders" className="text-gray-600 hover:text-orange-700 hover:underline">Your Account</Link>
                    <span className="text-gray-400">›</span>
                    <Link to="/orders" className="text-gray-600 hover:text-orange-700 hover:underline">Your Orders</Link>
                    <span className="text-gray-400">›</span>
                    <span className="text-orange-700 font-medium">Order Details</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Ordered on {orderDate.toLocaleDateString()}</span>
                        <span className="h-4 w-[1px] bg-gray-300"></span>
                        <span>Order # {order.id}</span>
                    </div>
                </div>

                {/* Main Order Card */}
                <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-6 overflow-hidden">
                    {/* Upper Header Strip */}
                    <div className="bg-[#f0f2f2] px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-200">
                        <div className="flex gap-6 divide-x divide-gray-300">
                            <div>
                                <h3 className="text-xs font-bold text-gray-700 uppercase mb-1 tracking-tight">Shipping Address</h3>
                                <p className="text-sm text-gray-800">{order.shippingFullName}</p>
                            </div>
                            <div className="pl-6">
                                <h3 className="text-xs font-bold text-gray-700 uppercase mb-1 tracking-tight">Payment Method</h3>
                                <p className="text-sm text-gray-800">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 shadow-sm transition-colors">
                                <Printer size={14} /> Print invoice
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Status Timeline */}
                        {order.status !== 'CANCELLED' ? (
                            <div className="mb-10 pt-4 px-4 overflow-x-auto">
                                <div className="relative flex justify-between min-w-[500px]">
                                    {/* Progress Line */}
                                    <div className="absolute top-[20px] left-0 right-0 h-1 bg-gray-100 -z-0">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-700"
                                            style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                                        />
                                    </div>

                                    {statusSteps.map((status, index) => {
                                        const isActive = index <= currentStatusIndex;
                                        const isCompleted = index < currentStatusIndex || order.status === 'DELIVERED';
                                        return (
                                            <div key={status} className="flex flex-col items-center gap-2 relative z-10">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-gray-200'}`}>
                                                    {getStatusIcon(status, isActive)}
                                                </div>
                                                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-700 font-bold' : 'text-gray-400'}`}>
                                                    {status}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-md flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-red-700">Order Cancelled</p>
                                    <p className="text-sm text-red-600">This order was cancelled on {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">Ordered Items</h3>
                                <div className="space-y-6">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 border border-gray-100 rounded-md overflow-hidden p-2">
                                                <img
                                                    src={item.product?.imageUrl || 'https://placehold.co/150x150?text=No+Image'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <Link to={`/products/${item.product?.id}`} className="text-base md:text-lg font-medium text-blue-700 hover:text-orange-700 hover:underline line-clamp-2 leading-tight mb-1">
                                                    {item.product?.name}
                                                </Link>
                                                <p className="text-sm text-gray-600 mb-2">Sold by: Antigravity Store</p>
                                                <div className="text-sm font-bold text-red-700 mb-4">${item.price?.toFixed(2)}</div>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-xs font-medium rounded-full shadow-sm">
                                                        Buy it again
                                                    </button>
                                                    <button className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium rounded-full shadow-sm">
                                                        Track item
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Details Sidebar */}
                            <div className="space-y-6">
                                {/* Totals */}
                                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal:</span>
                                            <span>${order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping:</span>
                                            <span className="text-green-700">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax:</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-red-700 pt-3 border-t border-gray-200 text-base">
                                            <span>Grand Total:</span>
                                            <span>${order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Card */}
                                <div className="border border-gray-200 rounded-md p-5 text-sm">
                                    <h3 className="font-bold text-gray-900 mb-2">Shipping Details</h3>
                                    <p className="font-medium">{order.shippingFullName}</p>
                                    <p className="text-gray-600">{order.shippingAddressLine1}</p>
                                    {order.shippingAddressLine2 && <p className="text-gray-600">{order.shippingAddressLine2}</p>}
                                    <p className="text-gray-600">{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                                    <p className="text-gray-600">{order.shippingCountry}</p>
                                    <p className="text-gray-500 mt-2">Phone: {order.shippingPhone}</p>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    {order.status === 'PENDING' && (
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={cancelling}
                                            className={`w-full py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md shadow-sm transition-colors ${cancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {cancelling ? 'Cancelling...' : 'Cancel order'}
                                        </button>
                                    )}
                                    <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-md shadow-sm transition-colors">
                                        <HelpCircle size={14} /> Get help with order
                                    </Link>
                                    <Link to="/orders" className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-md shadow-sm transition-colors">
                                        <ArrowLeft size={14} /> Back to history
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
