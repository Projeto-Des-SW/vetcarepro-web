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
  setDarkMode,
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

const Header = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

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
  }, []);

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

  const { data, isPending } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetchDataUser(user.token),
  });

  return (
    <>
      <header
        className={`bg-[#45BCAD] h-[70px] text-primary-foreground px-10 flex items-center ${
          user.isDarkMode && "dark bg-[#45BCAD]"
        }`}
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
                <div className="  rounded-lg flex flex-col items-center p-4 gap-6">
                  <picture className="flex items-center flex-col gap-2">
                    <Avatar className="w-[100px] h-[100px] ">
                      <AvatarFallback className="bg-[#4EBA9D] text-2xl text-white">
                        {data?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="">
                        Enterprise
                      </Badge>
                    </div>
                  </picture>

                  <div className="flex gap-4 ">
                    <Input readOnly value={data?.name} />
                    <Input readOnly value={data?.email} />
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
            {user.email && (
              <Badge variant="secondary" className="mt-[-8px] text-xs">
                Enterprise
              </Badge>
            )}
          </Link>
        </div>

        <nav className="ml-auto flex gap-2 items-center">
          <Toaster />
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
                to=""
                className="text-sm font-medium hover:underline underline-offset-4"
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
                  <Button onClick={handleSetDarkMode} variant="ghost">
                    {!user.isDarkMode ? <NightsStayIcon /> : <LightModeIcon />}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {user.notifications.length <= 1 ? (
                        <NotificationsNoneIcon
                          className={`${
                            user.isDarkMode && "dark  text-black"
                          } cursor-pointer`}
                        />
                      ) : (
                        <NotificationsActiveIcon
                          className={`${
                            user.isDarkMode && "dark  text-black"
                          } cursor-pointer`}
                        />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[360px] p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Notificações</h3>
                      </div>
                      <div className="grid gap-4">
                        <div className="flex items-start gap-4">
                          <ul
                            className={`flex flex-col justify-center gap-3  ${
                              user.isDarkMode && "dark bg-black text-white"
                            }`}
                          >
                            {user.notifications.map((notification, index) => (
                              <div key={index}>
                                {index > 0 && (
                                  <li
                                    className="flex items-start gap-4"
                                    key={index}
                                  >
                                    <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8">
                                      <CalendarCheck2Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">
                                        {notification.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {notification.description}
                                      </p>
                                    </div>
                                  </li>
                                )}
                              </div>
                            ))}
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
                  {/* <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex items-center gap-4 p-2 text-white bg-transparent">
                          {user.notifications.length <= 1 ? (
                            <NotificationsNoneIcon
                              className={`${
                                user.isDarkMode && "dark  text-black"
                              }`}
                            />
                          ) : (
                            <NotificationsActiveIcon
                              className={`${
                                user.isDarkMode && "dark  text-black"
                              }`}
                            />
                          )}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent className="flex flex-col w-full">
                          <ul
                            className={`flex flex-col w-[360px] gap-3 p-4 ${
                              user.isDarkMode && "dark bg-black text-white"
                            }`}
                          >
                            <h3 className="text-lg font-semibold">
                              Notifications
                            </h3>
                            {user.notifications.map((notification, index) => (
                              <>
                                {index > 0 && (
                                  <li
                                    className="flex items-start gap-4"
                                    key={index}
                                  >
                                    <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground w-8 h-8">
                                      <CalendarCheck2Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium">
                                        {notification.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {notification.description}
                                      </p>
                                      <div className="text-xs text-muted-foreground">
                                        Há 2 horas
                                      </div>
                                    </div>
                                  </li>
                                )}
                              </>
                            ))}
                            {user.notifications.length > 0 ? (
                              <Button onClick={handleClearNotifications}>
                                <DeleteIcon />
                              </Button>
                            ) : (
                              <p>Sem notificacões</p>
                            )}
                          </ul>
                          <Separator />
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu> */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex items-center gap-2 p-2 text-white bg-transparent">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback
                              className={`text-black ${
                                user.isDarkMode && "text-white"
                              }`}
                            >
                              {data?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          Olá, {data?.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="flex flex-col w-full">
                          <ul
                            className={`flex flex-col w-[200px] gap-3 p-4 ${
                              user.isDarkMode && "dark bg-black text-white"
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
