import { Button } from "../../../components/ui/button";
import boasVindas from "../../../assets/boasVindas.png";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const FrontHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center w-full h-[70vh] box-border gap-[70px]">
      <div className="w-[33%] p-8 flex flex-col gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl dark:text-white">
          <Typewriter
            words={[
              "Olá! Bem-vindo!",
              "Vamos começar uma nova experiência!",
              "Gerencie sua clínica veterinária com o VetCare",
            ]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>
        <p className="leading-7 max-w-2xl text-gray-700 dark:text-gray-300 mt-4 lg:text-lg">
          O <span className="font-bold">VETCARE</span> é um sistema completo de
          gestão de clínicas veterinárias, com recursos avançados para facilitar
          o atendimento aos seus pacientes e a administração do seu negócio.
        </p>

        <div className="flex w-full gap-4">
          <Button
            className="w-1/2 bg-[#4EBA9D]"
            onClick={() => navigate("/pricing")}
          >
            Entenda nossos preços
          </Button>
          <Button
            className="w-1/2 dark:text-white"
            variant={"outline"}
            onClick={() => navigate("/team")}
          >
            Nosso time
          </Button>
        </div>
      </div>

      <picture className="">
        <img
          src={boasVindas}
          alt="Boas Vindas"
          className="w-[80%] h-auto max-w-lg"
        />
      </picture>
    </div>
  );
};

export default FrontHome;
