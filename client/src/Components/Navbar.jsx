import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Check if user is logged in
    const isAuthenticated = localStorage.getItem('user');

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="bg-blue-500 text-white shadow-lg">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl text-white">Todo</Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden focus:outline-none"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Navbar Links */}
                <nav
                    className={`absolute md:static top-16 left-0 w-full md:w-auto bg-purple-700 md:bg-transparent md:flex space-x-8 md:space-x-12 transition-all duration-300 ${isOpen ? 'block' : 'hidden'
                        }`}
                >
                    <Link
                        to="/"
                        className="block py-2 px-4 hover:text-gray-300 text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        All Todos
                    </Link>

                    {/* Conditionally show links based on authentication */}
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="block py-2 px-4 hover:text-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block py-2 px-4 hover:text-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="block py-2 px-4 hover:text-gray-300"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
