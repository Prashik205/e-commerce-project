import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, ShoppingBag, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelled, setShowCancelled] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#eaeded] py-12 px-4">
                <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-600 mb-6">
                        You need to be logged in to view your orders.
                    </p>
                    <Link to="/login" className="block w-full py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md shadow-sm transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eaeded] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#eaeded] py-12 px-4">
                <div className="max-w-2xl mx-auto bg-white p-12 border border-gray-200 rounded-lg shadow-sm text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        You haven't placed any orders yet. Check out our latest deals!
                    </p>
                    <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-gray-900 font-bold rounded-md shadow-md transition-colors">
                        <ShoppingBag size={20} />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusStyles = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' };
            case 'PROCESSING':
                return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
            case 'SHIPPED':
                return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' };
            case 'DELIVERED':
                return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
            case 'CANCELLED':
                return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
        }
    };

    const cancelledCount = orders.filter(order => order.status === 'CANCELLED').length;
    const filteredOrders = showCancelled ? orders : orders.filter(order => order.status !== 'CANCELLED');

    return (
        <div className="min-h-screen bg-[#eaeded] py-8 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <nav className="flex mb-4 text-sm text-gray-600">
                    <Link to="/" className="hover:text-orange-700">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-900">Your Orders</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>

                    {cancelledCount > 0 && (
                        <button
                            onClick={() => setShowCancelled(!showCancelled)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            {showCancelled ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showCancelled ? 'Hide' : 'Show'} Cancelled Orders ({cancelledCount})
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white p-12 border border-gray-200 rounded-md text-center">
                            <Package size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No active orders</h3>
                            <p className="text-gray-600">All your orders have been cancelled. Check your history to view them.</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => {
                            const styles = getStatusStyles(order.status);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={order.id}
                                    className={`bg-white border rounded-md overflow-hidden shadow-sm transition-all hover:shadow-md ${order.status === 'CANCELLED' ? 'opacity-75 border-red-100' : 'border-gray-200'}`}
                                >
                                    {/* Order Header Card */}
                                    <div className="bg-[#f0f2f2] border-b border-gray-200 px-4 md:px-6 py-3 flex flex-wrap justify-between items-center gap-y-4">
                                        <div className="flex flex-wrap gap-8">
                                            <div>
                                                <p className="text-[10px] md:text-xs text-gray-600 uppercase font-bold mb-1">Order Placed</p>
                                                <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] md:text-xs text-gray-600 uppercase font-bold mb-1">Total</p>
                                                <p className="text-sm font-bold text-gray-900">${order.totalAmount?.toFixed(2)}</p>
                                            </div>
                                            <div className="hidden md:block">
                                                <p className="text-[10px] md:text-xs text-gray-600 uppercase font-bold mb-1">Ship To</p>
                                                <p className="text-sm text-blue-700 hover:text-orange-700 cursor-pointer underline-offset-2 hover:underline">
                                                    {order.shippingFullName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] md:text-xs text-gray-600 uppercase font-bold mb-1">Order # {order.id}</p>
                                            <div className="flex items-center gap-3">
                                                <Link to={`/orders/${order.id}`} className="text-sm text-blue-700 hover:text-orange-700 hover:underline">View order details</Link>
                                                <span className="text-gray-300 h-4 w-[1px] bg-gray-300"></span>
                                                <Link to={`/orders/${order.id}`} className="text-sm text-blue-700 hover:text-orange-700 hover:underline">Invoice</Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className={`px-2 py-1 rounded-sm border ${styles.bg} ${styles.text} ${styles.border} text-xs font-bold uppercase tracking-wider`}>
                                                        {order.status}
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {order.status === 'DELIVERED' ? 'Arrived at your doorstep' : 'In progress'}
                                                    </p>
                                                </div>

                                                <div className="space-y-4">
                                                    {order.items?.map(item => (
                                                        <div key={item.id} className="flex gap-4">
                                                            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border border-gray-100 rounded-sm">
                                                                <img
                                                                    src={item.product?.imageUrl || 'https://placehold.co/100x100?text=No+Image'}
                                                                    alt={item.product?.name}
                                                                    className="w-full h-full object-contain p-1"
                                                                />
                                                            </div>
                                                            <div className="flex-grow min-w-0">
                                                                <Link to={`/products/${item.product?.id}`} className="text-sm md:text-base font-medium text-blue-700 hover:text-orange-700 line-clamp-2 leading-tight mb-1">
                                                                    {item.product?.name}
                                                                </Link>
                                                                <p className="text-xs text-gray-600 mb-2">Quantity: {item.quantity}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <button className="px-3 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-xs font-medium rounded-full shadow-sm">
                                                                        Buy it again
                                                                    </button>
                                                                    <Link to={`/products/${item.product?.id}`} className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-xs font-medium rounded-full shadow-sm">
                                                                        View your item
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[180px]">
                                                <button className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-sm rounded-md shadow-sm transition-colors text-center">
                                                    Track package
                                                </button>
                                                <button className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-sm rounded-md shadow-sm transition-colors text-center">
                                                    Return or replace items
                                                </button>
                                                <button className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-sm rounded-md shadow-sm transition-colors text-center">
                                                    Share gift receipt
                                                </button>
                                                <button className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-sm rounded-md shadow-sm transition-colors text-center">
                                                    Leave seller feedback
                                                </button>
                                                <button className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-sm rounded-md shadow-sm transition-colors text-center">
                                                    Write a product review
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
                                        <Link to={`/orders/${order.id}`} className="flex items-center gap-1 text-sm text-blue-700 hover:text-orange-700 hover:underline font-medium">
                                            Archive order <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
