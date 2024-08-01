import { Button } from "../ui/button";
import boasVindas from "../../assets/boasVindas.png";
const FrontHome = () => {

  

  return (
    <div className="flex justify-center items-center w-full h-5/6 box-border">
      <div className="w-[33%] p-8 flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Gerencie sua clínica veterinária com o VETCARE
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          O VETCARE é um sistema completo de gestão de clínicas veterinárias,
          com recursos avançados para facilitar o atendimento aos seus pacientes
          e a administração do seu negócio.
        </p>
        <div className="flex w-full gap-2">
          <Button className="w-1/2 bg-[#4EBA9D]">Entenda nossos preços</Button>
          <Button className="w-1/2" variant={"outline"}>Sobre nós</Button>
        </div>
      </div>

      <picture className="">
        <img src={boasVindas} alt="" />
      </picture>
    </div>
  );
};

export default FrontHome;
