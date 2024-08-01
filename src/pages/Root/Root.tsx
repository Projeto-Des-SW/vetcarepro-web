import Footer from "@/pages/Home/Footer/Footer";
import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <section className="h-screen">
      <Header />
      <Outlet />
      <Footer />
    </section>
  );
};

export default Root;
