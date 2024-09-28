export interface IAssinatura {
  title: string;
  description: string;
  value: string;
  items: string[];
  details?: string;
  tier: "free" | "standard" | "enterprise" | null;
}
