import React, { useState, useRef, useEffect } from 'react';
import { BedDouble, CarTaxiFront, MapPinned, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const navItems = [
        { icon: <BedDouble className="w-5 h-5" />, label: 'Stays', to: '/stays' },
        { icon: <CarTaxiFront className="w-5 h-5" />, label: 'Taxi', to: '/taxi' },
        { icon: <MapPinned className="w-5 h-5" />, label: 'Tour Guides', to: '/guides' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        logout();
    };

    return (
        <nav className="fixed w-full top-0 left-0 z-50 bg-white shadow-md">
            <div className="relative flex items-center justify-end md:justify-between h-20 px-4 md:px-8">
                {/* Left - Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                navigate(item.to);
                                window.scrollTo(0, 0);
                            }}
                            className="flex items-center gap-2 text-gray-700 hover:text-green-500 transition"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>


                {/* Right - Profile & Mobile Toggle */}
                <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                    {user ? (
                        <>
                            {/* Avatar */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="focus:outline-none"
                            >
                                <img
                                    src={
                                        user?.profilePic ||
                                        'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                                    }
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-100 py-2 flex flex-col z-50 animate-slide-down">
                                    <div className="px-4 py-2 text-gray-800 font-medium truncate">
                                        {user?.email}
                                    </div>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 transition"
                                        onClick={() => {
                                            navigate('/user');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <User className="w-5 h-5 text-green-500" /> Profile
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden md:block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
                    </button>
                </div>
            </div>

            {/* ✅ Mobile Menu - Clean & Modern */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-md transition-all duration-300 ease-in-out animate-slide-down">
                    <div className="flex flex-col py-3 space-y-1">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    navigate(item.to);
                                    setIsMobileMenuOpen(false);
                                    window.scrollTo(0, 0);
                                }}
                                className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition rounded-lg mx-3"
                            >
                                <span className="text-green-500">{item.icon}</span>
                                <span className="text-base font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {user && (
                        <>
                            <div className="border-t border-gray-100 my-2" />
                            <div className="px-5 py-2">
                                <p className="text-sm text-gray-600 truncate mb-2">{user?.email}</p>

                                <button
                                    className="flex items-center gap-3 w-full text-left px-3 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition"
                                    onClick={() => {
                                        navigate('/user-profile');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <User className="w-5 h-5 text-green-500" />
                                    <span>Profile</span>
                                </button>

                                <button
                                    className="flex items-center gap-3 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-red-600 transition"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
