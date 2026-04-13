import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="mt-12 min-w-0 w-full overflow-x-hidden bg-background py-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
