export interface IProduct {
  amount: string;
  title: string;
  quantity: number;
  cartQuantity?: number;
  status: boolean;
  clinic_id: string;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface IProductPost {
  amount?: string;
  title?: string;
  quantity?: string;
  type?: string;
}
