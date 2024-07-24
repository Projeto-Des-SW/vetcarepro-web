import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login/Login";
import Header from "../components/Header/Header";
import Home from "../pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/home", element: <Home /> },
    ],
  },
]);
