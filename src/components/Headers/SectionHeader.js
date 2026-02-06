import React from "react";

export default function SectionHeader({ title }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mt-2 rounded-full"></div>
      </div>
    </div>
  );
}