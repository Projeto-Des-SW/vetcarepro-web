import { Outlet, useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { useUserSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/user-slice";
import { Button } from "@/components/ui/button";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Separator } from "@/components/ui/separator";

const Interna = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();
  const { idClinica } = useParams();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/home");
  };

  return (
    <div className="flex h-screen">
      <aside className="flex-shrink-0 w-64 border-r-2 bg-background">
        <div className="flex flex-col items-start gap-4 px-4 py-5">
          <NavLink
            to="/dashboard/listagemClinica"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <HomeWorkIcon />
            <span>Minhas clinicas</span>
          </NavLink>
          <NavLink
            to={`/internalClinica/${idClinica}/dashboard`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <DashboardIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={`listagemPaciente`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <PersonIcon />
            <span>Listar Pacientes</span>
          </NavLink>
          <NavLink
            to={`cadastrarPaciente`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <PersonAddIcon />
            <span>Cadastrar Pacientes</span>
          </NavLink>
          <NavLink
            to={`listagemServico`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <HomeRepairServiceIcon />
            <span>Listar Serviços</span>
          </NavLink>
          <NavLink
            to={`cadastrarServico`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <DesignServicesIcon />
            <span>Cadastrar Serviço</span>
          </NavLink>
          <NavLink
            to={`agendamento`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <DesignServicesIcon />
            <span>Novo Agendamento</span>
          </NavLink>
          <NavLink
            to={`cadastrarFuncionario`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <DesignServicesIcon />
            <span>Cadastrar funcionário</span>
          </NavLink>
          <NavLink
            to={`listagemFuncionario`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <DesignServicesIcon />
            <span>Listagem funcionário</span>
          </NavLink>
        </div>

        <Separator />
        <div className="mt-auto flex flex-col items-start gap-2 px-4 py-5">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50"
          >
            <LogoutIcon />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex m-10 box-border w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Interna;
