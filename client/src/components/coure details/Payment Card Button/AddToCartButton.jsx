import React from "react";

const AddToCartButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-orange-500 text-white w-full py-2 rounded mb-4 hover:bg-orange-600"
    //   style={{
    //     backgroundColor: "orange",
    //     color: "white",
    //     padding: "10px 20px",
    //     border: "none",
    //     borderRadius: "5px",
    //     cursor: "pointer",
    //   }}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
