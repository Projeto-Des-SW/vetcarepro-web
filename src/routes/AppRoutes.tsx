import { useUserSelector } from "@/store/hooks";
import { Routes, Route, Navigate } from "react-router-dom";
import Root from "@/pages/Root/Root";
import Home from "@/pages/Home/Home";
import LoginArea from "@/pages/LoginArea/LoginArea";
import Pricing from "@/pages/Pricing/Pricing";
import Dashboard from "@/pages/Dashboard/Dashboard";
import CadastroClinica from "@/pages/CadastroClinica/CadastroClinica";
import CadastrarPaciente from "@/pages/CadastrarPaciente/CadastrarPaciente";
import ListagemPaciente from "@/pages/ListagemPaciente/ListagemPaciente";
import ListagemClinica from "@/pages/ListagemClinica/ListagemClinica";

const AppRoutes = () => {
  const user = useUserSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="home" element={<Home />} />
        <Route path="pricing" element={<Pricing />} />
        {user.email ? (
          <>
            <Route path="dashboard/listagemClinica" element={<Dashboard />}>
              <Route path="cadastrarClinica" element={<CadastroClinica />} />
              <Route path="cadastrarPaciente" element={<CadastrarPaciente />} />

              <Route path="listagemClinica" element={<ListagemClinica />} />
              <Route path="listagemPaciente" element={<ListagemPaciente />} />
            </Route>

            <Route
              path="/editarPaciente/:id"
              element={<CadastrarPaciente mode="edit" />}
            />
            <Route
              path="/editarClinica/:id"
              element={<CadastroClinica mode="edit" />}
            />
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
