import { FiTruck, FiShield, FiTag } from "react-icons/fi";

export const FeaturesBanner = () => {
  const features = [
    {
      icon: <FiTruck className="text-3xl text-blue-600" />,
      title: "Free Shipping",
      desc: "On orders over $50",
      bg: "from-blue-100 to-blue-200",
    },
    {
      icon: <FiShield className="text-3xl text-green-600" />,
      title: "Secure Payment",
      desc: "100% protected",
      bg: "from-green-100 to-green-200",
    },
    {
      icon: <FiTag className="text-3xl text-purple-600" />,
      title: "Best Price",
      desc: "Guaranteed",
      bg: "from-purple-100 to-purple-200",
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon with gradient circle */}
              <div
                className={`p-4 rounded-full bg-gradient-to-br ${feature.bg} flex items-center justify-center shadow-md`}
              >
                {feature.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
