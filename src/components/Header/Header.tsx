("react");
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserSelector } from "@/store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/user-slice";

const Header = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setCurrentUser({ email: "" }));
    navigate("/home");
  };

  return (
    <>
      <header className="bg-[#4EBA9D] h-[80px] text-primary-foreground px-10 flex items-center">
        <Link
          to="/home"
          className="flex items-center justify-center font-bold text-3xl"
        >
          VetCare
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            to="/home"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Preços
          </Link>
          <Link
            to=""
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Team
          </Link>

          {user.email === "" ? (
            <>
              <Button onClick={() => navigate("/login")}>Teste gratis</Button>
              <Button
                onClick={() => navigate("/login")}
                variant={"outline"}
                className="text-black"
              >
                Login
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  onClick={() => navigate("/login")}
                  variant={"outline"}
                  className="text-black"
                >
                  Minha conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("dashboard/listagemClinica")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <Separator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
