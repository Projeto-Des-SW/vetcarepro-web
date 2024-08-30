export interface IClinicaList {
  id: string;
  cnpj: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  created_at: Date;
  updated_at: Date;
  clinic_id: string;
}

export interface ICrud {
  mode?: "create" | "edit";
}
