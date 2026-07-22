import React from "react";

// components

import CardSettingsStudents from "components/Cards/CardSettingsStudents.js";

export default function Settings() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardSettingsStudents />
        </div>
        <div className="w-full lg:w-4/12 px-4">
        </div>
      </div>
    </>
  );
}
