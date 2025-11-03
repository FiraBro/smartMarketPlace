import React, { useState } from "react";
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { FAQ, Contact, Blog } from "../pages/FooterPage"; // import your components

export const Footer = () => {
  const [activePage, setActivePage] = useState(null);

  const pageComponents = {
    FAQs: <FAQ />,
    Contact: <Contact />,
    Blog: <Blog />,
  };

  return (
    <>
      <footer className="bg-[#250902] text-white pt-12 pb-6 px-4">
        <div className="container mx-auto">
          {/* Grid Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2 text-[#fff]">
                  <FaPhone className="text-amber-300" /> +1 234 567 890
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-amber-300" />{" "}
                  support@smartmarketplace.com
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-amber-300" /> 123 Market
                  Street, New York, USA
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li
                  className="flex items-center gap-2 hover:text-white cursor-pointer"
                  onClick={() => setActivePage("FAQs")}
                >
                  <FaQuestionCircle className="text-amber-300" />
                  FAQs
                </li>
                <li
                  className="flex items-center gap-2 hover:text-white cursor-pointer"
                  onClick={() => setActivePage("Blog")}
                >
                  <FaBlog className="text-amber-300" />
                  Blog
                </li>
                <li
                  className="flex items-center gap-2 hover:text-white cursor-pointer"
                  onClick={() => setActivePage("Contact")}
                >
                  <FaRegEnvelope className="text-amber-300" />
                  Contact
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-sky-500 transition"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-pink-500 transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 transition"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} SmartMarketPlace. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Updated Popup Modal with Modern Design */}
      <AnimatePresence>
        {activePage && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg capitalize">
                    {activePage}
                  </h3>
                  <button
                    onClick={() => setActivePage(null)}
                    className="text-white hover:bg-white/20 p-1 rounded-full transition-all duration-200 w-8 h-8 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content with scroll */}
              <div className="p-6 max-h-[calc(85vh-80px)] overflow-y-auto">
                {pageComponents[activePage]}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};