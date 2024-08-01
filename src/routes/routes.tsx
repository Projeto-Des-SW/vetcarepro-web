import { createBrowserRouter } from "react-router-dom";
import Header from "../components/Header/Header";
import Home from "../pages/Home/Home";
import LoginArea from "@/pages/LoginArea/LoginArea";
import Pricing from "@/pages/Pricing/Pricing";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Root from "@/pages/Root/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/login", element: <LoginArea /> },
      { path: "/home", element: <Home /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);
