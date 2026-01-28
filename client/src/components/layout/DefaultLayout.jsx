import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="py-12 mt-12">{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
