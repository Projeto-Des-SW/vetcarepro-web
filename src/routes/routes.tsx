import { createBrowserRouter, Navigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Home from "../pages/Home/Home";
import LoginArea from "@/pages/LoginArea/LoginArea";
import Pricing from "@/pages/Pricing/Pricing";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Root from "@/pages/Root/Root";
import { useUserSelector } from "@/store/hooks";

const user = useUserSelector((state) => state.user);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/login", element: <LoginArea /> },
      { path: "/home", element: <Home /> },
      { path: "/pricing", element: <Pricing /> },
      ...(user.email
        ? [
            {
              path: "/dashboard",
              element: <Dashboard />,
            },
          ]
        : []),
      {
        path: "/dashboard",
        element: <Navigate to="/login" />,
      },
    ],
  },
]);
