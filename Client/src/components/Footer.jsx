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
                  <FaMapMarkerAlt className="text-amber-300" /> Konel
                  Street, Dire Dawa, Ethiopia
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

     {/* Popup Modal with Animation */}
<AnimatePresence>
  {activePage && (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm bg-black/60 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl w-11/12 md:w-3/4 lg:w-1/2 p-8 overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setActivePage(null)}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 transition p-2 rounded-full shadow-md"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center drop-shadow-md">
          {activePage}
        </h2>

        {/* Render Dynamic Page Component */}
        <div className="text-gray-200">
          {pageComponents[activePage]}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
};
