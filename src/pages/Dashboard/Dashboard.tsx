import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <section className="flex gap-4 h-[94vh]">
      <nav className="bg-[#E4E4E7] w-fit h-full box-border flex-col flex p-2">
        <Button
          variant="ghost"
          className="w-[150px]"
          onClick={() => navigate("listagemClinica")}
        >
          Listar Clinicas
        </Button>
        <Button
          variant="ghost"
          className="w-[150px]"
          onClick={() => navigate("cadastrarClinica")}
        >
          Cadastrar Clinicas
        </Button>
        <Button
          variant="ghost"
          className="w-[150px]"
          onClick={() => navigate("listagemPaciente")}
        >
          Listar Pacientes
        </Button>
        <Button
          variant="ghost"
          className="w-[150px]"
          onClick={() => navigate("cadastrarPaciente")}
        >
          Cadastrar Pacientes
        </Button>
      </nav>

      <aside className="flex flex-col justify-center items-center w-full p-8">
        <div className="flex flex-col justify-center gap-2">
          <Outlet />
        </div>
      </aside>
    </section>
  );
};

export default Dashboard;
