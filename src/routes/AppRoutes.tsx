import { useUserSelector } from "@/store/hooks";
import { Routes, Route, Navigate } from "react-router-dom";
import Root from "@/pages/Root/Root";
import Home from "@/pages/Home/Home";
import LoginArea from "@/pages/LoginArea/LoginArea";
import Pricing from "@/pages/Pricing/Pricing";
import Dashboard from "@/pages/Dashboard/Dashboard";

const AppRoutes = () => {
  const user = useUserSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="home" element={<Home />} />
        <Route path="pricing" element={<Pricing />} />
        {user.email ? (
          <>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="login" element={<LoginArea />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
