import Footer from "@/pages/Home/Footer/Footer";
import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </section>
  );
};

export default Root;
