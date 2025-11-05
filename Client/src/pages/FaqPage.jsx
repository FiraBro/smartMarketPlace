import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTruck, 
  FaUndo, 
  FaCreditCard, 
  FaShieldAlt, 
  FaPhone,
  FaBoxOpen,
  FaHeadset,
  FaStar,
  FaClock
} from "react-icons/fa";

const FAQPage = () => {
  const navigate = useNavigate();

  const faqCategories = [
    {
      title: "Orders & Shipping",
      icon: <FaTruck className="w-6 h-6" />,
      questions: [
        {
          question: "How can I track my order?",
          answer: "Track your order in real-time from your account dashboard under 'My Orders'. You'll receive email updates with tracking information at every stage of delivery. For additional assistance, our support team can provide real-time updates."
        },
        {
          question: "What are your shipping options and delivery times?",
          answer: "We offer multiple shipping options: Standard (3-5 business days), Express (1-2 business days), and Overnight shipping. Delivery times may vary based on your location and product availability. Shipping costs are calculated at checkout."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship to over 50 countries worldwide. International orders typically deliver within 7-14 business days. Please note that customs fees, taxes, and import duties are the customer's responsibility and are not included in the shipping cost."
        },
        {
          question: "Can I modify or cancel my order after placement?",
          answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter our fulfillment process and cannot be changed. Contact our support team immediately if you need to make changes."
        }
      ]
    },
    {
      title: "Returns & Refunds",
      icon: <FaUndo className="w-6 h-6" />,
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy from the delivery date. Items must be unused, in original packaging with all tags attached. Personalized, intimate, and digital products are final sale and not eligible for return."
        },
        {
          question: "How long do refunds take to process?",
          answer: "Refunds are processed within 3-5 business days after we receive your return. The refund will appear in your original payment method within 5-10 business days, depending on your bank or payment provider."
        },
        {
          question: "Who pays for return shipping costs?",
          answer: "We provide free return shipping for defective, damaged, or incorrect items. For change-of-mind returns, customers are responsible for return shipping costs. We offer a prepaid return label for a deductible from your refund."
        },
        {
          question: "What if I receive a damaged or incorrect item?",
          answer: "Contact us within 48 hours of delivery with photos of the damaged/incorrect item and packaging. We'll arrange a free return and expedite a replacement or full refund immediately."
        }
      ]
    },
    {
      title: "Payments & Security",
      icon: <FaCreditCard className="w-6 h-6" />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, Shop Pay, and bank transfers for orders over $500. All payments are processed securely through PCI-compliant gateways."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard 256-bit SSL encryption and are PCI-DSS compliant. We never store your complete payment details on our servers. All transactions are processed through secure, certified payment processors."
        },
        {
          question: "Do you offer installment payment options?",
          answer: "Yes, we offer installment plans through Afterpay, Klarna, and Affirm for orders between $50-$2,000. These allow you to split your payment into 4 interest-free installments over 6 weeks."
        },
        {
          question: "Why was my payment declined?",
          answer: "Common reasons include insufficient funds, incorrect card details, bank security blocks, or billing address mismatches. Contact your bank or try an alternative payment method. Our support team can help troubleshoot payment issues."
        }
      ]
    },
    {
      title: "Product & Quality",
      icon: <FaBoxOpen className="w-6 h-6" />,
      questions: [
        {
          question: "How do I know if a product is in stock?",
          answer: "Product availability is shown on each product page. Items marked 'In Stock' ship within 24 hours. 'Low Stock' indicates limited availability. 'Backorder' items will show expected restock dates."
        },
        {
          question: "Are your products authentic and high-quality?",
          answer: "We guarantee 100% authenticity and work directly with brands and authorized distributors. All products undergo quality checks, and we offer manufacturer warranties where applicable. Read customer reviews for real product experiences."
        },
        {
          question: "Can I see more product photos or information?",
          answer: "Each product page includes multiple high-resolution images, detailed specifications, and customer reviews. If you need additional information, contact our product specialists who can provide more details or additional photos."
        },
        {
          question: "Do you offer product warranties?",
          answer: "Most electronics and premium products include manufacturer warranties ranging from 1-3 years. Warranty information is specified on product pages. We handle warranty claims and provide support throughout the warranty period."
        }
      ]
    },
    {
      title: "Account & Support",
      icon: <FaHeadset className="w-6 h-6" />,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the top navigation and provide your email address and password. You can also create an account during checkout. Account benefits include order tracking, wish lists, faster checkout, and exclusive offers."
        },
        {
          question: "What are your customer support hours?",
          answer: "Our customer support team is available Monday-Friday 8:00 AM - 8:00 PM EST and Saturday-Sunday 9:00 AM - 6:00 PM EST. We aim to respond to all inquiries within 2 hours during business hours."
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link valid for 24 hours. For security reasons, our support team cannot reset passwords directly."
        },
        {
          question: "Can I merge multiple accounts?",
          answer: "Yes, contact our support team with the email addresses associated with each account. We can merge order history, rewards points, and preferences into a single account for better management."
        }
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Help Center</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Get answers to your questions about shopping, shipping, returns, and more
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">30 Days</div>
              <div className="text-sm text-gray-600">Easy Returns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">Free</div>
              <div className="text-sm text-gray-600">Shipping Over $50</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Secure Payment</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {faqCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <div className="text-white">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  {category.questions.map((item, qIndex) => (
                    <div key={qIndex} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                        {item.question}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;