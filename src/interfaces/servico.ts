export interface IService {
  id?: string;
  title?: string;
  type?: string;
  amount?: string;
  clinic_id?: string;
  created_at?: string;
}

export interface IServiceGet {
  clinic_id?: string;
  title: string;
  type: string;
  amount: string;
}
