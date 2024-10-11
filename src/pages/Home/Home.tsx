import Depoimentos from "@/pages/Home/Depoimentos/Depoimentos";
import FrontHome from "@/pages/Home/FrontHome/FrontHome";
import EndHome from "./EndHome/EndHome";
import Recursos from "@/components/Recursos/Recursos";

const Home = () => {
  return (
    <section className="h-screen overflow-y-auto py-8">
      <FrontHome />
      <Recursos />
      <Depoimentos />
      <EndHome />
    </section>
  );
};

export default Home;
