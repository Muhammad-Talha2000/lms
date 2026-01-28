
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/img/bg-img/page.png";
import shape from "../../assets/img/page-header-shape.png"


const PageHeader = ({title, breadcrumb}) => {
  
  return (
    <div className="w-[90%] mx-auto mb-8">
      <section className="w-full relative z-1 overflow-hidden p-24">
        <div className="w-full">
          <div
            className="absolute top-0 right-0 w-full h-full bg-no-repeat bg-cover bg-top-right z-[-1]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="absolute inset-0 w-full h-full z-[-1] bg-gradient-to-r from-[#F3F7FB] to-[rgba(243,247,251,0.24)]"></div>
          <div className="absolute z-1 bottom-2 left-4">
            <div className="shape shape-1">
              <img src={shape} className="w-36" alt="Decorative shape" />
            </div>
          </div>
        </div>
        <div className="w-full mr-auto ml-auto pr-1 pl-28">
          <div className="page-header-content">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <h4 className="text-base font-medium">
              <Link className="home" to="/">
                Home
              </Link>
              <span className="icon"> / </span>
              <span className="text-orange-500">{breadcrumb}</span>
            </h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageHeader;
