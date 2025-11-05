import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaQuestionCircle,
  FaBlog,
  FaRegEnvelope,
  FaHome,
  FaShoppingBag,
} from "react-icons/fa";

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#250902] text-white pt-12 pb-6 px-4">
      <div className="container mx-auto">
        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-300">ShopHub</h4>
            <p className="text-gray-400 mb-4">
              Your trusted online marketplace for quality products and exceptional shopping experiences.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-sky-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-pink-500 transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className="flex items-center gap-2 hover:text-amber-300 cursor-pointer transition-colors duration-200 w-full text-left"
                >
                  <FaHome className="text-amber-300" />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/all-listings")}
                  className="flex items-center gap-2 hover:text-amber-300 cursor-pointer transition-colors duration-200 w-full text-left"
                >
                  <FaShoppingBag className="text-amber-300" />
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/blog")}
                  className="flex items-center gap-2 hover:text-amber-300 cursor-pointer transition-colors duration-200 w-full text-left"
                >
                  <FaBlog className="text-amber-300" />
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/faq")}
                  className="flex items-center gap-2 hover:text-amber-300 cursor-pointer transition-colors duration-200 w-full text-left"
                >
                  <FaQuestionCircle className="text-amber-300" />
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="flex items-center gap-2 hover:text-amber-300 cursor-pointer transition-colors duration-200 w-full text-left"
                >
                  <FaRegEnvelope className="text-amber-300" />
                  Contact Us
                </button>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaPhone className="text-amber-300" /> 
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaEnvelope className="text-amber-300" /> 
                <span>support@shophub.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaMapMarkerAlt className="text-amber-300" /> 
                <span>123 Market Street, New York, USA</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new products and special offers.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button
              onClick={() => handleNavigation("/terms")}
              className="text-gray-400 hover:text-amber-300 transition-colors duration-200"
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleNavigation("/privacy")}
              className="text-gray-400 hover:text-amber-300 transition-colors duration-200"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigation("/cookies")}
              className="text-gray-400 hover:text-amber-300 transition-colors duration-200"
            >
              Cookie Policy
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Made with ❤️ for the shopping community
          </p>
        </div>
      </div>
    </footer>
  );
};