import React from "react";
import { RouterProvider } from "react-router-dom";
import { useUserSelector } from "@/store/hooks";
import { createBrowserRouter } from "react-router-dom";
import Root from "@/pages/Root/Root";
import Home from "@/pages/Home/Home";
import LoginArea from "@/pages/LoginArea/LoginArea";
import Pricing from "@/pages/Pricing/Pricing";
import Dashboard from "@/pages/Dashboard/Dashboard";

const AppRoutes = () => {
  const user = useUserSelector((state) => state.user);

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/login", element: <LoginArea /> },
        { path: "/home", element: <Home /> },
        { path: "/pricing", element: <Pricing /> },
        ...(user.email !== '' ? [{ path: "/dashboard", element: <Dashboard /> }] : []),
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
