export type AssetStatus = "expired" | "urgent" | "upcoming" | "normal";

export type AssetType =
  | "server" | "domain" | "cdn" | "ssl" | "storage"
  | "database" | "email" | "sms" | "monitor" | "collab"
  | "design" | "devtool" | "cloud_drive" | "other";

export type Currency = "CNY" | "USD" | "EUR" | "HKD";

export type RenewalCycle =
  | "daily" | "weekly" | "biweekly" | "monthly"
  | "semiannual" | "annual" | "biannual" | "custom";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  provider: string;
  expireDate: string;
  price: number | null;
  currency: Currency;
  cycle: RenewalCycle | null;
  cycleDays: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RenewalRecord {
  id: string;
  assetId: string;
  amount: number;
  currency: Currency;
  notes: string | null;
  renewedAt: string;
  createdAt: string;
}

export interface AssetDetail extends Asset {
  renewalRecords: RenewalRecord[];
}

export interface Stats {
  total: number;
  expired: number;
  urgent: number;
  upcoming: number;
  normal: number;
}
