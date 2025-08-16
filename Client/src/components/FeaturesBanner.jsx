import { FiTruck, FiShield, FiTag } from "react-icons/fi";

export const FeaturesBanner = () => {
  const features = [
    {
      icon: <FiTruck className="text-2xl" />,
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      icon: <FiShield className="text-2xl" />,
      title: "Secure Payment",
      desc: "100% protected",
    },
    {
      icon: <FiTag className="text-2xl" />,
      title: "Best Price",
      desc: "Guaranteed",
    },
  ];

  return (
    <div className=" bg-[#fff] px-2 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
