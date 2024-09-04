import { Button } from "@/components/ui/button";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/user-slice";

const Dashboard = () => {
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/home");
  };
  console.log(user);

  return (
    <section className="flex gap-4 h-full">
      <aside className="inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background sm:flex h-full">
        <div className="flex flex-col items-start gap-4 px-4 py-5">
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
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50"
          >
            <LogoutIcon />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
      <div className="flex flex-col gap-2 w-full items-center p-8">
        <Outlet />
      </div>
    </section>
  );
};

export default Dashboard;
