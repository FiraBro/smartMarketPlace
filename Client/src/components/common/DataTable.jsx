import React from "react";
import { motion } from "framer-motion";
import { Scrollbar } from "react-scrollbars-custom";

export default function DataTable({
  columns = [],
  data = [],
  onRowClick,
  actions,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-150px)]">
      {/* Table with header and body */}
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
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          {/* Header */}
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
              {actions && <th className="px-6 py-3 text-center">Actions</th>}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <motion.tr
                  key={row.orderId || index}
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
                        ? column.render(row[column.key] ?? "-", row)
                        : row[column.key] ?? "-"}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center space-x-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </Scrollbar>
    </div>
  );
}
