export interface IAssinatura {
  title: string;
  description: string;
  value: string;
  items: string[];
  details?: string;
  tier: "TIER_ONE" | "TIER_TWO" | "TIER_THREE" | null;
}
