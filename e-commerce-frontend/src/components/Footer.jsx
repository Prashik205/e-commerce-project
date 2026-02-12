import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[var(--color-primary)] text-white pt-16 pb-8 font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-heading text-white mb-6">
                            <ShoppingBag className="text-[var(--color-accent)]" />
                            <span>E-Shop</span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                            Your premium destination for quality products. We believe in style, substance, and sustainability.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-black transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-lg mb-6">Get to Know Us</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            {['About Us', 'Careers', 'Press Releases', 'E-Shop Science'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="hover:underline transition-all">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-lg mb-6">Connect with Us</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="hover:underline cursor-pointer">Facebook</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="hover:underline cursor-pointer">Twitter</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="hover:underline cursor-pointer">Instagram</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-heading font-semibold text-lg mb-6">Let Us Help You</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            {['Your Account', 'Your Orders', 'Shipping Rates & Policies', 'Returns & Replacements', 'Help'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="hover:underline transition-all">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Notice</Link>
                        <Link to="#" className="hover:text-white transition-colors">Conditions of Use</Link>
                        <Link to="#" className="hover:text-white transition-colors">Interest-Based Ads</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
