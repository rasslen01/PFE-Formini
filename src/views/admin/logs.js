import React from "react";

// components

import CardPageVisits from "components/Cards/CardPageVisits.js";

export default function Logs() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4 mt-10">
          <CardPageVisits />
        </div>
        {/* <div className="w-full mb-12 px-4">
          <CardTable color="dark" />
        </div> */}
      </div>
    </>
  );
}
