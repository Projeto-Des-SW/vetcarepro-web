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
import DashboardClinica from "@/pages/DashboardClinica/DashboardClinica";
import CadastrarServico from "@/pages/CadastrarServico/CadastrarServico";
import ListagemServico from "@/pages/ListagemServico/ListagemServico";
import DetailsPaciente from "@/pages/DetailsPaciente/DetailsPaciente";
import Interna from "@/pages/Interna/Interna";
import DetailsServico from "@/pages/DetailsServico/DetailsServico";
import AgendarConsulta from "@/pages/AgendarConsulta/AgendarConsulta";
import Me from "@/pages/Me/Me";
import CadastroFuncionario from "@/pages/CadastroFuncionario/CadastroFuncionario";
import ListagemFuncionario from "@/pages/listagemFuncionario/listagemFuncionario";

const AppRoutes = () => {
  const user = useUserSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="home" element={<Home />} />
        <Route path="pricing" element={<Pricing />} />
        {user.email ? (
          <>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="profile" element={<Me />} />
              <Route path="cadastrarClinica" element={<CadastroClinica />} />
              <Route path="listagemClinica" element={<ListagemClinica />} />
              <Route
                path="editarClinica/:id"
                element={<CadastroClinica mode="edit" />}
              />
            </Route>

            <Route path="internalClinica/:idClinica" element={<Interna />}>
              <Route path="detailsPaciente/:id" element={<DetailsPaciente />} />
              <Route path="detailsServico/:id" element={<DetailsServico />} />

              <Route path="listagemPaciente" element={<ListagemPaciente />} />
              <Route path="listagemServico" element={<ListagemServico />} />
              <Route
                path="listagemFuncionario"
                element={<ListagemFuncionario />}
              />

              <Route path="cadastrarPaciente" element={<CadastrarPaciente />} />
              <Route path="cadastrarServico" element={<CadastrarServico />} />
              <Route
                path="cadastrarFuncionario"
                element={<CadastroFuncionario />}
              />
              <Route path="agendamento" element={<AgendarConsulta />} />
              <Route path="dashboard" element={<DashboardClinica />} />

              <Route
                path="editarPaciente/:id"
                element={<CadastrarPaciente mode="edit" />}
              />
              <Route
                path="editarServico/:id"
                element={<CadastrarServico mode="edit" />}
              />
              <Route
                path="editarAgendamento"
                element={<AgendarConsulta mode="edit" />}
              />
            </Route>

            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
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
