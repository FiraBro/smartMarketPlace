import { FaPumpSoap, FaRing, FaShoePrints, FaTshirt } from "react-icons/fa";

export const CategorySection = () => {
  const categories = [
    {
      icon: <FaPumpSoap className="text-3xl text-pink-600" />,
      title: "Cosmetics",
      desc: "Makeup & skincare",
      bg: "from-pink-100 to-pink-200",
    },
    {
      icon: <FaRing className="text-3xl text-yellow-600" />,
      title: "Accessories",
      desc: "Jewelry & more",
      bg: "from-yellow-100 to-yellow-200",
    },
    {
      icon: <FaShoePrints className="text-3xl text-blue-600" />,
      title: "Footwear",
      desc: "Shoes & sandals",
      bg: "from-blue-100 to-blue-200",
    },
    {
      icon: <FaTshirt className="text-3xl text-green-600" />,
      title: "Clothing",
      desc: "Trendy outfits",
      bg: "from-green-100 to-green-200",
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon with gradient circle */}
              <div
                className={`p-4 rounded-full bg-gradient-to-br ${category.bg} flex items-center justify-center shadow-md`}
              >
                {category.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">{category.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
