import { Button } from "@/components/ui/button";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserSelector } from "@/store/hooks";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);

  console.log(user);

  return (
    <section className="flex gap-4">
      <aside className="inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background sm:flex">
        <div className="flex flex-col items-start gap-4 px-4 py-5">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive ? "bg-red" : "bg-blue"
              }`
            }
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="listagemClinica"
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
            to="cadastrarClinica"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`
            }
          >
            <HomeWorkIcon />
            <span>Cadastrar Clinicas</span>
          </NavLink>
        </div>
        <div className="mt-auto flex flex-col items-start gap-2 px-4 py-5">
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50"
          >
            <LogoutIcon />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <div className="flex flex-col justify-center gap-2 w-full">
        <Outlet />
      </div>
    </section>
  );
};

export default Dashboard;
