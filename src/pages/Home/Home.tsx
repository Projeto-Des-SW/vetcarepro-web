import Depoimentos from "@/components/Depoimentos/Depoimentos";
import FooterHome from "@/components/FooterHome/FooterHome";
import FrontHome from "@/components/FrontHome/FrontHome";
import Recursos from "@/components/Recursos/Recursos";

const Home = () => {
  return (
    <section className="h-[100vh]">
      <FrontHome />
      <Recursos />
      <Depoimentos />
      <FooterHome />
    </section>
  );
};

export default Home;
