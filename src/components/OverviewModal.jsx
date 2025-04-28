import React from 'react';

const OverviewModal = ({ visible = true, onClose, title, items }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full space-y-4">
        <h3 className="text-xl font-bold">{title} Overview</h3>

        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item, index) => (
            <li key={index} className="border-b pb-2">
              <div className="font-medium">{item.company}</div>
              <div className="text-sm text-gray-600">Date: {item.date}</div>
              <div className="text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    item.status === "Upcoming"
                      ? "text-blue-600"
                      : item.status === "Today"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  
                >
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OverviewModal;
