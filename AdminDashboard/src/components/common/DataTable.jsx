// src/components/common/DataTable.jsx
import React from "react";
import { motion } from "framer-motion";
import { Scrollbar } from "react-scrollbars-custom";

export default function DataTable({ columns, data, onRowClick, actions }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-150px)]">
      {/* Header */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body — scrolls with custom scrollbar */}
      <div className="flex-1">
        <Scrollbar
          noScrollX
          style={{ width: "100%", height: "100%" }}
          trackYProps={{
            style: {
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              width: "8px",
            },
          }}
          thumbYProps={{
            style: {
              backgroundColor: "#f9A03f",
              borderRadius: "8px",
              width: "8px",
            },
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <motion.tr
                    key={row.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {actions(row)}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
}
