import React from "react";
import { FaShoppingBag, FaBox } from "react-icons/fa";

const OrderTab = ({ orders, loading }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => {
              const Icon = order.icon || FaBox;
              return (
                <div
                  key={order.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {order.id}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Placed on {order.date}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${order.total}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-3">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Track Order
                    </button>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Buy Again
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTab;
