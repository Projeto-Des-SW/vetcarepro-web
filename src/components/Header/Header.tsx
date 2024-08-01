("react");
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-[#4EBA9D] h-[80px] text-primary-foreground px-10 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center font-bold text-3xl"
          prefetch={false}
        >
          VetCare
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            to="/home"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            to="/pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Preços
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
            disabled
          >
            Team
          </Link>
          <Button onClick={() => navigate("/login")}>Teste gratis</Button>
          <Button
            onClick={() => navigate("/login")}
            variant={"outline"}
            className="text-black"
          >
            Login
          </Button>
        </nav>
      </header>
    </>
  );
};

export default Header;
