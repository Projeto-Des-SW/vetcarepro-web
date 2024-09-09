import axios from "axios";
import { IService } from "@/interfaces/servico";
import { IPet } from "@/interfaces/paciente";
import { IClinicaList } from "@/interfaces/clinicas";
import { IFuncionario } from "@/interfaces/funcionario";
import { IAgendamentoGet } from "@/interfaces/agendamento";
const baseUrl = import.meta.env.VITE_URL as string;

//Obter a lista de serviços
export const fetchServiceList = async (
  idClinica?: string,
  token?: string
): Promise<IService[]> => {
  const response = await axios.get(`${baseUrl}/clinics/${idClinica}/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//Obter a lista de pacientes
export const fetchPacientsList = async (
  idClinica?: string,
  token?: string
): Promise<IPet[]> => {
  const response = await axios.get(`${baseUrl}/clinics/${idClinica}/patients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//Obter a lista de clinicas
export const fetchClinicasList = async (
  token?: string
): Promise<IClinicaList[]> => {
  const response = await axios.get(`${baseUrl}/clinics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//Obter a lista de funcionarios
export const fetchFuncionariosList = async (
  idClinica?: string,
  token?: string
): Promise<IFuncionario[]> => {
  const response = await axios.get(
    `${baseUrl}/clinics/${idClinica}/employees`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//Obter a lista de agendamentos
export const fetchAgendamentosList = async (
  idClinica?: string,
  token?: string
): Promise<IAgendamentoGet[]> => {
  const response = await axios.get(
    `${baseUrl}/clinics/${idClinica}/schedules`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//Obter detalhes de um serviço
export const fetchServiceItemList = async (
  idClinica?: string,
  id?: string,
  token?: string
): Promise<IService> => {
  const response = await axios.get(
    `${baseUrl}/clinics/${idClinica}/services/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
