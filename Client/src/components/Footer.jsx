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

export const Footer = () => {
  return (
    <footer className="bg-[#000] text-white pt-12 pb-6 px-4">
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
                <FaMapMarkerAlt className="text-amber-300" /> 123 Market Street,
                New York, USA
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2 hover:text-white">
                <FaQuestionCircle className="text-amber-300" />
                <a href="#">FAQs</a>
              </li>
              <li className="flex items-center gap-2 hover:text-white">
                <FaBlog className="text-amber-300" />
                <a href="#">Blog</a>
              </li>
              <li className="flex items-center gap-2 hover:text-white">
                <FaRegEnvelope className="text-amber-300" />
                <a href="#">Contact</a>
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
            © {new Date().getFullYear()} SmartMarketPlace. All rights reserved.
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
  );
};
