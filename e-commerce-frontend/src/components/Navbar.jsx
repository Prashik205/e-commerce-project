import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogOut, User, ShoppingCart, Package, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();
    const cartItemsCount = getTotalItems();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Check if user is admin
    const isAdmin = user && user.roles?.some(role =>
        role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
    );

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/' }, // Assuming same as home for now or separate
    ];

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--color-primary)] text-white shadow-md"
        >
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold font-heading flex items-center gap-2 group navbar-brand">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <ShoppingBag className="text-[var(--color-accent)]" />
                    </motion.div>
                    <span className="group-hover:text-[var(--color-accent)] transition-colors">E-Shop</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Main Links */}
                    <div className="flex items-center gap-6 text-gray-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative hover:text-white transition-colors font-medium text-sm leading-none group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-600"></div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 text-[var(--color-accent)] hover:text-yellow-300 transition-colors font-medium text-sm"
                                        title="Admin Dashboard"
                                    >
                                        <Shield size={18} />
                                        <span>Admin</span>
                                    </Link>
                                )}

                                <Link
                                    to="/orders"
                                    className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
                                    title="My Orders"
                                >
                                    <Package size={20} />
                                </Link>

                                <Link
                                    to="/cart"
                                    className="relative flex items-center text-gray-200 hover:text-white transition-colors"
                                    title="Shopping Cart"
                                >
                                    <ShoppingCart size={24} />
                                    {cartItemsCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                                        >
                                            {cartItemsCount}
                                        </motion.span>
                                    )}
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 text-sm font-bold text-white">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                                        </div>
                                    </button>

                                    {/* Dropdown for user menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                        <div className="p-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 rounded-b-md"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-200 hover:text-white font-medium transition-colors text-sm">Login</Link>
                                <Link to="/register" className="px-4 py-1.5 rounded-md bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-medium transition-all shadow-sm text-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--color-primary)] border-t border-gray-700 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block text-gray-200 hover:text-white font-medium text-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-700 my-4"></div>
                            {user ? (
                                <>
                                    <div className="flex items-center justify-between text-gray-200">
                                        <span>Cart ({cartItemsCount})</span>
                                        <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                                            <ShoppingCart size={20} />
                                        </Link>
                                    </div>
                                    <Link to="/orders" className="block text-gray-200 hover:text-white" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                                    {isAdmin && <Link to="/admin" className="block text-[var(--color-accent)]" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>}
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        className="flex items-center gap-2 text-red-400 w-full"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link to="/login" className="block text-center py-2 border border-gray-600 rounded-lg text-white" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="block text-center py-2 bg-[var(--color-accent)] rounded-lg text-black font-bold shadow-md" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
