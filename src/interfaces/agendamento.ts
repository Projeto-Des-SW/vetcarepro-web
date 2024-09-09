import { IClinicaList } from "./clinicas";
import { IPet } from "./paciente";
import { IService } from "./servico";

export interface IAgendamento {
  clinic_id: string;
  patient_id: string;
  service_id: string;
  date: Date;
}

export interface IAgendamentoGet {
  clinic: IClinicaList;
  clinic_id: string;
  created_at: string;
  date: string;
  id: string;
  patient: IPet;
  patient_id: string;
  service: IService;
  service_id: string;
  updated_at: string;
}
