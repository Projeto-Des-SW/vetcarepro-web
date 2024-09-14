("react");
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
import { fetchDataUser } from "@/services/GetServices";

const Header = () => {
  const navigate = useNavigate();
  const user = useUserSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    console.log(checked);
  };

  const handleSetDarkMode = () => {
    dispatch(setDarkMode());
  };

  console.log(user.isDarkMode);

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

  return (
    <>
      <header className="bg-[#4EBA9D] h-[70px] text-primary-foreground px-10 flex items-center">
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
                  <picture>
                    <Avatar className="w-[100px] h-[100px] ">
                      <AvatarFallback className="bg-[#4EBA9D] text-2xl text-white">
                        {data?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </picture>

                  <p>Nivel da conta: Enterprise</p>

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
        <Link
          to="/home"
          className="flex items-center justify-center font-bold text-3xl"
        >
          VetCare
        </Link>
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
                <>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex items-center gap-4 p-2 text-white bg-transparent">
                          {user.notifications.length <= 1 ? (
                            <NotificationsNoneIcon />
                          ) : (
                            <NotificationsActiveIcon />
                          )}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent className="flex flex-col w-full">
                          <ul
                            className={`flex flex-col w-[200px] gap-3 p-4 ${
                              user.isDarkMode && "dark bg-black text-white"
                            }`}
                          >
                            {user.notifications.map((notification, index) => (
                              <li key={index}>
                                <p>{notification.title}</p>
                                <p>{notification.description}</p>
                              </li>
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
                  </NavigationMenu>

                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex items-center gap-2 p-2 text-white bg-transparent">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="text-black  ">
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
                            <Label
                              htmlFor="airplane-mode"
                              className="flex items-center gap-2"
                            >
                              Dark mode
                              <Switch
                                id="airplane-mode"
                                checked={user.isDarkMode}
                                onCheckedChange={handleSetDarkMode}
                              />
                            </Label>

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
                </>
              )}
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
