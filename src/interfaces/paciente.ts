export interface IPet {
  id?: string
  clinic_id?: string;
  name: string;
  species: string;
  age: string;
  breed: string;
  guardian_name: string;
  guardian_cpf: string;
  guardian_contact: string;
}

export interface ITemp {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
