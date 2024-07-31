("react");
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-[#4EBA9D] text-primary-foreground px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <span className="sr-only">VETCARE</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Team
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
