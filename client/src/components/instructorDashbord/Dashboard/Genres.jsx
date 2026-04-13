// import React from "react";
// import { Users } from "lucide-react";

// const Genres = () => {
//   return (
//     <div className="flex items-center justify-center py-2 min-w-48 bg-[#e6f6f5] rounded-lg gap-8">
//       <Users className="w-8 h-8 text-orange-500" />
//       <div className="flex flex-col">
//         <h3>Live Courses</h3>
//         <p clasName="text-lg font-bold">14</p>
//       </div>
//     </div>
//   );
// };

// export default Genres;

import React from "react";

const Genres = ({ title, description, Icon, padding }) => {
  return (
    <div className="flex items-center justify-start py-2 sm:py-3 min-w-0 w-full bg-[#e6f6f5] rounded-lg gap-2 sm:gap-4 px-2 sm:px-4">
      {/* Display icon only if provided */}
      <div className={`bg-white rounded-full ${padding ? `p-${padding}` : ""}`}>
        {Icon && <Icon className="w-6 h-6 text-orange-500" />}
      </div>

      <div className="flex flex-col">
        <h3 className="text-orange-500 font-semibold">{title}</h3>
        <p className="text-lg font-bold">{description}</p>
      </div>
    </div>
  );
};

export default Genres;
