import { createBrowserRouter } from "react-router-dom";
import Header from "../components/Header/Header";
import Home from "../pages/Home/Home";
import LoginArea from "@/pages/LoginArea/LoginArea";
import Pricing from "@/pages/Pricing/Pricing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      { path: "/login", element: <LoginArea /> },
      { path: "/home", element: <Home /> },
      { path: "/pricing", element: <Pricing /> },
    ],
  },
]);
