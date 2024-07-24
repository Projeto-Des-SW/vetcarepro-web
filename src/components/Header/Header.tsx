import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
("react");
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar className="bg-[#4EBA9D]">
        <NavbarBrand>
          <Button onClick={() => navigate("/login")} variant="light">
            <p className="font-bold text-inherit">
              VETCARE<span className="text-[#AAFAEF]">PRO</span>
            </p>
          </Button>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Como funciona?
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link href="#" color="foreground" aria-current="page">
              Valores
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" href="#">
              Sobre nós
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          {/* <NavbarItem className="hidden lg:flex">
            <Link href="#">Login</Link>
          </NavbarItem> */}

          {/*Renderizar a opção se estiver logado ou não */}

          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  as={Link}
                  className="bg-[#AAFAEF]"
                  href="#"
                  variant="flat"
                >
                  Minha conta
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="new">Perfil</DropdownItem>
                <DropdownItem key="copy">Configurações</DropdownItem>
                <DropdownItem
                  onClick={() => console.log("loggout")}
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Sair
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <Outlet />
    </>
  );
};

export default Header;
