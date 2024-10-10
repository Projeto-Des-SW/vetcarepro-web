// @ts-nocheck
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserSelector } from "@/store/hooks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import {
  clearNotifications,
  logoutUser,
  setCurrentRoleEmployee,
  setDarkMode,
  setTierAccount,
} from "@/store/user-slice";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DeleteIcon from "@mui/icons-material/Delete";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Toaster } from "../ui/sonner";

import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { fetchDataUser } from "@/services/getServices";
import { Badge } from "../ui/badge";
import { CalendarCheck2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LightModeIcon from "@mui/icons-material/LightMode";
import { capitalizeFirstLetter, splitIntoGroups } from "@/utils/const.utils";
import {
  Pagination,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { HexColorPicker } from "react-colorful";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Header = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentColor, setCurrentColor] = useState("#45BCAD");

  const itemsPerPage = 7;

  const { data, isPending } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetchDataUser(user.token),
    enabled: Boolean(user.email),
  });

  useEffect(() => {
    if (isChecked) {
      localStorage.removeItem("joyrideMenu");
      localStorage.removeItem("joyride");
    }
  }, [isChecked]);

  useEffect(() => {
    if (!localStorage.getItem("joyride")) {
      setIsChecked(true);
    }
    if (data?.role) {
      dispatch(setCurrentRoleEmployee(data.role));
    } else {
      dispatch(setCurrentRoleEmployee("MANAGER"));
    }

    dispatch(setTierAccount(data?.tier));
  }, [data]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    console.log(checked);
  };

  const handleSetDarkMode = () => {
    dispatch(setDarkMode());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/home");
    setOpenModal(false);
  };

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
  };

  const tiermap = [
    { tier: "TIER_ONE", title: "Free" },
    { tier: "TIER_TWO", title: "Standard" },
    { tier: "TIER_THREE", title: "Enterprise" },
  ];
  console.log(data);

  const totalPages = splitIntoGroups(user.notifications, itemsPerPage);
  const current = `bg-[${currentColor}]`;
  return (
    <>
      <header
        className={`h-[70px] text-primary-foreground px-10 flex items-center ${
          user.isDarkMode && `dark bg-[${currentColor}]`
        }`}
        style={{
          backgroundColor: currentColor,
        }}
      >
        <Dialog
          open={openModal}
          onOpenChange={() => setOpenModal((prevState) => !prevState)}
        >
          <DialogContent className={`${user.isDarkMode && "dark"}`}>
            <DialogHeader>
              <DialogTitle className={`${user.isDarkMode && "text-white"}`}>
                Minhas informações
              </DialogTitle>
              <DialogDescription>
                <div className="rounded-lg flex flex-col items-center p-4 gap-6">
                  <picture className="flex items-center flex-col gap-2">
                    <Avatar className="w-[100px] h-[100px] ">
                      <AvatarFallback className="bg-[#4EBA9D] text-2xl text-white">
                        {data?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="">
                        Acesso - {user.role}
                      </Badge>
                    </div>
                  </picture>

                  <div className="flex gap-4 ">
                    <Input readOnly value={data?.name} />
                    <Input readOnly value={data?.email} />
                  </div>
                  <div className=" items-center flex space-x-2">
                    <Checkbox
                      id="terms1"
                      checked={isChecked}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Ver tutorial novamente
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                      Customização do header
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setCurrentColor("#45BCAD")}
                            >
                              <RestoreIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="max-w-xs p-2 text-sm"
                          >
                            <p>Redefinir cor do header para cor padrão</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h1>
                    <HexColorPicker
                      color={currentColor}
                      onChange={setCurrentColor}
                    />
                  </div>

                  <Button
                    variant={"destructive"}
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="flex gap-1 items-end ">
          <Link
            to="/home"
            className="flex items-end flex-col justify-center font-bold text-3xl gap-1"
          >
            VetCare
            {user.email && user.tier && (
              <Badge variant="secondary" className="mt-[-8px] text-xs">
                {tiermap.find((tier) => tier.tier === user.tier)?.title ||
                  "N/A"}
              </Badge>
            )}
          </Link>
        </div>

        <nav className="ml-auto flex gap-2 items-center">
          <Toaster />
          <Button onClick={handleSetDarkMode} variant="ghost">
            {!user.isDarkMode ? <NightsStayIcon /> : <LightModeIcon />}
          </Button>
          {user.email === "" ? (
            <>
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
                to="/team"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Team
              </Link>
              <Button
                onClick={() => navigate("/login")}
                variant={"outline"}
                className="text-black dark:text-white"
              >
                Login
              </Button>
            </>
          ) : (
            <>
              {isPending ? (
                <>
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-8 w-36" />
                </>
              ) : (
                <div className="flex gap-4 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        {user.notifications.length <= 1 ? (
                          <NotificationsNoneIcon
                            className={`${
                              user.isDarkMode &&
                              "dark text-dark hover:text-white"
                            } cursor-pointer`}
                          />
                        ) : (
                          <NotificationsActiveIcon
                            className={`${
                              user.isDarkMode &&
                              "dark text-black hover:text-white"
                            } cursor-pointer`}
                          />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={`w-[360px] p-4 ${user.isDarkMode && "dark"}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Notificações</h3>
                      </div>
                      <div className="grid gap-4">
                        <div className="flex items-start gap-4">
                          <ul
                            className={`flex flex-col justify-center gap-3  ${
                              user.isDarkMode && "dark text-white"
                            }`}
                          >
                            {totalPages[currentPage]?.map(
                              (notification, index) => (
                                <div key={index}>
                                  {index > 0 && (
                                    <li
                                      className="flex items-start jus gap-4"
                                      key={index}
                                    >
                                      <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8">
                                        <CalendarCheck2Icon className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">
                                          {notification.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground max-w-[250px] truncate">
                                          {notification.description}
                                        </p>
                                      </div>
                                    </li>
                                  )}
                                </div>
                              )
                            )}

                            <div className="flex justify-center mt-4">
                              <Pagination>
                                <PaginationPrevious
                                  onClick={() =>
                                    currentPage !== 0 &&
                                    setCurrentPage((prevState) => prevState - 1)
                                  }
                                />

                                {totalPages.map((_item, index) => (
                                  <PaginationLink
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    isActive={currentPage === index}
                                  >
                                    {index + 1}
                                  </PaginationLink>
                                ))}

                                <PaginationNext
                                  onClick={() =>
                                    currentPage !== totalPages.length - 1 &&
                                    setCurrentPage((prevState) => prevState + 1)
                                  }
                                />
                              </Pagination>
                            </div>
                          </ul>
                        </div>
                        {user.notifications.length > 0 ? (
                          <Button onClick={handleClearNotifications}>
                            <DeleteIcon />
                          </Button>
                        ) : (
                          <p>Sem notificacões</p>
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex  items-center gap-2 p-2 text-white bg-transparent">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback
                              className={`text-black ${
                                user.isDarkMode && "text-white"
                              }`}
                            >
                              {data?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="max-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap">
                            Olá, {data?.name}
                          </p>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="flex flex-col w-full">
                          <ul
                            className={`flex flex-col w-[200px] gap-3 p-4 ${
                              user.isDarkMode && "dark text-white"
                            }`}
                          >
                            <NavigationMenuLink
                              onClick={() =>
                                navigate("dashboard/listagemClinica")
                              }
                              className="cursor-pointer"
                            >
                              Dashboard
                            </NavigationMenuLink>
                            <NavigationMenuLink
                              onClick={() => navigate("/assinatura")}
                              className="cursor-pointer"
                            >
                              Assinaturas
                            </NavigationMenuLink>

                            <NavigationMenuLink
                              onClick={() =>
                                setOpenModal((prevState) => !prevState)
                              }
                              className="cursor-pointer"
                            >
                              Profile
                            </NavigationMenuLink>

                            <Separator />
                            <NavigationMenuLink
                              onClick={handleLogout}
                              className="cursor-pointer"
                            >
                              Logout
                            </NavigationMenuLink>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              )}
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
