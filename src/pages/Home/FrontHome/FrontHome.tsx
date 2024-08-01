import { Button } from "../../../components/ui/button";
import boasVindas from "../../../assets/boasVindas.png";

const FrontHome = () => {
  return (
    <div className="flex justify-center items-center w-full h-[70vh] box-border gap-[70px]">
      <div className="w-[33%] p-8 flex flex-col gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Gerencie sua clínica veterinária com o VetCare
        </h1>
        <p className="leading-7 [&:not(:first-child)]">
          O VETCARE e um sistema completo de gestao de clinicas veterinarias,
          com recursos avancados para facilitar o atendimento aos seus pacientes
          e a administracao do seu negocio.
        </p>
        <div className="flex w-full gap-4">
          <Button className="w-1/2 bg-[#4EBA9D]">Entenda nossos preços</Button>
          <Button className="w-1/2" variant={"outline"}>
            Sobre nós
          </Button>
        </div>
      </div>

      <picture className="">
        <img src={boasVindas} alt="" />
      </picture>
    </div>
  );
};

export default FrontHome;
